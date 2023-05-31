package model

type MessageModel struct {
	DateTime         string `json:"dateTime"`
	ConnectionId     string `json:"connectionId"`
	MessageId        string `json:"messageId"`
	MessageStatus    string `json:"messageStatus"`
	Message          string `json:"message"`
	Response         string `json:"response"`
	ConnectionStatus bool   `json:"connectionStatus"`
}

const (
	InQueue  string = "InQueue"
	Sending         = "Sending"
	Sent            = "Sent"
	Acked           = "Acked"
	NoAck           = "NoAck"
	Received        = "Received"
)
