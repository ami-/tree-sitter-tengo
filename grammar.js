/**
 * @file Tengo grammar for tree-sitter
 * @author LT
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check
//

const PREC = {
  unary: 6,
  multiplicative: 5,
  additive: 4,
  comparative: 3,
  and: 2,
  or: 1,
};

const multiplicativeOperators = ["*", "/", "%", "<<", ">>", "&", "&^"];
const additiveOperators = ["+", "-", "|", "^"];
const comparativeOperators = ["==", "!=", "<", "<=", ">", ">="];
const assignmentOperators = [
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "&=",
  "|=",
  "&^=",
  "^=",
  "<<=",
  ">>=",
];

module.exports = grammar({
  name: "tengo", // Language name (lowercase)

  // Extra tokens that can appear anywhere (whitespace, comments)
  extras: ($) => [
    /\s/, // Matches whitespace characters
    $.comment, // Reference to a comment rule defined below
  ],

  // Grammar rules start here
  rules: {
    // The top-level rule, usually representing a whole file
    source_file: ($) => repeat($._statement), // Example: a file is zero or more statements

    // Rule for comments (adapt to Tengo's actual comment syntax)
    comment: ($) =>
      token(
        choice(
          seq("//", /.*/), // Single line comment: // followed by anything
          seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"), // Multi-line comment /* ... */ (regex can be tricky)
        ),
      ),

    // Statements
    _statement: ($) =>
      choice(
        $._expression_statement,
        $.variable_declaration,
        $.assignment_statement,
        $.return_statement,
        $.if_statement,
        $.for_statement,
        $.for_in_statement,
        // Add other Tengo statements: import, etc.
      ),

    variable_declaration: ($) =>
      seq(field("name", $.identifier), ":=", field("value", $._expression)),

    assignment_statement: ($) =>
      seq(
        field("left", $._expression),
        field("operator", $.assignment_operator),
        field("right", $._expression),
      ),

    assignment_operator: ($) =>
      choice(
        "=", // Simple assignment
        ...assignmentOperators, // Compound assignments defined at the top
      ),
    return_statement: ($) =>
      prec.right(-1, seq("return", optional($._expression))),

    // If statement with optional initialization, else-if, and else branches
    if_statement: ($) =>
      seq(
        "if",
        field("initialization", optional(seq($._simple_statement, ";"))),
        field("condition", $._expression),
        field("consequence", $.block),
        optional(
          choice(
            seq("else", field("alternative", $.block)),
            seq("else", field("alternative", $.if_statement)),
          ),
        ),
      ),

    // For statement with three forms:
    // 1. for init; condition; post {}
    // 2. for condition {}
    // 3. for {}
    for_statement: ($) =>
      choice(
        // Classic three-part loop: for init; condition; post {}
        seq(
          "for",
          field("initialization", optional($._simple_statement)),
          ";",
          field("condition", optional($._expression)),
          ";",
          field("update", optional($._simple_statement)),
          field("body", $._for_block),
        ),
        // Condition-only loop: for condition {}
        seq(
          "for",
          field("condition", $._expression),
          field("body", $._for_block),
        ),
        // Infinite loop: for {}
        seq("for", field("body", $._for_block)),
      ),

    // Special block rule specifically for for statements to resolve ambiguity
    _for_block: ($) => prec(20, $.block),

    // For-in statement for iterating over iterable values
    // for v in iterable {} or for i, v in iterable {}
    for_in_statement: ($) =>
      seq(
        "for",
        choice(
          // Single variable: for v in iterable {}
          seq(
            field("value", $.identifier),
            "in",
            field("iterable", $._expression),
          ),
          // Two variables: for i, v in iterable {}
          seq(
            field("key", $.identifier),
            ",",
            field("value", $.identifier),
            "in",
            field("iterable", $._expression),
          ),
        ),
        field("body", $.block),
      ),
    // Simple statements that can appear in the initialization part of if/for statements
    _simple_statement: ($) =>
      choice(
        $.variable_declaration,
        $.assignment_statement,
        $._expression_statement,
        $.increment_statement,
        $.decrement_statement,
      ),

    // Increment statement (a++)
    increment_statement: ($) => seq(field("expression", $._expression), "++"),

    // Decrement statement (a--)
    decrement_statement: ($) => seq(field("expression", $._expression), "--"),

    variable_declaration: ($) =>
      seq(field("name", $.identifier), ":=", field("value", $._expression)),

    _expression_statement: ($) => $._expression,

    // Expressions (very basic examples - MUST be expanded significantly for Tengo)
    _expression: ($) =>
      choice(
        $.unary_expression,
        $.identifier,
        $.number_literal,
        $.string_literal,
        $.raw_string_literal,
        $.char_literal, // Character literals (single quotes)
        $.binary_expression, // Define binary operations
        $.ternary_expression, // Ternary conditional expression
        $.array_literal, // Array literals
        $.map_literal, // Map literals
        $.function_literal, // Function literals/values
        $.function_call, // Function calls
        $.selector_expression, // Object property access with dot notation
        $.index_expression, // Array/map index access with square brackets
        $.slice_expression, // Array/string slicing
      ),

    // Ternary conditional expression: condition ? true_expr : false_expr
    ternary_expression: ($) =>
      prec.right(
        0, // Lower precedence than binary expressions
        seq(
          field("condition", $._expression),
          "?",
          field("consequence", $._expression),
          ":",
          field("alternative", $._expression),
        ),
      ),

    unary_expression: ($) =>
      prec(
        PREC.unary,
        seq(
          field("operator", choice("+", "-", "!", "^")),
          field("operand", $._expression),
        ),
      ),

    binary_expression: ($) =>
      choice(
        ...[
          prec.left(
            PREC.multiplicative,
            seq(
              field("left", $._expression),
              field("operator", $.multiplicative_operator),
              field("right", $._expression),
            ),
          ),
          prec.left(
            PREC.additive,
            seq(
              field("left", $._expression),
              field("operator", $.additive_operator),
              field("right", $._expression),
            ),
          ),
          prec.left(
            PREC.comparative,
            seq(
              field("left", $._expression),
              field("operator", $.comparative_operator),
              field("right", $._expression),
            ),
          ),
          prec.left(
            PREC.and,
            seq(
              field("left", $._expression),
              field("operator", $.and_operator),
              field("right", $._expression),
            ),
          ),
          prec.left(
            PREC.or,
            seq(
              field("left", $._expression),
              field("operator", $.or_operator),
              field("right", $._expression),
            ),
          ),
        ],
      ),

    multiplicative_operator: ($) => choice(...multiplicativeOperators),

    additive_operator: ($) => choice(...additiveOperators),

    comparative_operator: ($) => choice(...comparativeOperators),

    and_operator: ($) => "&&",

    or_operator: ($) => "||",

    array_literal: ($) =>
      seq(
        "[",
        optional(
          seq(
            $._expression,
            repeat(seq(",", $._expression)),
            optional(","), // Allow trailing comma
          ),
        ),
        "]",
      ),

    // Map literals
    map_literal: ($) =>
      prec(
        10,
        seq(
          "{",
          optional(
            seq(
              $.map_pair,
              repeat(seq(",", $.map_pair)),
              optional(","), // Allow trailing comma
            ),
          ),
          "}",
        ),
      ),

    map_pair: ($) =>
      seq(field("key", $._expression), ":", field("value", $._expression)),

    // Function literal definition
    function_literal: ($) =>
      seq(
        "func",
        field("parameters", $.parameter_list),
        field("body", $.block),
      ),

    // Parameter list for function definitions
    parameter_list: ($) =>
      seq(
        "(",
        optional(
          seq(
            // Regular parameters first
            repeat(seq($.parameter, ",")),
            choice(
              // Last parameter can be either regular or variadic
              $.parameter,
              $.variadic_parameter,
            ),
            optional(","), // Allow trailing comma
          ),
        ),
        ")",
      ),

    // Regular parameter
    parameter: ($) => $.identifier,

    // Variadic parameter (with ...) - can only be the last parameter
    variadic_parameter: ($) => seq("...", $.identifier),

    // Function call
    function_call: ($) =>
      prec.left(
        8, // Higher precedence than binary expressions
        seq(
          field("function", $._expression),
          field("arguments", $.argument_list),
        ),
      ),

    // Selector expression (accessing object properties with dot notation)
    selector_expression: ($) =>
      prec.left(
        8, // Same precedence as function calls
        seq(
          field("object", $._expression),
          ".",
          field("property", $.identifier),
        ),
      ),

    // Index expression (accessing array/map elements with square brackets)
    index_expression: ($) =>
      prec.left(
        8, // Same precedence as function calls
        seq(
          field("object", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    // Slice expression (array/string slicing with colon notation)
    slice_expression: ($) =>
      prec.left(
        8, // Same precedence as other access operators
        seq(
          field("object", $._expression),
          "[",
          optional(field("start", $._expression)),
          ":",
          optional(field("end", $._expression)),
          "]",
        ),
      ),

    // Argument list for function calls
    argument_list: ($) =>
      seq(
        "(",
        optional(
          seq(
            $.argument,
            repeat(seq(",", $.argument)),
            optional(","), // Allow trailing comma
          ),
        ),
        ")",
      ),

    // Individual argument, can be regular or spread
    argument: ($) => choice($._expression, $.spread_argument),

    // Spread argument for function calls
    spread_argument: ($) => seq($._expression, "..."),

    // Code block with statements
    block: ($) => seq("{", repeat($._statement), "}"),

    // Lexical Tokens (terminals)
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number_literal: ($) => /\d+(\.\d+)?/, // Basic integer/float
    string_literal: ($) =>
      choice(
        // Double-quoted string with escape sequences
        seq(
          '"',
          repeat(
            choice(
              $._escape_sequence,
              token.immediate(/[^"\\]+/), // Any character except " or \
            ),
          ),
          '"',
        ),
      ),

    // Raw string literal (backticks) - no escape processing
    raw_string_literal: ($) => token(/`[^`]*`/),

    char_literal: ($) =>
      seq(
        "'",
        choice(
          $._escape_sequence,
          token.immediate(/[^'\\]/), // Single character except ' or \
        ),
        "'",
      ),

    _escape_sequence: ($) =>
      token(
        choice(
          // Standard escapes
          /\\[nrtbfv\\'"a]/,
          // Hex escapes
          /\\x[0-9a-fA-F]{2}/,
          // Unicode escapes
          /\\u[0-9a-fA-F]{4}/,
          // Extended unicode escapes
          /\\U[0-9a-fA-F]{8}/,
          // Octal escapes
          /\\[0-7]{1,3}/,
        ),
      ),
  },

  // Optional: Define conflicts and precedence for ambiguities
  // conflicts: $ => [
  //   [$.rule1, $.rule2],
  // ],
  // precedence: $ => [
  //    // Operator precedence rules
  // ],
});
