import Token from "./Token";

export default abstract class Lexer {
  static EOF = ''
  static EOF_TYPE = 0

  // 向前看字符位置
  protected p: number = 0;
  // 向前看字符
  protected c: string;

  constructor(protected readonly input: string) {
    this.c = input[this.p] || ''
  }

  // 消耗一个字符
  consume(): void {
    this.p++;
    if (this.p >= this.input.length) this.c = Lexer.EOF;
    else this.c = this.input[this.p];
  }

  // 如果匹配就消耗一个字符
  match(x: string): void {
    if (this.c === x) this.consume();
    else throw new Error(`${this.p}: expecting: ${x}, found: ${this.c}`);
  }

  position () {
    return this.p
  }

  // 获取下一个词法单元
  abstract nextToken(): Token;
  abstract getTokenName(tokenType: number): string;
}
