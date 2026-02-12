const functions = [
  {
    name: "date",
    fields: [
      {
        name: "date",
        values: [
          "variable",
          "string",
          "expression"
        ],
        default: "variable"
      }
    ]
  },
  {
    name: "substr",
    fields: [
      {
        name: "string",
        values: [
          "variable",
          "string",
          "expression"
        ],
        default: "variable"
      },
      {
        name: "start",
        values: [
          "number"
        ],
        default: "number"
      },
      {
        name: "stop",
        values: [
          "number"
        ],
        default: "number"
      },
    ]
  },
]