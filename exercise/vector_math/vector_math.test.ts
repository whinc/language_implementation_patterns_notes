import {tokenize, parse, traverser, codeGen} from './vector_math'

const code1 = `
  x = 1 + 2
  y = 1*2+3
  z = [1, 2] + [3, 4]
  a = [1, 2] . [3, 4]
  b = 3 * [1, 2]
  c = 3 * [1, 2] . z + y
  print a + 1
`

const code2 = `
  x = 1 + 2
`

const code = code1

test('test vector math', () => {
  const tokens = tokenize(code)
  console.log('code:', code)
  console.log('tokens:', tokens)
  const ast = parse(tokens)
  console.log('ast:', JSON.stringify(ast, null, 2))
  console.log('codeGen:', codeGen(ast))
  traverser(ast, {
    PlusExpr(node, parent) {
      let tmp = node.left
      node.left = node.right
      node.right = tmp
    }
  })
  console.log('ast(after):', JSON.stringify(ast, null, 2))
  console.log('codeGen(after):', codeGen(ast))
})
