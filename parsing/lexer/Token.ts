export default class Token {
  static EOF = ''
  static EOF_TYPE = 0
  static NAME = 1
  static COMMA = 2
  static LBRACK = 3
  static RBRACK = 4

  static getTokenName (tokenType: number) {
    return ['<EOF>', 'NAME', 'COMMA', 'LBRACK', 'RBRACK'][tokenType]
  }

  type: number;
  text?: string;
  constructor(type: number, text?: string) {
    this.type = type
    this.text = text
  }

  toString () {
    return `<'${this.text}', ${Token.getTokenName(this.type)}>`
  }
}
