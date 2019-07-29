import Lexer from "../lexer/Lexer";
import Token from "../lexer/Token";

export default class Parser {
  // 词法解析器
  protected readonly lexer: Lexer;
  // 环形词法单元缓冲区
  protected lookahead: Array<Token>;
  // 向前看符号数
  protected k: number;
  // 下个词法单元的位置
  protected p: number = 0;

  constructor(lexer: Lexer, k: number) {
    this.lexer = lexer;
    this.k = k;
    this.lookahead = new Array<Token>(k);
    for (let i = 0; i < k; ++i) {
      this.consume();
    }
  }

  consume() {
    this.lookahead[this.p] = this.lexer.nextToken();
    this.p = (this.p + 1) % this.k;
  }

  // 向前看的第 i 个词法单元
  LT(i: number): Token {
    return this.lookahead[(this.p + i - 1) % this.k];
  }

  // 向前看的第 i 个词法单元的类型
  LA(i: number): number {
    return this.LT(i).type;
  }

  match(x: number) {
    if (this.LA(1) === x) this.consume();
    else
      throw new Error(
        `${this.lexer.position()}: expecting ${this.lexer.getTokenName(
          x
        )}; found ${this.lexer.getTokenName(this.LA(1))}`
      );
  }
}
