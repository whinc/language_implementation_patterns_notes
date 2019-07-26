import Parser from "./Parser";
import Lexer from "../lexer/Lexer";
import LookaheadLexer from "./LookaheadLexer";

export default class LookaheadParser extends Parser {
  constructor (lexer: Lexer, k: number) {
    super(lexer, k)
  }

  list () {
    this.match(LookaheadLexer.LBRACK)
    this.elements()
    this.match(LookaheadLexer.RBRACK)
  }

  elements() {
    this.element()
    while(this.LA(1) === LookaheadLexer.COMMA) {
      this.match(LookaheadLexer.COMMA)
      this.element()
    }
  }

  element () {
    if (this.LA(1) === LookaheadLexer.NAME && this.LA(2) === LookaheadLexer.EQUALS) {
      this.match(LookaheadLexer.NAME)
      this.match(LookaheadLexer.EQUALS)
      this.match(LookaheadLexer.NAME)
    } else if (this.LA(1) === LookaheadLexer.NAME) {
      this.match(LookaheadLexer.NAME)
    } else if (this.LA(1) === LookaheadLexer.LBRACK) {
      this.list()
    } else {
      throw new Error('expecting name or list; found ' + this.lexer.getTokenName(this.LA(1)))
    }
  }
}