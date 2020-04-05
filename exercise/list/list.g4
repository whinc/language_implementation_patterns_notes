grammar list;
list: '[' elements ']';
elements: element (',' element)*;
element: NAME | list;

// grammar list2;
// list2: '[' list2 (',' list2)* ']' | NAME;

NAME: ('a'..'z')+;