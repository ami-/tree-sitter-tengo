(number_literal) @number
(string_literal) @string
(raw_string_literal) @string
(char_literal) @string
(boolean_literal) @boolean 

(multiplicative_operator)@operator
(additive_operator) @operator
(comparative_operator) @operator
(and_operator) @operator
(or_operator) @operator

[
  "+"
  "-"
  "*"
  "/"
] @operator

; Variables
(variable_declaration (identifier) @variable)

; keywords
(if) @keyword.conditional
(else) @keyword.conditional
(for) @keyword
(in) @keyword
(return) @keyword.return
(export) @keyword
(import) @keyword.import

(func) @function
(function_call
  function: (identifier) @function.call)

(function_call
  function: (selector_expression property: (identifier)  @function.call))
; Others
(comment) @comment @spell

