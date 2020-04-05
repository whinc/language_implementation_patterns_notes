grammar vector_math;
statlist: stat+;
stat: ID '=' expr
  | 'print' expr;
expr: multiExpr ('+' multiExpr)*;
multiExpr: primary (('*' | '.') primary)*;
primary: INT | ID | '[' expr (',' expr)* ']';

INT: ('0'..'9')+;
ID: ('a'..'z')+;