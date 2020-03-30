export interface Token {
  type: string
  text: string
}

export abstract class Lexer {
  static EOF = '\x00'
  static EOF_TYPE = 'eof'

  // 输入字符串序列
  protected source: string
  // 向前看字符位置
  protected p: number = 0;
  // 向前看字符
  protected lookhead: string;
  protected colNum = 1
  protected lineNum = 1

  constructor(source: string) {
    this.source = source
    this.lookhead = source[this.p] || Lexer.EOF
  }

  // 消耗一个字符
  protected consume(): void {
    this.p++;
    if (this.p >= this.source.length) this.lookhead = Lexer.EOF;
    else this.lookhead = this.source[this.p];
    if (this.lookhead === '\n') {
      this.colNum = 0
      this.lineNum++
    } else {
      this.colNum++
    }
  }

  // 如果匹配就消耗一个字符
  protected match(x: string): void {
    if (this.lookhead === x) this.consume();
    else throw new Error(`${this.p}: expecting: ${x}, found: ${this.lookhead}`);
  }

  getPos () {
    return {lineNum: 1, colNum: this.p}
  }

  getCodeFrame (msg: string) {
    const from = Math.max(0, this.p - 10)
    const padding = this.p - from
    return [
      this.lineNum + ':' + this.colNum,
      this.source.slice(from, this.p + 1),
      ' '.repeat(padding) + '^',
      ' '.repeat(padding) + msg
    ].join('\n')
  }

  // 获取下一个词法单元
  abstract nextToken(): Token;
}
