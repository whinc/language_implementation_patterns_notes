grammar NameList;
list: '[' elements ']';
elements: element (',' element)*;
element: NAME | list;
NAME: [a-zA-A]+;