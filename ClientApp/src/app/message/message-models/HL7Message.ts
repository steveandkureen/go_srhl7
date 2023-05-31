import { HL7Field } from './HL7Field'
import { HL7Component } from './HL7Component'
import { HL7Segment } from './HL7Segment'
import { MessageDelimeters } from './MessageDelimeters'

export class HL7Message {
   public Delimeters = new MessageDelimeters('|', '^', '&', '~', '\\')
   public Segments: HL7Segment[] = []

   constructor() {}

   public GetSegments(key: string) {
      return this.Segments.every((s) => s.Header == key)
   }

   public ToString() {
      let output: string[] = []
      this.Segments.sort((m) => m.Index).forEach((segment) => {
         output.push(segment.ToString())
         output.push('\r\n')
      })
      return output.join('')
   }

   public static ParseMessage(text: string): HL7Message {
      var message = new HL7Message()
      let hl7Message = (' ' + text).slice(1)
      if (hl7Message.includes('\n')) {
         hl7Message = hl7Message.replace(/(?:\r\n|\r\r|\r|\n)/g, '\n')
      }

      let lineIndex = 0
      hl7Message.split('\n').forEach((line) => {
         if (lineIndex == 0) {
            let newLine = line.replace('MSH', '')
            message.Delimeters.FieldSeperator = newLine[0]
            message.Delimeters.ComponentSeperator = newLine[1]
            message.Delimeters.RepetitionSeperator = newLine[2]
            message.Delimeters.EscapeCharacter = newLine[3]
            message.Delimeters.SubcomponentSeperator = newLine[4]
         }

         let segment = new HL7Segment(message.Delimeters)
         segment.ParseLine(line, lineIndex++)
         message.Segments.push(segment)
      })
      return message
   }
}
