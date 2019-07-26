import Parser from './parsing/recursive-descent/Parser';
import ListParser from './parsing/recursive-descent/ListParser';
import Lexer from './parsing/lexer/Lexer';
import Token from './parsing/lexer/Token';
import ListLexer from './parsing/lexer/ListLexer';
import LookaheadParser from './parsing/multi/LookaheadParser';
import LookaheadLexer from './parsing/multi/LookaheadLexer';


const input = '[aa, [bb, cc]]'
console.log('测试词法解析器：' + input)
const lexer: Lexer = new ListLexer(input)
let token = lexer.nextToken()
while (token.type !== ListLexer.EOF_TYPE) {
  console.log(token.toString())
  token = lexer.nextToken()
}

const input2 = '[aa, [bb, cc]]'
console.log('测试语法解析器：' + input2)
const parse = new ListParser(new ListLexer(input2))
parse.list()
console.log('pass!!!')


const input3 = '[aa, [bb, cc = dd], dd = ee]'
console.log('测试语法解析器：' + input3)
const parse2 = new LookaheadParser(new LookaheadLexer(input3), 2)
parse2.list()
console.log('pass!!!')