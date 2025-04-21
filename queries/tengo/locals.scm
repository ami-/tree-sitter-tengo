; locals.scm for Tengo

; Highlights of variable declarations
(variable_declaration
  (identifier) @variable.definition)

; Highlights of function definitions
(function_literal
  (parameter_list
    (parameter) @parameter.definition
    (variadic_parameter
      (identifier) @parameter.definition)))

(function_call
  function: (identifier) @function.call)

(function_call
  function: (selector_expression property: (identifier)  @function.call))

; Highlights of parameters in function calls
(argument_list
  (argument
    (identifier) @variable))

; Highlights of identifiers (variables, function names)
(identifier) @variable

; Highlights of keywords
(if) @keyword
(else) @keyword
(func) @keyword
(for) @keyword
(in) @keyword
(return) @keyword
(export) @keyword
(import) @keyword


; Highlights of operators
(assignment_operator) @operator
(multiplicative_operator) @operator
(additive_operator) @operator
(comparative_operator) @operator
(and_operator) @operator
(or_operator) @operator

; Highlights of literals
(number_literal) @number
(string_literal) @string
(raw_string_literal) @string
(char_literal) @string

(true) @boolean
(false) @boolean

; Highlights of comments
(comment) @comment
