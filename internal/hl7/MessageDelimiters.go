package hl7Messages

type MessageDelimiters struct {
	FieldSeperator        string
	ComponentSeperator    string
	SubcomponentSeperator string
	RepetitionSeperator   string
	EscapeCharacter       string
}

func NewMessageDelimiters() *MessageDelimiters {
	return &MessageDelimiters{
		FieldSeperator:        "|",
		ComponentSeperator:    "^",
		SubcomponentSeperator: "&",
		RepetitionSeperator:   "~",
		EscapeCharacter:       "\\",
	}
}

func NewCustomMessageDelimiters(fieldSeperator, componentSeperator, subcomponentSeperator, repetitionSeperator, escapeCharacter string) *MessageDelimiters {
	return &MessageDelimiters{
		FieldSeperator:        fieldSeperator,
		ComponentSeperator:    componentSeperator,
		SubcomponentSeperator: subcomponentSeperator,
		RepetitionSeperator:   repetitionSeperator,
		EscapeCharacter:       escapeCharacter,
	}
}
