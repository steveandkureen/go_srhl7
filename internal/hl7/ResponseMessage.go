package hl7Messages

import (
	"time"
)

type ResponseMessage struct {
	ReceivedHL7Message *HL7Message
}

func NewResponseMessage(receivedHL7Message *HL7Message) *ResponseMessage {
	return &ResponseMessage{
		ReceivedHL7Message: receivedHL7Message,
	}
}

func (msg *ResponseMessage) BuildMessage() {}

func (msg *ResponseMessage) BuildMSH(messageType string) {
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
	msg.ReceivedHL7Message.Segments = append(msg.ReceivedHL7Message.Segments, segment)
}
