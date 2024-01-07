package worker

import (
	model "go-srhl7/internal/models"
	"strconv"
	"strings"
)

type Connection interface {
	Connect()
	Disconnect()
	GetSubmitChannel() *chan (model.MessageModel)
	GetResponseChannel() *chan (model.MessageModel)
	IsConnected() bool
	GetConnectionId() string
}

func ConvertCodeSequence(strCodeSeq string) string {
	var strSeq string
	codes := strings.Split(strCodeSeq, "\\")
	for _, strCode := range codes {
		if strCode != "" {
			iCharValue, _ := strconv.Atoi(strCode)
			strSeq += string(rune(iCharValue))
		}
	}
	return strSeq
}
