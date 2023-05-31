package worker

import (
	"errors"
	hl7Messages "go-srhl7/internal/hl7"
	model "go-srhl7/internal/models"
	"net"
	"strings"
	"time"
)

type ListenConnection struct {
	ConnectionId  string
	IpAddress     string
	Port          string
	BeginSequence string
	EndSequence   string
	Submit        chan (model.MessageModel)
	Response      chan (model.MessageModel)
	connected     bool
	conn          *net.Conn
	listener      *net.Listener
}

func CreateListenConnection(connectionId string, ipAddress string, port string) (*ListenConnection, error) {
	if len(connectionId) == 0 {
		return nil, errors.New("connectionId cannot be blank;")
	}

	if len(ipAddress) == 0 {
		return nil, errors.New("ipaddress cannot be blank;")
	}

	if len(port) == 0 {
		return nil, errors.New("port cannot be blank;")
	}

	c := new(ListenConnection)
	c.ConnectionId = GetListenConnectionId(connectionId)
	c.IpAddress = ipAddress
	c.Port = port
	c.Submit = make(chan model.MessageModel)
	c.Response = make(chan model.MessageModel)
	c.BeginSequence = "\\011"
	c.EndSequence = "\\028\\013"
	c.connected = false
	return c, nil
}

func GetListenConnectionId(clientId string) string {
	return clientId + "_Listen"
}

func (l *ListenConnection) Connect() {
	l.Submit = make(chan model.MessageModel, 100)
	l.Response = make(chan model.MessageModel, 100)
	go l.runConnection()

}

func (l *ListenConnection) CleanData(data string) string {

	data = strings.ReplaceAll(data, "\r", "\r\n")
	data = strings.ReplaceAll(data, ConvertCodeSequence(l.BeginSequence), "")
	data = strings.ReplaceAll(data, ConvertCodeSequence(l.EndSequence), "")
	data = strings.TrimSpace(data)
	return data
}

func (l *ListenConnection) runConnection() {
	var err error
	l.connected = true
	listener, err := net.Listen("tcp", l.IpAddress+":"+l.Port)
	l.listener = &listener
	if err != nil {
		return
	}

	for {
		conn, err := listener.Accept()
		l.conn = &conn
		if err != nil {
			return
		}

		builder := strings.Builder{}
		data := make([]byte, 1024)
		for {
			length, err := conn.Read(data)
			if err != nil {
				break
			}
			text := string(data[0:length])
			if strings.Contains(text, ConvertCodeSequence(l.EndSequence)) {
				endIndex := strings.Index(text, ConvertCodeSequence(l.EndSequence))
				builder.WriteString(text[0:endIndex])
				model := l.CreateMessageModel(l.CleanData(builder.String()))
				conn.Write([]byte(ConvertCodeSequence(l.BeginSequence) + model.Response + ConvertCodeSequence(l.EndSequence)))
				l.Response <- *model

				// start builder over
				builder.Reset()
				if endIndex < length {
					builder.WriteString(text[endIndex+1 : length])
				}
			} else {
				builder.WriteString(text)
			}
			if l.connected == false {
				return
			}
		}
	}
}

func (l *ListenConnection) CreateMessageModel(message string) *model.MessageModel {
	messageModel := model.MessageModel{}
	messageModel.ConnectionId = l.ConnectionId
	messageModel.DateTime = time.Now().Format(time.RFC3339)
	messageModel.MessageStatus = model.Acked
	messageModel.Message = message
	ack, err := hl7Messages.CreateAck(message, hl7Messages.AA)
	if err != nil {
		ack = "ack not created"
	}
	messageModel.Response = ack
	return &messageModel
}

func (l *ListenConnection) GetSubmitChannel() *chan (model.MessageModel) {
	return &l.Submit
}

func (l *ListenConnection) GetResponseChannel() *chan (model.MessageModel) {
	return &l.Response
}

func (l *ListenConnection) IsConnected() bool {
	return l.connected
}

func (l *ListenConnection) Disconnect() {
	l.connected = false
	if l.conn != nil {
		(*l.conn).Close()
	}
	if l.listener != nil {
		(*l.listener).Close()
	}
	close(l.Submit)
}

func (l *ListenConnection) GetConnectionId() string {
	return l.ConnectionId
}
