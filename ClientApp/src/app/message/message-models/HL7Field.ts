import { HL7Component, IHL7Field } from './HL7Component'
import { HL7Segment } from './HL7Segment'
import { MessageDelimeters } from './MessageDelimeters'

export class HL7Field {
   public Components: IHL7Field[] = []

   public constructor(
      public Index: number,
      public Field: string,
      public SegmentName: string,
      protected delimiters: MessageDelimeters,
      public RepititionIndex = -1
   ) {}

   ParseComponents(seperator: string = this.delimiters.ComponentSeperator) {
      let index = 1
      HL7Segment.SplitField(this.Field, seperator, this.delimiters.EscapeCharacter).forEach(
         (component) => {
            if (component != this.Field) {
               let repititionIndex = 0
               HL7Segment.SplitField(
                  component,
                  this.delimiters.RepetitionSeperator,
                  this.delimiters.EscapeCharacter
               ).forEach((repitition) => {
                  if (repitition == component) {
                     let hl7Field = new HL7Component(
                        index,
                        repitition,
                        this.SegmentName,
                        this.delimiters
                     )
                     hl7Field.ParseComponents()
                     this.Components.push(hl7Field)
                  } else {
                     let hl7Field = new HL7Component(
                        index,
                        repitition,
                        this.SegmentName,
                        this.delimiters,
                        repititionIndex++
                     )
                     hl7Field.ParseComponents()
                     this.Components.push(hl7Field)
                  }
                  index++
               })
            }
         }
      )
   }

   public ToString() {
      if (this.Components.length) {
         let output: string[] = []
         this.Components.sort(HL7Field.SortFunction).forEach((subField) => {
            if (subField.Index > 1 && subField.RepititionIndex <= 0) {
               output.push(this.delimiters.ComponentSeperator)
            } else if (subField.RepititionIndex > 0) {
               output.push(this.delimiters.RepetitionSeperator)
            }
            output.push(subField.ToString())
         })
         return output.join('')
      } else {
         return this.Field
      }
   }

   protected static SortFunction(a: IHL7Field, b: IHL7Field) {
      if (a.Index > b.Index) {
         return 1
      } else if (a.Index < b.Index) {
         return -1
      } else {
         if (a.RepititionIndex > b.RepititionIndex) {
            return 1
         } else if (a.RepititionIndex < b.RepititionIndex) {
            return -1
         }
         return 0
      }
   }
}
