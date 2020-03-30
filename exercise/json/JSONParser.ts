import {Parser} from './Parser'
import { JSONLexer } from './JSONLexer'

export class JSONParser extends Parser {

  json () {
    this.element()
  }

  element () {
    if (this.lookhead.type === JSONLexer.WS) {
      this.match(JSONLexer.WS)
    }
    this.value()
    if (this.lookhead.type === JSONLexer.WS) {
      this.match(JSONLexer.WS)
    }
  }

  value()  {
    if (this.lookhead.type === JSONLexer.BRACKET && this.lookhead.text === '{') {
      this.object()
    } else if (this.lookhead.type === JSONLexer.BRACKET && this.lookhead.text === '[') {
      this.array()
    } else if (this.lookhead.type === JSONLexer.DB_QUOTE) {
      this.string()
    } else if (this.lookhead.type === JSONLexer.NUMBERS) {
      this.numbers()
    } else if (this.lookhead.type === JSONLexer.CHARS && this.lookhead.text === 'true') {
      this.match(JSONLexer.CHARS, 'true')
    } else if (this.lookhead.type === JSONLexer.CHARS && this.lookhead.text === 'false') {
      this.match(JSONLexer.CHARS, 'false')
    } else if (this.lookhead.type === JSONLexer.CHARS && this.lookhead.text === 'null') {
      this.match(JSONLexer.CHARS, 'null')
    } else {
      throw new Error('Invalid token type: ' + JSON.stringify(this.lookhead))
    }
  }

  numbers() {
    this.match(JSONLexer.NUMBERS)
  }

  array () {
    this.match(JSONLexer.BRACKET, '[')
    if (!(this.lookhead.type === JSONLexer.BRACKET && this.lookhead.text === ']')) {
      this.element()
      while(this.lookhead.type === JSONLexer.COMMA) {
        this.match(JSONLexer.COMMA)
        this.element()
      }
    }
    this.match(JSONLexer.BRACKET, ']')
  }

  object() {
    this.match(JSONLexer.BRACKET, '{')
    this.members()
    this.match(JSONLexer.BRACKET, '}')
  }

  members() {
    this.member()
    while (this.lookhead.type === JSONLexer.COMMA) {
      this.match(JSONLexer.COMMA)
      this.member()
    }
  }

  member() {
    if (this.lookhead.type === JSONLexer.WS) {
      this.match(JSONLexer.WS)
    }
    this.string()
    if (this.lookhead.type === JSONLexer.WS) {
      this.match(JSONLexer.WS)
    }
    this.match(JSONLexer.COLON)
    this.element()
  }

  string() {
    this.match(JSONLexer.DB_QUOTE)
    if (this.lookhead.type === JSONLexer.CHARS) {
      this.match(JSONLexer.CHARS)
    }
    this.match(JSONLexer.DB_QUOTE)
  }
}
