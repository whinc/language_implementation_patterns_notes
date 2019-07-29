import ListParser from "./ListParser";
import ListLexer from "../lexer/ListLexer";

test("测试 LL(1) 语法解析器", () => {
  expect(() => {
    const input = "[aa, [bb, cc]]";
    const parse = new ListParser(new ListLexer(input));
    parse.list();
  }).not.toThrow();
});
