import { HL7Field } from './HL7Field'
import { HL7Segment } from './HL7Segment'
import { MessageDelimeters } from './MessageDelimeters'

export interface IHL7Field {
   Components: IHL7Field[]
   Index: number
   Field: string
   SegmentName: string
   RepititionIndex: number
   ToString(): string
}

export class HL7Component implements IHL7Field {
   public Components: IHL7Field[] = []

   public constructor(
      public Index: number,
      public Field: string,
      public SegmentName: string,
      protected delimiters: MessageDelimeters,
      public RepititionIndex = -1
   ) {}

   ParseComponents(seperator: string = this.delimiters.SubcomponentSeperator) {
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

   public ToString(): string {
      if (this.Components.length) {
         let output: string[] = []
         this.Components.sort((f) => f.Index).forEach((subField) => {
            if (subField.Index > 1 && subField.RepititionIndex <= 0) {
               output.push(this.delimiters.SubcomponentSeperator)
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
}
