package hl7Messages

import (
	"strings"
)

type HL7Segment struct {
	delimiters  MessageDelimiters
	RawSequence string
	Header      string
	Fields      []*HL7Field
	Index       int
}

func NewHL7Segment(delimiters MessageDelimiters) *HL7Segment {
	return &HL7Segment{
		delimiters: delimiters,
		Fields:     []*HL7Field{},
		Index:      -1,
	}
}

func (s *HL7Segment) GetIndex(i int) string {
	for _, f := range s.Fields {
		if f.Index == i {
			return f.String()
		}
	}
	return ""
}

func (s *HL7Segment) SetIndex(i int, value string) {
	for _, f := range s.Fields {
		if f.Index == i {
			f.ParseComponents(value)
		}
	}
}

func (s *HL7Segment) SplitField(data string, delimiter string, escape string, header string) []string {
	index := 0
	results := []string{}
	segment := strings.Builder{}
	escaped := false
	for _, b := range data {
		c := string(b)
		if c == delimiter && !escaped {
			index++
			results = append(results, segment.String())
			segment.Reset()
		} else if c == escape && header != "MSH" && index != 1 {
			escaped = !escaped
		} else {
			escaped = false
			segment.WriteString(c)
		}
	}
	results = append(results, segment.String())
	return results
}

func (s *HL7Segment) ParseLine(line string, lineIndex int) {
	index := 0
	fields := []*HL7Field{}
	for _, field := range s.SplitField(line, s.delimiters.FieldSeperator, s.delimiters.EscapeCharacter, s.Header) {
		if index == 0 {
			s.Header = field
		} else {
			if s.Header == "MSH" && index == 1 {
				hl7Field1 := NewHL7Field(index, s.delimiters.FieldSeperator, s.Header, &s.delimiters, -1)
				fields = append(fields, hl7Field1)
				hl7Field2 := NewHL7Field(index+1, field, s.Header, &s.delimiters, -1)
				fields = append(fields, hl7Field2)
			} else {
				repititionIndex := 0
				for _, repetition := range s.SplitField(field, s.delimiters.RepetitionSeperator, s.delimiters.EscapeCharacter, "") {
					if repetition == field {
						hl7Field := NewHL7Field(index, repetition, s.Header, &s.delimiters, -1)
						if s.Header != "MSH" || index != 1 {
							hl7Field.ParseComponents("")
						}
						fields = append(fields, hl7Field)
					} else {
						hl7Field := NewHL7Field(index, repetition, s.Header, &s.delimiters, repititionIndex)
						hl7Field.ParseComponents("")
						fields = append(fields, hl7Field)
						repititionIndex++
					}
				}
			}
		}
		index++
	}
	s.RawSequence = line
	s.Index = lineIndex
	s.Fields = fields
}

func (s *HL7Segment) String() string {
	fieldCount := 0
	var output strings.Builder
	output.WriteString(s.Header)
	for _, field := range s.Fields {
		if field.RepititionIndex > 0 {
			output.WriteString(s.delimiters.RepetitionSeperator)
			output.WriteString(field.String())
		} else {
			if s.Header == "MSH" && fieldCount == 0 {
				//output.WriteString(field.String())
			} else {
				output.WriteString(s.delimiters.FieldSeperator)
				output.WriteString(field.String())
			}
		}
		fieldCount++
	}
	return output.String()
}
