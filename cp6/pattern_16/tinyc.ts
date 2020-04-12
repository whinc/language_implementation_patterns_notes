export enum TokenType {
  EOF,
  NUMBER,
  PLUS,
  SEMICOLON,
  EQUAL,
  TYPE_KEYWORD,
  IDENTIFIER,
  WHITESPACE
}

type Token = {
  type: TokenType;
  value: string;
};

type AST = {
  type: string;
  [key: string]: any
};

type Program = AST & {
  statements: VarDeclaration[]
}

type VarDeclaration = AST & {
  identifierType: Token
  identifier: Token
  expression?: Expression
}

type Expression = AST & {
  left: Term
  operator: string
  right: Expression
}

type Term = AST & {
  value: Token
}

/**
 * 符号
 * 符号包含三个方面：名称、类型、类别，其中类别通过不同子类区分
 */
abstract class BaseSymbol {
  constructor(public readonly name: string, public readonly type?: string) {}
}

class BuiltInTypeSymbol extends BaseSymbol {
  constructor(public readonly name: string) {
    super(name, name)
  }
}

/**
 * 作用域接口
 */
interface IScope {
  getScopeName(): string;
  getEnclosingScope(): IScope | null;
  define(symbol: BaseSymbol): void;
  resolve(name: string): BaseSymbol | null;
}

/**
 * 符号表，负责存储程序中出现的符号信息，由于是单作用域，符号表同时还充当作用域（实现IScope接口）
 */
class SymbolTable implements IScope {
  private readonly name = 'global'
  private readonly symbols: Record<string, BaseSymbol> = {
    'int': new BuiltInTypeSymbol('int'),
    'float': new BuiltInTypeSymbol('float'),
  }

  getScopeName(): string {
    return this.name;
  }
  getEnclosingScope(): IScope | null {
    return null;
  }
  define(symbol: BaseSymbol): void {
    this.symbols[symbol.name] = symbol;
  }
  resolve(name: string): BaseSymbol | null {
    return this.symbols[name] ?? null;
  }
}


const KEYWORDS = ['int', 'float']
const EOF = ''

export function tokenize(source: string): Token[] {
  if (!source) return []
  const tokens: Token[] = []
  // 下一个字符的位置
  let i = 0
  let lookhead = source[0]
  // 读取下一个字符
  const consume = () => {
    lookhead = source[++i] ?? EOF
  }

  while (lookhead !== EOF) {
    switch (lookhead) {
      case '+':
        tokens.push({type: TokenType.PLUS, value: lookhead})
        consume()
        continue
      case ';':
        tokens.push({type: TokenType.SEMICOLON, value: lookhead})
        consume()
        continue
      case '=':
        tokens.push({type: TokenType.EQUAL, value: lookhead})
        consume()
        continue
    }
    if (/\d/.test(lookhead)) {
      let buffer = ''
      do {
        buffer += lookhead
        consume()
      } while(/\d/.test(lookhead))
      tokens.push({type: TokenType.NUMBER,  value: buffer})
      continue
    }
    if (/\w/.test(lookhead)) {
      let buffer = ''
      do {
        buffer += lookhead
        consume()
      } while(/\w/.test(lookhead))
      if (KEYWORDS.some(v => v === buffer)) {
        tokens.push({type: TokenType.TYPE_KEYWORD, value: buffer})
      } else {
        tokens.push({type: TokenType.IDENTIFIER,  value: buffer})
      }
      continue
    }
    if (/\s/.test(lookhead)) {
      do {
        consume()
      } while(/\s/.test(lookhead))
      continue
    }
    throw new Error('Unknown token: "' + lookhead + '"')
  }
  return tokens;
}

/**
 * 语法解析，生成抽象语法树
 * @param tokens 
 */
export function parse(tokens: Token[]): Program {
  const ast: Program = {
    type: 'Program',
    statements: []
  }
  if (tokens.length === 0) return ast

  let i = 0
  let lookhead = tokens[0]
  do {
    ast.statements.push(statement())
  } while(lookhead.type !== TokenType.EOF)

  return ast;

  function consume() {
    lookhead = tokens[++i] ?? {type: TokenType.EOF, value: EOF}
  }
  function match (tokenType: TokenType): Token {
    if (lookhead.type === tokenType) {
      const _lookhead = lookhead
      consume()
      return _lookhead
    } else {
      throw new Error(`(${i}) Invalid token type: "${TokenType[lookhead.type]}", expected token type: "${TokenType[tokenType]}"`)
    }
  }

  function statement () {
    return var_declaration()
  }

  function var_declaration() : VarDeclaration {
    const ast: AST = {
      type: 'VarDeclaration'
    }
    ast.identifierType = match(TokenType.TYPE_KEYWORD)
    ast.identifier = match(TokenType.IDENTIFIER)
    if (lookhead.type === TokenType.EQUAL) {
      match(TokenType.EQUAL)
      ast.expression = expression()
    }
    match(TokenType.SEMICOLON)
    return ast as VarDeclaration
  }

  function expression (): Expression {
    let ast = term()
    let prevAst: AST = ast
    while(lookhead.type === TokenType.PLUS) {
      const newAst: AST = {
        type: 'Expression'
      }
      newAst.left = prevAst
      newAst.operator = match(TokenType.PLUS)
      newAst.right = term()
      prevAst = newAst
    }
    return prevAst as Expression
  }

  function term () : Term {
    if (lookhead.type === TokenType.NUMBER) {
      return {type: 'Term', value: match(TokenType.NUMBER)}
    } else if (lookhead.type == TokenType.IDENTIFIER) {
      return {type: 'Term', value: match(TokenType.IDENTIFIER)}
    } else {
      throw new Error(`Invalid statement`)
    }
  }
}

export function symbolTable(ast: AST): SymbolTable {
  const symbolTable = new SymbolTable();
  return symbolTable
}
