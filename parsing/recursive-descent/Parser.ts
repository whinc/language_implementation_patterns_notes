import Lexer from '../lexer/Lexer'
import Token from '../lexer/Token';

export default class Parser {
  protected lookahead: Token

  constructor(protected readonly lexer: Lexer) {
    this.lookahead = lexer.nextToken()
  }

  consume () {
    console.log('consume ' + this.lookahead.toString())
    this.lookahead = this.lexer.nextToken()
  }

  match(x: number) {
    if (this.lookahead.type === x) this.consume()
    else throw new Error(`expecting ${Token.getTokenName(x)}; found ${Token.getTokenName(this.lookahead.type)}`)
  }
}