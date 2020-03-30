import { Lexer, Token } from "./Lexer";

export class Parser {
  protected lexer: Lexer;
  protected lookhead: Token;
  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.lookhead = lexer.nextToken();
  }

  consume() {
    this.lookhead = this.lexer.nextToken();
  }

  match(tokenType: string, tokenText?: string) {
    if (
      (this.lookhead.type === tokenType && tokenText === undefined) ||
      (this.lookhead.type === tokenType && this.lookhead.text === tokenText)
    ) {
      this.consume();
    } else {
      const {lineNum, colNum} = this.lexer.getPos()
      throw new Error(
        `[${lineNum}, ${colNum}] Expected token type: ${tokenType}, received token: ${JSON.stringify(this.lookhead)}`
      );
    }
  }
}
