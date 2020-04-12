import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import {tokenize, TokenType, parse} from './tinyc.ts'

Deno.test(function testTokenize() {
  const source = `int a1 = 10 + 20;`
  const tokens = tokenize(source)
  assertEquals(tokens, [
    {type: TokenType.TYPE_KEYWORD, value: 'int'},
    {type: TokenType.IDENTIFIER, value: 'a1'},
    {type: TokenType.EQUAL, value: '='},
    {type: TokenType.NUMBER, value: '10'},
    {type: TokenType.PLUS, value: '+'},
    {type: TokenType.NUMBER, value: '20'},
    {type: TokenType.SEMICOLON, value: ';'},
  ])
})

Deno.test(function testParse() {
  const source = `int a1 = 10 + 20;`
  const tokens = tokenize(source)
  const ast = parse(tokens)
  console.log('ast', JSON.stringify(ast, null, 2))
})