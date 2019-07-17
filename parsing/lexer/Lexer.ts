import Token from "./Token";

export default abstract class Lexer {
  protected p: number = 0;
  protected c: string;

  constructor(protected readonly input: string) {
    this.c = input[this.p] || ''
  }

  consume(): void {
    this.p++;
    if (this.p >= this.input.length) this.c = Token.EOF;
    else this.c = this.input[this.p];
  }

  match(x: string): void {
    if (this.c === x) this.consume();
    else throw new Error(`expecting: ${x}, found: ${this.c}`);
  }

  abstract nextToken(): Token;
}
