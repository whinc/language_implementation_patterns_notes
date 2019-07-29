import LookaheadParser from "./LookaheadParser";
import LookaheadLexer from "./LookaheadLexer";

test("测试 LL(k) 语法解析器", () => {
  expect(() => {
    const input = '[aa, [bb, cc = dd], dd = ee]'
    const k = 2
    const parse = new LookaheadParser(new LookaheadLexer(input), k)
    parse.list()
  }).not.toThrow();
});
