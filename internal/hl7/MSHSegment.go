package hl7Messages

type MSHSegmentDetail struct {
	segment *HL7Segment
}

func NewMSHSegmentDetail(segment *HL7Segment) *MSHSegmentDetail {
	msh := MSHSegmentDetail{}
	msh.segment = segment
	return &msh
}

func (s *MSHSegmentDetail) FieldSeparator() string {
	return string(s.EncodingCharacter()[0])
}

func (s *MSHSegmentDetail) EncodingCharacter() string {
	return s.segment.GetIndex(2)
}

func (s *MSHSegmentDetail) SendingSystem() string {
	return s.segment.GetIndex(2)
}

func (s *MSHSegmentDetail) SetSendingSystem(value string) {
	s.segment.SetIndex(3, value)
}

func (s *MSHSegmentDetail) SendingFacility() string {
	return s.segment.GetIndex(4)
}

func (s *MSHSegmentDetail) SetSendingFacility(value string) {
	s.segment.SetIndex(4, value)
}

func (s *MSHSegmentDetail) ReceivingSystem() string {
	return s.segment.GetIndex(5)
}

func (s *MSHSegmentDetail) SetReceivingSystem(value string) {
	s.segment.SetIndex(6, value)
}

func (s *MSHSegmentDetail) ReceivingFacility() string {
	return s.segment.GetIndex(6)
}

func (s *MSHSegmentDetail) SetReceivingFacility(value string) {
	s.segment.SetIndex(6, value)
}

func (s *MSHSegmentDetail) MessageDateTime() string {
	return s.segment.GetIndex(7)
}

func (s *MSHSegmentDetail) SetMessageDateTime(value string) {
	s.segment.SetIndex(7, value)
}

func (s *MSHSegmentDetail) Security() string {
	return s.segment.GetIndex(8)
}

func (s *MSHSegmentDetail) SetSecurity(value string) {
	s.segment.SetIndex(8, value)
}

func (s *MSHSegmentDetail) MessageType() string {
	return s.segment.GetIndex(9)
}

func (s *MSHSegmentDetail) SetMessageType(value string) {
	s.segment.SetIndex(9, value)
}

func (s *MSHSegmentDetail) MessageControlId() string {
	return s.segment.GetIndex(10)
}

func (s *MSHSegmentDetail) SetMessageControlId(value string) {
	s.segment.SetIndex(10, value)
}

func (s *MSHSegmentDetail) ProcessingId() string {
	return s.segment.GetIndex(11)
}

func (s *MSHSegmentDetail) SetProcessingId(value string) {
	s.segment.SetIndex(11, value)
}

func (s *MSHSegmentDetail) VersionId() string {
	return s.segment.GetIndex(12)
}

func (s *MSHSegmentDetail) SetVersionId(value string) {
	s.segment.SetIndex(12, value)
}
