interface Token {
  type: string,
  value: string
}

interface ParseTree {
  children: ParseTree[]
}

export function parseListTokens(source: string): Token[] {
  const tokens = []
  let i = 0
  while (i < source.length) {
    if (source[i] === '[') {
      tokens.push({type: 'lbracket', value: '['})
      ++i
    } else if (source[i] === ']') {
      tokens.push({type: 'rbracket', value: ']'})
      ++i
    } else if (source[i] === ',') {
      tokens.push({type: 'comma', value: ','})
      ++i
    } else if (/\w/.test(source[i])) {
      let buffer = ''
      while (/\w/.test(source[i])) {
        buffer += source[i]
        ++i
      }
      tokens.push({type: 'name', value: buffer})
    } else if (/\s/.test(source[i])) {
      while (/\s/.test(source[i])) {
        ++i
      }
    } else {
      throw new Error(`invalid token: "${source[i]}"`)
    }
  } 
  return tokens
}

/**
 * 
 * 解析列表，列表支持嵌套，例如 "[a, b, [c, d]]"
 * 
 * 列表文法：
 * grammar list;
 * list: '[' elements ']';
 * elements: element (',' element)*;
 * element: NAME | list;
 * 
 * 后者列表文法：
 * grammar list2;
 * list2: '[' list2 (',' list2)* ']' | NAME;
 * 
 * @param source 
 * @returns 返回解析树
 */
export function parseList(source: string) {
  const tokens = parseListTokens(source)
  let i = 0
  let root: ParseTree | null = null
  let currentNode: ParseTree
  while(i < tokens.length) {
    list()
    // list2()
  }
  return root!

  function match(type: string) {
    if (type === tokens[i].type) {
      currentNode.children.push({token: tokens[i], children: []} as ParseTree)
      ++i
    }
    else throw new Error(`expected token: "${type}", received token: "${tokens[i].type}"`)
  }

  // function list2() {
  //   if (tokens[i].type === 'name') match('name')
  //   else {
  //     match('lbracket')
  //     list2()
  //     while (tokens[i].type === 'comma') {
  //       match('comma')
  //       list2()
  //     }
  //     match('rbracket')
  //   }
  // }

  function list () {
    const node = {rule: 'list', children: []}
    if (!root) {
      root = node
      currentNode = node
    } else {
      currentNode.children.push(node)
    }
    const prevCurrentNode = currentNode
    currentNode = node
    
    match('lbracket')
    elements()
    match('rbracket')

    currentNode = prevCurrentNode
  }

  function elements () {
    const node = {rule: 'elements', children: []}
    if (!root) {
      root = node
      currentNode = node
    } else {
      currentNode.children.push(node)
    }
    const prevCurrentNode = currentNode
    currentNode = node

    element()
    while(tokens[i].type === 'comma') {
      match('comma')
      element()
    }

    currentNode = prevCurrentNode
  }

  function element () {
    const node = {rule: 'element', children: []}
    if (!root) {
      root = node
      currentNode = node
    } else {
      currentNode.children.push(node)
    }
    const prevCurrentNode = currentNode
    currentNode = node

    if (tokens[i].type === 'lbracket') {
      list()
    } else {
      match('name')
    }

    currentNode = prevCurrentNode
  }
}