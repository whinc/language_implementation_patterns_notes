import {parseListTokens, parseList} from './list_parser'

test('', () => {
  const source = '[a, b , [c, [d, e]]]'
  // const tokens = parseListTokens(source)
  // console.log(tokens)
  const parseTree = parseList(source)
  console.log(JSON.stringify(parseTree, null, 2))
})
