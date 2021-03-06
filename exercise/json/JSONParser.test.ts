import { JSONLexer } from "./JSONLexer";
import { JSONParser } from "./JSONParser";

test("JSONParser", () => {
  const source = `{
    "name": "a",
    "man": true,
    "children": [{ "name": "b", "age": -18 }]
  }`;
  const lexer = new JSONLexer(source);
  const parser = new JSONParser(lexer)
  parser.json()
  // const tokens = [];
  // let token = null;
  // while ((token = lexer.nextToken()).type !== JSONLexer.EOF_TYPE) {
  //   tokens.push(token);
  // }
  // console.log('source:', source)
  // console.log('tokens:', tokens)
});