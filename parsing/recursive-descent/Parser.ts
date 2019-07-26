import Lexer from '../lexer/Lexer'
import Token from '../lexer/Token';

export default class Parser {
  protected lookahead: Token

  constructor(protected readonly lexer: Lexer) {
    this.lookahead = lexer.nextToken()
  }

  consume () {
    this.lookahead = this.lexer.nextToken()
  }

  match(x: number) {
    if (this.lookahead.type === x) this.consume()
    else throw new Error(`expecting ${this.lexer.getTokenName(x)}; found ${this.lexer.getTokenName(this.lookahead.type)}`)
  }
}