package model

type MessageModel struct {
	DateTime         string `json:"dateTime"`
	ConnectionId     string `json:"connectionId"`
	MessageId        string `json:"messageId"`
	MessageStatus    string `json:"messageStatus"`
	Message          string `json:"message"`
	Response         string `json:"response"`
	ConnectionStatus bool   `json:"connectionStatus"`
	ConnectedCount   int    `json:"connectedCount"`
}

const (
	InQueue  string = "InQueue"
	Sending  string = "Sending"
	Sent     string = "Sent"
	Acked    string = "Acked"
	NoAck    string = "NoAck"
	Received string = "Received"
)
