import Parser from "./Parser";
import Lexer from "../lexer/Lexer";
import Token from "../lexer/Token";

export default class ListParser extends Parser {
  constructor (lexer: Lexer) {
    super(lexer)
  }

  list () {
    this.match(Token.LBRACK)
    this.elements()
    this.match(Token.RBRACK)
  }

  elements() {
    this.element()
    while(this.lookahead.type === Token.COMMA) {
      this.match(Token.COMMA)
      this.element()
    }
  }

  element () {
    if (this.lookahead.type === Token.NAME) this.match(Token.NAME)
    else if (this.lookahead.type === Token.LBRACK) this.list()
    else throw new Error('expecting name or list; found ' + this.lookahead.toString())
  }
}