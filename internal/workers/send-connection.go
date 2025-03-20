package worker

import (
	"errors"
	model "go-srhl7/internal/models"
	"net"
	"strings"
	"time"
)

type SendConnection struct {
	ConnectionId   string
	IpAddress      string
	Port           string
	BeginSequence  string
	EndSequence    string
	Submit         chan (model.MessageModel)
	ack            chan (string)
	Response       chan (model.MessageModel)
	connected      bool
	conn           net.Conn
	ConnectedCount int
}

func CreateSendConnection(connectionId string, ipAddress string, port string) (*SendConnection, error) {
	if len(connectionId) == 0 {
		return nil, errors.New("connectionId cannot be blank;")
	}

	if len(ipAddress) == 0 {
		return nil, errors.New("ipaddress cannot be blank;")
	}

	if len(port) == 0 {
		return nil, errors.New("port cannot be blank;")
	}

	c := new(SendConnection)
	c.ConnectionId = GetSendConnectionId(connectionId)
	c.IpAddress = ipAddress
	c.Port = port
	c.Submit = make(chan model.MessageModel)
	c.Response = make(chan model.MessageModel)
	c.ack = make(chan string)
	c.BeginSequence = "\\011"
	c.EndSequence = "\\028\\013"
	c.connected = false
	c.ConnectedCount = 1
	return c, nil
}

func GetSendConnectionId(clientId string) string {
	return clientId + "_Send"
}

func (s *SendConnection) Connect() {
	s.Submit = make(chan model.MessageModel, 100)
	s.Response = make(chan model.MessageModel, 100)
	s.ack = make(chan string)
	s.ConnectedCount = 1
	go s.runConnection()

}

func (s *SendConnection) CleanData(data string) string {

	data = strings.ReplaceAll(data, "\r", "\r\n")
	data = strings.ReplaceAll(data, ConvertCodeSequence(s.BeginSequence), "")
	data = strings.ReplaceAll(data, ConvertCodeSequence(s.EndSequence), "")
	data = strings.TrimSpace(data)
	return data
}

func (s *SendConnection) runConnection() {
	var err error
	s.connected = true

	s.conn, err = net.DialTimeout("tcp", s.IpAddress+":"+s.Port, time.Duration(time.Duration.Seconds(30)))
	if err != nil {
		s.Disconnect()
		return
	}

	go s.listenForAck() // start thread to listen for ack and watch for disconnect
	for {
		message := <-s.Submit
		if !s.connected {
			break
		}
		message.DateTime = time.Now().Format(time.RFC3339)

		hl7 := ConvertCodeSequence(s.BeginSequence) + message.Message + ConvertCodeSequence(s.EndSequence)
		_, err = s.conn.Write([]byte(hl7))
		if err != nil {
			s.Disconnect()
			break
		}

		message.Response = <-s.ack
		message.MessageStatus = model.Acked
		message.ConnectionStatus = s.connected
		message.ConnectedCount = s.ConnectedCount
		s.Response <- message
		if !s.connected {
			break
		}
	}
}

func (s *SendConnection) listenForAck() {
	builder := strings.Builder{}
	for {
		data := make([]byte, 1024)
		length, err := s.conn.Read(data)
		if err != nil {
			s.Disconnect()
			return
		}

		builder.Write(data[0:length])

		builder := strings.Builder{}
		text := string(data[0:length])
		if strings.Contains(text, ConvertCodeSequence(s.EndSequence)) {
			endIndex := strings.Index(text, ConvertCodeSequence(s.EndSequence))
			builder.WriteString(text[0:endIndex])
			s.ack <- s.CleanData(builder.String())
		} else {
			builder.WriteString(text)
		}
	}
}

func (s *SendConnection) GetSubmitChannel() *chan (model.MessageModel) {
	return &s.Submit
}

func (s *SendConnection) GetResponseChannel() *chan (model.MessageModel) {
	return &s.Response
}

func (s *SendConnection) IsConnected() bool {
	return s.connected
}

func (s *SendConnection) Disconnect() {
	if !s.connected {
		return
	}

	res := model.MessageModel{}
	res.ConnectionStatus = false
	s.ConnectedCount = 0
	s.connected = false
	s.Response <- res // send disconnect message to client
	s.conn.Close()
	s.conn = nil
	close(s.Response)
	close(s.Submit)
	close(s.ack)
}

func (s *SendConnection) GetConnectionId() string {
	return s.ConnectionId
}

func (s *SendConnection) GetConnectedCount() int {
	return s.ConnectedCount
}

func (s *SendConnection) AddConnection() int {
	s.ConnectedCount++
	s.SendConnectionStatus()
	return s.ConnectedCount
}

func (s *SendConnection) RemoveConnection() int {
	s.ConnectedCount--
	s.SendConnectionStatus()
	return s.ConnectedCount
}

func (s *SendConnection) SendConnectionStatus() {
	message := model.MessageModel{}
	message.DateTime = time.Now().Format(time.RFC3339)
	message.Response = ""
	message.MessageStatus = model.Acked
	message.ConnectionStatus = s.connected
	message.ConnectedCount = s.ConnectedCount
	s.Response <- message
}
