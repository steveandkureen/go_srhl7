export class MessageDelimeters {
   FieldSeperator: string = '|'
   ComponentSeperator: string = '^'
   SubcomponentSeperator: string = '&'
   RepetitionSeperator: string = '~'
   public EscapeCharacter: string = '\\'

   public constructor(
      fieldSeperator: string = '|',
      componentSeperator: string = '^',
      subcomponentSeperator: string = '&',
      repetitionSeperator: string = '~',
      escapeCharacter: string = '\\'
   ) {
      this.FieldSeperator = fieldSeperator
      this.ComponentSeperator = componentSeperator
      this.SubcomponentSeperator = subcomponentSeperator
      this.RepetitionSeperator = repetitionSeperator
      this.EscapeCharacter = escapeCharacter
   }
}
