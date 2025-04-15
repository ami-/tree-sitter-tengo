package tree_sitter_tengo_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tengo "github.com/tree-sitter/tree-sitter-tengo/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tengo.Language())
	if language == nil {
		t.Errorf("Error loading Tengo grammar")
	}
}
