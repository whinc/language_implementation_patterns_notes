import ListLexer from './ListLexer'
import Lexer from './Lexer';
import Token from './Token';

test('LL(1) 词法解析器', () => {
  const input = '[aa, [bb, cc]]'
  const inputTokens = [
    new Token(ListLexer.LBRACK, '['),
    new Token(ListLexer.NAME, 'aa'),
    new Token(ListLexer.COMMA, ','),
    new Token(ListLexer.LBRACK, '['),
    new Token(ListLexer.NAME, 'bb'),
    new Token(ListLexer.COMMA, ','),
    new Token(ListLexer.NAME, 'cc'),
    new Token(ListLexer.RBRACK, ']'),
    new Token(ListLexer.RBRACK, ']'),
    new Token(ListLexer.EOF_TYPE, ListLexer.EOF),
  ]
  const tokens = []
  const lexer: Lexer = new ListLexer(input)
  let token = lexer.nextToken()
  tokens.push(token)
  while (token.type !== ListLexer.EOF_TYPE) {
    token = lexer.nextToken()
    tokens.push(token)
  }
  expect(tokens).toEqual(inputTokens);
});