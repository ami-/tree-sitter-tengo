/**
 * @file Tengo grammar for tree-sitter
 * @author LT
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tengo",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
