; Increase indentation inside blocks
(block) @indent

; Increase indentation after the condition in if statements
(if_statement
  condition: _
  consequence: (block) @indent)

; Increase indentation after the condition in for statements
(for_statement
  condition: _
  body: (block) @indent)

; Increase indentation after the iterable in for-in statements
(for_in_statement
  iterable: _
  body: (block) @indent)

