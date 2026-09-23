interface Variable {
  type: "variable";
  name: string;
}

interface Operator {
  type: "operator";
  value:
    | "="
    | "|"
    | "+"
    | "-"
    | "*"
    | "/"
    | "or"
    | "and"
    | "<"
    | ">"
    | "<>"
    | ">="
    | "<=";
}

interface Value {
  type: "value";
  value: string;
}

interface Node {
  type: "node";
  parts: (Variable | Value | DOPiXfunction)[]
}

interface DOPiXfunction {
  type: "function";
  name: "pos";
  parameters: [
    {
      name: "partial string";
      partial: Node;
    },
    {
      name: "string";
      string: Node;
    },
    {
      name: "position";
      position: "IN" | "EXT";
    },
  ];
}