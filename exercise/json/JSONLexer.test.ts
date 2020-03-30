import { JSONLexer } from "./JSONLexer";
import Token from "../../parsing/lexer/Token";

test("JSONLexer", () => {
  const source = `{
    name: "a",
    "man": true,
    "children": [{ "name": "b", "age": 18 }]
  }`;
  const lexer = new JSONLexer(source);
  const tokens = [];
  let token = null;
  while ((token = lexer.nextToken()).type !== JSONLexer.EOF_TYPE) {
    tokens.push(token);
  }
  console.log('source:', source)
  console.log('tokens:', tokens)
});
