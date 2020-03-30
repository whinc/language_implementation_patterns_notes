import Lexer from './Lexer'
import Token from "./Token";

export default class ListLexer extends Lexer {
  static NAME = 1
  static COMMA = 2
  static LBRACK = 3
  static RBRACK = 4

  static tokenNames = ['<EOF>', 'NAME', 'COMMA', 'LBRACK', 'RBRACK']

  constructor(input: string) {
    super(input)
  }

  getTokenName (tokenType: number): string {
    return ListLexer.tokenNames[tokenType]
  }

  nextToken(): Token {
    while (this.c !== ListLexer.EOF) {
      switch (this.c) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          this.WS()
          continue
        case ',':
          this.consume()
          return new Token(ListLexer.COMMA, ',')
        case '[':
          this.consume()
          return new Token(ListLexer.LBRACK, '[')
        case ']':
          this.consume()
          return new Token(ListLexer.RBRACK, ']')
        default:
          if (this.isLetter()) return this.NAME()
          else throw new Error('invalid character:' + this.c)
      }
    }
    return new Token(ListLexer.EOF_TYPE, ListLexer.EOF)
  }

  WS () {
    let c = this.c
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') this.consume()
  }

  NAME () {
    let name = ''
    while (this.isLetter()) {
      name += this.c
      this.consume()
    }
    return new Token(ListLexer.NAME, name)
  }

  isLetter () {
    const c = this.c
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
  }
}
