import ListLexer from "./ListLexer";

export default class Token {
  // token 类型
  type: number;
  // token 内容
  text?: string;

  constructor(type: number, text?: string) {
    this.type = type
    this.text = text
  }

  toString () {
    return `<'${this.text}', ${ListLexer.tokenNames[this.type]}>`
  }
}
