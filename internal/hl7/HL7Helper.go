package hl7Messages

import "errors"

func CreateAck(message string, ackType AckType) (string, error) {
	hl7Message, err := ParseMessage(message)
	if err != nil {
		return "", errors.New("meesage failed to parse")
	}

	ackMessage := NewAckMessage(hl7Message, ackType)
	ackMessage.BuildMessage()
	return ackMessage.String(), nil
}
