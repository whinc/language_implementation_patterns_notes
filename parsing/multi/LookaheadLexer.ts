import Lexer from '../lexer/Lexer'
import Token from "../lexer/Token";

export default class LookaheadLexer extends Lexer {
  static NAME = 1
  static COMMA = 2
  static LBRACK = 3
  static RBRACK = 4
  static EQUALS = 5

  static tokenNames = ['<EOF>', 'NAME', 'COMMA', 'LBRACK', 'RBRACK', 'EQUALS']

  constructor(input: string) {
    super(input)
  }

  getTokenName (tokenType: number): string {
    return LookaheadLexer.tokenNames[tokenType]
  }

  nextToken(): Token {
    while (this.c !== LookaheadLexer.EOF) {
      switch (this.c) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          this.WS()
          continue
        case '=':
          this.consume();
          return new Token(LookaheadLexer.EQUALS, '=')
        case ',':
          this.consume()
          return new Token(LookaheadLexer.COMMA, ',')
        case '[':
          this.consume()
          return new Token(LookaheadLexer.LBRACK, '[')
        case ']':
          this.consume()
          return new Token(LookaheadLexer.RBRACK, ']')
        default:
          if (this.isLetter()) return this.NAME()
          else throw new Error('invalid character:' + this.c)
      }
    }
    return new Token(LookaheadLexer.EOF_TYPE, LookaheadLexer.EOF)
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
    return new Token(LookaheadLexer.NAME, name)
  }

  isLetter () {
    const c = this.c
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
  }
}
