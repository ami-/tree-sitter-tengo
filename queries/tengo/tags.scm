; Function declarations
(function_literal 
  parameters: (parameter_list
    (parameter (identifier) @name))
  body: (block)) @definition.function

; Variable declarations
(variable_declaration
  name: (identifier) @name) @definition.variable

; Parameters
(parameter
  (identifier) @name) @definition.parameter

(variadic_parameter
  (identifier) @name) @definition.parameter

; References
(identifier) @reference

; Import statements
(import_expression
  (string_literal) @name) @definition.import

; Export statement
(export_statement) @definition.export

; Function calls
(function_call
  function: (identifier) @name) @reference.call

; Selector expressions
(selector_expression
  property: (identifier) @name) @reference.property

; Map pair keys
(map_pair
  key: (identifier) @name) @definition.field
