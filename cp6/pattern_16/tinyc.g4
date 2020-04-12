grammar tinyc;
tinyc: statement+;
statement: var_declaration;
var_declaration: TYPE ID ('=' expression)? ';';
expression: term ('+' term)*;
term: NUMBER | ID;

TYPE: 'int' | 'float';
ID: [\w]+;
NUMBER: [\d]+;