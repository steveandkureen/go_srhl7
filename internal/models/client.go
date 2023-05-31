package model

type Client struct {
	ClientId      string   `json:"clientId"`
	IpAddresses   []string `json:"ipAddresses"`
	SendingPort   string   `json:"sendingPort"`
	ListeningPort string   `json:"listeningPort"`
	Name          string   `json:"name"`
	ConnectOnLoad bool     `json:"connectOnLoad"`
}
