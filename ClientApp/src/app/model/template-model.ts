export interface TemplateModel {
  templateId: string;
  clientId: string;
  body: string;
  name: string;
  description: string;
  macros: TemplateMacro[];
}

export interface TemplateMacro {
  macro: string;
  default: string;
  min: number;
  max: number;
  value: string;
  macroType: MacroType;
}

export enum MacroType {
  StringMacro = 'StringMacro',
  CounterMacro = 'CounterMacro',
  RandomMacro = 'RandomMacro',
}

export var parseMacros = (text: string) => {
  let regexString = /{{(.*?)}}/g;

  let newMacros: TemplateMacro[] = [];
  let matches = text.match(regexString);
  matches?.forEach((match) => {
    if (!newMacros.some((m) => m.macro == match)) {
      newMacros.push(parseMacro(match));
    }
  });
  return newMacros;
};

export var parseMacro = (text: string) => {
  let macro: TemplateMacro = {
    macro: text,
    default: '',
    min: 0,
    max: 0,
    value: '',
    macroType: MacroType.StringMacro,
  };

  let macroText = text.replace('{{', '').replace('}}', '');
  let mainParts = macroText.split(':');
  if (mainParts[0] == '0' || mainParts[0] == '1') {
    parseNumberMacro(mainParts, macro);
  } else {
    parseStringMacro(mainParts, macro);
  }
  return macro;
};

export var parseStringMacro = (parts: string[], marcro: TemplateMacro) => {
  marcro.macroType = MacroType.StringMacro;
  if (parts.length > 1) {
    marcro.default = parts[1];
  }
};

export var parseNumberMacro = (parts: string[], marcro: TemplateMacro) => {
  if (parts[0] == '1') {
    marcro.macroType = MacroType.CounterMacro;
  } else {
    marcro.macroType = MacroType.RandomMacro;
  }

  if (parts.length > 1) {
    let secondParts = parts[1].split(',');
    if (secondParts.length > 1) {
      marcro.min = parseInt(secondParts[0]);
      marcro.max = parseInt(secondParts[1]);
    }
  }
};

export var generateMessages = (
  template: TemplateModel,
  count: number
): string[] => {
  let macros = template.macros;
  let messages: string[] = [];

  for (let i = 0; i < count; i++) {
    let messageText = template.body;
    macros.forEach((m) => {
      if (m.macroType == MacroType.StringMacro) {
        messageText = messageText.replaceAll(m.macro, m.default);
      } else if (m.macroType == MacroType.RandomMacro) {
        let num = Math.floor(Math.random() * m.max) + m.min;
        messageText = messageText.replaceAll(m.macro, num.toString());
      } else {
        messageText = messageText.replaceAll(m.macro, (m.min + i).toString());
      }
    });
    messages.push(messageText);
  }
  return messages;
};
