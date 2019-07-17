import Lexer from './Lexer'
import Token from "./Token";

export default class ListLexer extends Lexer {
  constructor(input: string) {
    super(input)
  }

  nextToken(): Token {
    while (this.c !== Token.EOF) {
      switch (this.c) {
        case " ":
        case "\t":
        case "\n":
        case "\r":
          this.WS()
          continue
        case ',':
          this.consume()
          return new Token(Token.COMMA, ',')
        case '[':
          this.consume()
          return new Token(Token.LBRACK, '[')
        case ']':
          this.consume()
          return new Token(Token.RBRACK, ']')
        default:
          if (this.isLetter()) return this.NAME()
          else throw new Error('invalid character:' + this.c)
      }
    }
    return new Token(Token.EOF_TYPE, Token.EOF)
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
    return new Token(Token.NAME, name)
  }

  isLetter () {
    const c = this.c
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
  }
}
