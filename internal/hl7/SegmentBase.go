package hl7Messages

import (
	"fmt"
	"reflect"
	"runtime"
)

type SegmentBase struct {
	Segment *HL7Segment
}

func NewSegmentBase(segment *HL7Segment) *SegmentBase {
	return &SegmentBase{Segment: segment}
}

func (s *SegmentBase) ReadSequence(index int) string {
	if index >= len(s.Segment.Fields) {
		return ""
	}

	field := s.Segment.Fields[index]
	if field.String() != "" {
		return field.String()
	}

	memberName := ""
	pc, _, _, ok := runtime.Caller(1)
	if ok {
		fn := runtime.FuncForPC(pc)
		memberName = fn.Name()
	}

	if s.IsPropertyRequired(memberName) {
		panic(fmt.Sprintf("%s is a required missing property.", memberName))
	}

	return ""
}

func (s *SegmentBase) IsPropertyRequired(memberName string) bool {
	prop, ok := reflect.TypeOf(s).Elem().FieldByName(memberName)
	if !ok {
		return false
	}

	required, ok := prop.Tag.Lookup("required")
	if !ok {
		return false
	}

	return required == "true"
}

func (s *SegmentBase) SetSequence(index int, value string) {
	if index >= len(s.Segment.Fields) {
		for i := len(s.Segment.Fields) - 1; i < index; i++ {
			field := NewHL7Field(i, "", s.Segment.Header, &MessageDelimiters{}, -1)
			s.Segment.Fields = append(s.Segment.Fields, field)
		}
	}

	if value == "" && s.IsPropertyRequired(runtime.FuncForPC(reflect.ValueOf(s.SetSequence).Pointer()).Name()) {
		panic(fmt.Sprintf("%s is a required missing property.", runtime.FuncForPC(reflect.ValueOf(s.SetSequence).Pointer()).Name()))
	}

	s.Segment.Fields[index].Field = value
}
