import {Lexer, Token} from './Lexer'

export class JSONLexer extends Lexer {
  static BRACKET = 'bracket'
  static BOOLEAN = 'boolean'
  static CHARS = 'chars'
  static NUMBERS = 'numbers'
  static COMMA = 'comma'
  static COLON = 'colon'
  static DB_QUOTE = 'db_quote'
  static WS = 'white_space'

  nextToken(): Token {
    let c: string
    while((c = this.lookhead) !== Lexer.EOF) {
      switch (c) {
        case '[': 
        case ']': 
        case '{': 
        case '}': 
          this.consume()
          return {type: JSONLexer.BRACKET, text: c}
        case ',': this.consume(); return {type: JSONLexer.COMMA, text: c}
        case ':': this.consume(); return {type: JSONLexer.COLON, text: c}
        case '"': this.consume(); return {type: JSONLexer.DB_QUOTE, text: c}
        case '\u0020':
        case '\u000A':
        case '\u000D':
        case '\u0009':
          return this.WS()
        default: {
          if (/\d/.test(this.lookhead)) return this.NUMBERS()
          if (/\w/.test(this.lookhead)) return this.CHARS()
          throw new Error(this.getCodeFrame('invalid char: ' + this.lookhead))
        }
      }
    }
    return {type: JSONLexer.EOF_TYPE, text: Lexer.EOF}
  }

  WS(): Token {
    let buffer = ''
    while(/\u0020|\u000A|\u000D|\u0009/.test(this.lookhead)) {
      buffer += this.lookhead
      this.consume()
    }
    return {type: JSONLexer.WS, text: buffer}
  }

  NUMBERS (): Token {
    let buffer = ''
    while(/\d/.test(this.lookhead)) {
      buffer += this.lookhead
      this.consume()
    }
    return {type: JSONLexer.NUMBERS, text: buffer}
  }

  CHARS (): Token {
    let buffer = ''
    while(/\w/.test(this.lookhead)) {
      buffer += this.lookhead
      this.consume()
    }
    return {type: JSONLexer.CHARS, text: buffer}
  }
}