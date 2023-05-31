package hl7Messages

import (
	"bytes"
	"strings"
)

type HL7Field struct {
	Delimiters      *MessageDelimiters
	Index           int
	Components      []*HL7Component
	Field           string
	SegmentName     string
	RepititionIndex int
}

func NewHL7Field(index int, field, segmentName string, delimiters *MessageDelimiters, repititionIndex int) *HL7Field {
	return &HL7Field{
		Delimiters:      delimiters,
		Index:           index,
		Components:      []*HL7Component{},
		Field:           field,
		SegmentName:     segmentName,
		RepititionIndex: repititionIndex,
	}
}

func (f *HL7Field) ParseComponents(seperator string) {
	if seperator == "" {
		seperator = f.Delimiters.ComponentSeperator
	}
	index := 1
	for _, component := range strings.Split(f.Field, string(seperator)) {
		if component != f.Field {
			repititionIndex := 0
			for _, repitition := range strings.Split(component, string(f.Delimiters.RepetitionSeperator)) {
				if repitition == component {
					hl7Field := NewHL7Component(index, repitition, f.SegmentName, f.Delimiters, -1)
					hl7Field.ParseComponents()
					f.Components = append(f.Components, hl7Field)
				} else {
					hl7Field := NewHL7Component(index, repitition, f.SegmentName, f.Delimiters, repititionIndex)
					hl7Field.ParseComponents()
					f.Components = append(f.Components, hl7Field)
					repititionIndex++
				}
				index++
			}
		}
	}
}

func (f *HL7Field) GetComponent(index int) *HL7Component {
	for _, c := range f.Components {
		if c.Index == index {
			return c
		}
	}
	return nil
}

func (f *HL7Field) String() string {
	if len(f.Components) > 0 {
		var output bytes.Buffer
		for _, subField := range f.Components {
			if subField.Index > 1 && subField.RepititionIndex <= 0 {
				output.WriteString(string(f.Delimiters.ComponentSeperator))
			} else if subField.RepititionIndex > 0 {
				output.WriteString(string(f.Delimiters.RepetitionSeperator))
			}
			output.WriteString(subField.String())
		}
		return output.String()
	} else {
		return f.Field
	}
}
