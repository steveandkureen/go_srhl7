package model

type ConnectionModel struct {
	ClientId     string `json:"clientId"`
	IpAddress    string `json:"ipAddress"`
	Port         string `json:"port"`
	Type         string `json:"type"`
	ConnectionId string `json:"connectionId"`
}

const (
	SendType   string = "Sending"
	ListenType string = "Listenting"
)
