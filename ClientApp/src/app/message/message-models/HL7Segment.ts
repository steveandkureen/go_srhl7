import { MessageDelimeters } from './MessageDelimeters'
import { format } from 'date-fns'
import { HL7Field } from './HL7Field'

export class HL7Segment {
   public RawSequence: string
   public Header: string
   public Index: number
   public Fields: HL7Field[]

   public constructor(private delimiters: MessageDelimeters) {
      this.RawSequence = ''
      this.Index = -1
      this.Header = ''
      this.Fields = []
   }

   public ParseLine(line: string, lineIndex: number) {
      let index = 0
      let fields: HL7Field[] = []
      HL7Segment.SplitField(
         line,
         this.delimiters.FieldSeperator,
         this.delimiters.EscapeCharacter,
         this.Header
      ).forEach((field) => {
         if (index == 0) {
            this.Header = field
         } else {
            let repititionIndex = 0
            if (this.Header == 'MSH' && index == 1) {
               let hl7Field = new HL7Field(
                  index++,
                  this.delimiters.FieldSeperator,
                  this.Header,
                  this.delimiters
               )
               fields.push(hl7Field)
               hl7Field = new HL7Field(index, field, this.Header, this.delimiters)
               fields.push(hl7Field)
            } else {
               HL7Segment.SplitField(
                  field,
                  this.delimiters.RepetitionSeperator,
                  this.delimiters.EscapeCharacter
               ).forEach((repitition) => {
                  if (repitition == field) {
                     let hl7Field = new HL7Field(index, repitition, this.Header, this.delimiters)
                     if (this.Header == 'MSH' || index != 1) {
                        hl7Field.ParseComponents()
                     }
                     fields.push(hl7Field)
                  } else {
                     let hl7Field = new HL7Field(
                        index,
                        repitition,
                        this.Header,
                        this.delimiters,
                        repititionIndex++
                     )
                     hl7Field.ParseComponents()
                     fields.push(hl7Field)
                  }
               })
            }
         }
         index++
      })
      this.RawSequence = line
      this.Index = lineIndex
      this.Fields = fields
   }

   public static SplitField(data: string, delimeter: string, escape: string, header: string = '') {
      let index = 0
      let result: string[] = []
      let segment: string[] = []
      let escaped = false
      Array.from(data).forEach((c) => {
         if (c == delimeter && !escaped) {
            index++
            result.push(segment.join(''))
            segment = []
         } else if (c == escape && header != 'MSH' && index != 1) {
            escaped = !escaped
         } else {
            escaped = false
            segment.push(c)
         }
      })
      result.push(segment.join(''))
      return result
   }

   public getField(index: number) {
      return this.Fields.find((f) => f.Index == index)
   }

   public static FromatDate(date: Date): string {
      return format(date, 'yyyyMMddhhmmss')
   }

   public ToString(): string {
      let fieldCount: number = 0
      let output: string[] = []
      output.push(this.Header)
      this.Fields.forEach((sequence) => {
         if (sequence.RepititionIndex > 0) {
            output.push(`${this.delimiters.RepetitionSeperator}${sequence.ToString()}`)
         } else {
            if (this.Header == 'MSH' && fieldCount == 0) {
            } else {
               output.push(`${this.delimiters.FieldSeperator}${sequence.ToString()}`)
            }
         }
         fieldCount++
      })
      return output.join('')
   }
}
