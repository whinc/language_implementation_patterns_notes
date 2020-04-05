export type Token = {
  type: string;
  value: string;
};

export type AST = {
  type: string
  [key: string]: any
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    if (source[i] === "[")
      tokens.push({ type: "lbracket", value: source[i++] });
    else if (source[i] === "]")
      tokens.push({ type: "rbracket", value: source[i++] });
    else if (source[i] === ",")
      tokens.push({ type: "comma", value: source[i++] });
    else if (source[i] === "*")
      tokens.push({ type: "multi", value: source[i++] });
    else if (source[i] === ".")
      tokens.push({ type: "dot", value: source[i++] });
    else if (source[i] === "+")
      tokens.push({ type: "plus", value: source[i++] });
    else if (source[i] === "=")
      tokens.push({ type: "equal", value: source[i++] });
    else if (/\s/.test(source[i])) {
      // skip whitespace
      while (/\s/.test(source[i])) ++i;
    } else if (/[a-z]/.test(source[i])) {
      let buffer = "";
      while (/[a-z]/.test(source[i])) {
        buffer += source[i];
        ++i;
      }
      if (buffer === "print") tokens.push({ type: "keyword", value: buffer });
      else tokens.push({ type: "identifier", value: buffer });
    } else if (/\d/.test(source[i])) {
      let buffer = "";
      while (/\d/.test(source[i])) {
        buffer += source[i];
        ++i;
      }
      tokens.push({ type: "number", value: buffer });
    } else {
      throw new Error('Invalid token: "' + source[i] + '"');
    }
  }
  return tokens;
}

export function parse(tokens: Token[]): AST {
  let i = -1 
  let lookhead: Token
  let ast: AST = {
    type: 'Program',
    body: [] as any[]
  };
  consume()
  statlist();
  return ast;

  function consume(){
    lookhead = tokens[++i] || {type: 'eof', value: 'eof'}
  }

  function match(tokenType: string, tokenValue?: string): Token {
    if (tokenValue === undefined && tokenType === lookhead.type) {
      const token = lookhead
      consume();
      return token
    }
    else if (tokenValue !== undefined && tokenType === lookhead.type && tokenValue === lookhead.value) {
      const token = lookhead
      consume() 
      return token
    }
    else
      throw new Error(
        `Invalid token: expect token "${JSON.stringify({type: tokenType, value: tokenValue})}", received token type ${lookhead}`
      );
  }

  function statlist() {
    do {
      ast.body.push(stat());
    } while (
      (lookhead.type === "keyword" && lookhead.value === "print") ||
      lookhead.type === "identifier"
    );
  }

  function stat(): AST {
    if (lookhead.type === 'identifier') {
      const token = match('identifier')
      match('equal')
      const ast = plusExpr()
      return {
        type: 'Assignment',
        left: {
          type: 'identifier',
          value: token.value
        },
        right: ast
      }
    } else if (lookhead.type === 'keyword' && lookhead.value === 'print') {
      const token = match('keyword', 'print')
      const ast = plusExpr()
      return {
        type: 'CallExpression',
        name: token.value,
        params: [ast]
      }
    } else {
      throw new Error(`Invalid stat: ${JSON.stringify(lookhead)}`)
    }
  }

  function plusExpr (): AST {
    const ast = multiExpr()
    let prevAst = ast
    while (lookhead.type === 'plus') {
      match('plus')
      const ast = multiExpr()
      prevAst = {
        type: 'PlusExpr',
        left: prevAst,
        right: ast
      }
    }
    return prevAst
  }

  function multiExpr(): AST {
    const ast = primary()
    let prevAst = ast
    while(lookhead.type === 'multi' || lookhead.type === 'dot') {
      let ast: AST
      if (lookhead.type === 'multi') {
        match('multi')
        ast = {type: 'MultiExpr'}
      }
      else {
        match('dot')
        ast = {type: 'DotExpr'}
      }
      ast.left = prevAst
      ast.right = primary()
      prevAst = ast
    }
    return prevAst
  }

  function primary(): AST {
    if (lookhead.type === 'identifier') {
      const token = match('identifier')
      return {
        type: 'identifier',
        value: token.value
      }
    } else if (lookhead.type === 'number') {
      const token = match('number')
      return {
        type: 'number',
        value: token.value
      }
    } else if (lookhead.type == 'lbracket') {
      const ast: AST = {
        type: 'Vector',
        value: []
      }
      match('lbracket')
      ast.value.push(plusExpr())
      while(lookhead.type === 'comma') {
        match('comma')
        ast.value.push(plusExpr())
      }
      match('rbracket')
      return ast
    } else {
      throw new Error('Invalid stat')
    }
  }
}

export function traverser(ast: AST, visitor: {[key: string]: (node: AST, parent: AST | null) => void}) {
  function traverserNode(node: AST, parent: AST | null) {
    if (visitor[node.type]) {
      visitor[node.type](node, parent)
    }
    switch(node.type) {
      case 'Program':
        node.body.forEach((item: AST) => traverserNode(item, node))
        break
      case 'PlusExpr':
        traverserNode(node.left, node)
        traverserNode(node.right, node)
        break
      case 'MultiExpr':
        traverserNode(node.left, node)
        traverserNode(node.right, node)
        break
      case 'DotExpr':
        traverserNode(node.left, node)
        traverserNode(node.right, node)
        break
      case 'Vector':
        node.value.forEach((item: AST) => traverserNode(item, node))
        break
      case "CallExpression":
        node.params.forEach((item: AST) => traverserNode(item, node))
        break
      case 'Assignment':
        traverserNode(node.left, node)
        traverserNode(node.right, node)
        break
      case 'identifier':
      case 'number':
        break
      default:
        throw new Error('Unknow node type: "' + node.type + '"')
    }
  }

  return traverserNode(ast, null)
}


export function codeGen(ast: AST): string {
  switch(ast.type) {
    case 'Program':
      return ast.body.map((item: any) => codeGen(item)).join('\n')
    case 'PlusExpr':
      return `${codeGen(ast.left)} + ${codeGen(ast.right)}`
    case 'MultiExpr':
      return `${codeGen(ast.left)} * ${codeGen(ast.right)}`
    case 'DotExpr':
      return `${codeGen(ast.left)} . ${codeGen(ast.right)}`
    case 'Vector':
      return '[' + ast.value.map((item: any) => codeGen(item)).join(', ') + ']'
    case 'CallExpression':
      return ast.name + ' ' + ast.params.map((item: any) => codeGen(item)).join(' ')
    case 'Assignment':
      return `${codeGen(ast.left)} = ${codeGen(ast.right)}`
    case 'identifier':
    case 'number':
      return ast.value
    default: 
      return 'unkown: "' + ast.type + '"'
  }
}