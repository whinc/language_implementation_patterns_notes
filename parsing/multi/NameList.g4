grammar NameList;
list: '[' elements ']';
elements: element (',' element)*;
element: NAME '=' NAME | NAME | list;
NAME: [a-zA-A]+;