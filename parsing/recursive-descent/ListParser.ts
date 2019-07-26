import Parser from "./Parser";
import Lexer from "../lexer/Lexer";
import ListLexer from "../lexer/ListLexer";

export default class ListParser extends Parser {
  constructor (lexer: Lexer) {
    super(lexer)
  }

  list () {
    this.match(ListLexer.LBRACK)
    this.elements()
    this.match(ListLexer.RBRACK)
  }

  elements() {
    this.element()
    while(this.lookahead.type === ListLexer.COMMA) {
      this.match(ListLexer.COMMA)
      this.element()
    }
  }

  element () {
    if (this.lookahead.type === ListLexer.NAME) this.match(ListLexer.NAME)
    else if (this.lookahead.type === ListLexer.LBRACK) this.list()
    else throw new Error('expecting name or list; found ' + this.lexer.getTokenName(this.lookahead.type))
  }
}