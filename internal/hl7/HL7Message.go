package hl7Messages

import (
	"strings"
)

type HL7Message struct {
	delimiters MessageDelimiters
	Segments   []*HL7Segment
}

func NewHL7Message() *HL7Message {
	delimiters := NewCustomMessageDelimiters("|", "^", "&", "~", "\\")
	return &HL7Message{
		Segments:   make([]*HL7Segment, 0),
		delimiters: *delimiters,
	}
}

func (msg *HL7Message) GetSegmentsByKey(key string) []*HL7Segment {
	segments := make([]*HL7Segment, 0)
	for _, segment := range msg.Segments {
		if segment.Header == key {
			segments = append(segments, segment)
		}
	}
	return segments
}

func (msg *HL7Message) String() string {
	var output strings.Builder
	for _, segment := range msg.Segments {
		output.WriteString(segment.String())
		output.WriteString("\r\n")
	}
	return output.String()
}

func (msg *HL7Message) GetMSHDetail() *MSHSegmentDetail {
	for _, s := range msg.Segments {
		if s.Header == "MSH" {
			return NewMSHSegmentDetail(s)
		}
	}
	return nil
}

func ParseMessage(hl7Message string) (*HL7Message, error) {
	message := NewHL7Message()
	hl7Message = strings.Trim(hl7Message, " ")
	hl7Message = strings.Trim(hl7Message, "\n")
	hl7Message = strings.Trim(hl7Message, "\r")
	if strings.Contains(hl7Message, "\n") {
		hl7Message = strings.ReplaceAll(hl7Message, "\n", "\r")
		hl7Message = strings.ReplaceAll(hl7Message, "\r\r", "\r")
	}

	var lineIndex int
	for _, line := range strings.Split(hl7Message, "\r") {
		if lineIndex == 0 {
			newLine := strings.TrimLeft(line, "MSH")
			message.delimiters.FieldSeperator = string(newLine[0])
			message.delimiters.ComponentSeperator = string(newLine[1])
			message.delimiters.RepetitionSeperator = string(newLine[2])
			message.delimiters.EscapeCharacter = string(newLine[3])
			message.delimiters.SubcomponentSeperator = string(newLine[4])
		}

		segment := NewHL7Segment(message.delimiters)
		segment.ParseLine(line, lineIndex)
		message.Segments = append(message.Segments, segment)
		lineIndex++
	}

	return message, nil
}
