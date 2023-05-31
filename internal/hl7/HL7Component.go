package hl7Messages

import (
	"sort"
	"strings"
)

type HL7Component struct {
	*HL7Field
}

func NewHL7Component(index int, component string, segmentName string, delimiters *MessageDelimiters, repititionIndex int) *HL7Component {
	return &HL7Component{
		HL7Field: &HL7Field{
			Delimiters:      delimiters,
			Index:           index,
			Components:      make([]*HL7Component, 0),
			Field:           component,
			SegmentName:     segmentName,
			RepititionIndex: repititionIndex,
		},
	}
}

func (c *HL7Component) ParseComponents() {
	c.HL7Field.ParseComponents(c.Delimiters.SubcomponentSeperator)
}

func (c *HL7Component) String() string {
	if len(c.Components) > 0 {
		var output strings.Builder
		sort.Slice(c.Components, func(i, j int) bool {
			if c.Components[i].Index < c.Components[j].Index {
				return true
			}
			if c.Components[i].Index > c.Components[j].Index {
				return false
			}
			return c.Components[i].RepititionIndex < c.Components[j].RepititionIndex
		})
		for _, subField := range c.Components {
			if subField.Index > 1 && subField.RepititionIndex <= 0 {
				output.WriteString(string(c.Delimiters.SubcomponentSeperator))
			} else if subField.RepititionIndex > 0 {
				output.WriteString(string(c.Delimiters.RepetitionSeperator))
			}
			output.WriteString(subField.String())
		}
		return output.String()
	} else {
		return c.Field
	}
}
