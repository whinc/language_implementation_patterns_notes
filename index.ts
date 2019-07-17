import Parser from './parsing/recursive-descent/Parser';
import ListParser from './parsing/recursive-descent/ListParser';
import Lexer from './parsing/lexer/Lexer';
import Token from './parsing/lexer/Token';
import ListLexer from './parsing/lexer/ListLexer';

const lexer: Lexer = new ListLexer('[aa, [bb, cc]]')
const parse = new ListParser(lexer)

parse.list()
console.log('pass!!!')

// let token = lexer.nextToken()
// while (token.type !== Token.EOF_TYPE) {
//   console.log(token.toString())
//   token = lexer.nextToken()
// }
