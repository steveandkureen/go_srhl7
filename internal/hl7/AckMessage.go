package hl7Messages

import (
	"strings"
	"time"
)

type AckType string

const (
	AA AckType = "AA"
	AE AckType = "AE"
	AR AckType = "AR"
)

type AckMessage struct {
	ReceivedHL7Message *HL7Message
	ResponseAck        AckType
	Segments           []*HL7Segment
}

func NewAckMessage(receivedHL7Message *HL7Message, responseAck AckType) *AckMessage {
	return &AckMessage{
		ReceivedHL7Message: receivedHL7Message,
		ResponseAck:        responseAck,
		Segments:           []*HL7Segment{},
	}
}

func (ackMessage *AckMessage) BuildMSA() {
	msa := NewHL7Segment(ackMessage.ReceivedHL7Message.delimiters)
	msa.Header = "MSA"
	msa.Index = 1
	msh := ackMessage.ReceivedHL7Message.GetMSHDetail()
	msa.Fields = []*HL7Field{
		NewHL7Field(0, string(ackMessage.ResponseAck), "MSA", &ackMessage.ReceivedHL7Message.delimiters, -1),
		NewHL7Field(1, msh.MessageControlId(), "MSA", &ackMessage.ReceivedHL7Message.delimiters, -1),
	}
	ackMessage.Segments = append(ackMessage.Segments, msa)
}

func (msg *AckMessage) BuildMSH(messageType string) {
	msh := msg.ReceivedHL7Message.GetMSHDetail()
	segment := NewHL7Segment(msg.ReceivedHL7Message.delimiters)
	segment.Header = "MSH"
	segment.Index = 0

	segment.Fields = []*HL7Field{
		NewHL7Field(0, msh.FieldSeparator(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(1, msh.EncodingCharacter(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(2, msh.ReceivingSystem(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(3, msh.ReceivingFacility(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(4, msh.SendingSystem(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(5, msh.SendingFacility(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(6, time.Now().String(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(7, msh.Security(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(8, messageType, "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(9, msh.MessageControlId(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(10, msh.ProcessingId(), "MSH", NewMessageDelimiters(), -1),
		NewHL7Field(11, msh.VersionId(), "MSH", NewMessageDelimiters(), -1),
	}
	msg.Segments = append(msg.Segments, segment)
}

func (ackMessage *AckMessage) BuildMessage() {
	ackMessage.BuildMSH("ACK")
	ackMessage.BuildMSA()
}

func (msg *AckMessage) String() string {
	var output strings.Builder
	for _, segment := range msg.Segments {
		output.WriteString(segment.String())
		output.WriteString("\r\n")
	}
	return output.String()
}
