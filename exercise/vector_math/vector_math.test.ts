import {tokenize, parse, visit} from './vector_math'

let code = `
  x = 1 + 2
  y = 1*2+3
  z = [1, 2] + [3, 4]
  a = [1, 2] . [3, 4]
  b = 3 * [1, 2]
  c = 3 * [1, 2] . z + y
  print a + 1
`

// test('test tokenize', () => {
//   const tokens = tokenize(code)
//   console.log('code:', code)
//   console.log('tokens:', tokens)
// })

test('test parse', () => {
  // code = 'x = 1+2'
  const tokens = tokenize(code)
  console.log('code:', code)
  console.log('tokens:', tokens)
  const ast = parse(tokens)
  console.log('ast:', JSON.stringify(ast, null, 2))
})