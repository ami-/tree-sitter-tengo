# tree-sitter-tengo

Is an experiment in [tree-sitter](https://tree-sitter.github.io/tree-sitter/index.html), building a grammar for [tengo](https://github.com/d5/tengo) language.

It is based on [v2.17.0 of tengo](https://github.com/d5/tengo/tree/v2.17.0).

### status
Work in progress.

## Neovim

Requires [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter).

### lazy.nvim

```lua
{
  'ami-/tree-sitter-tengo',
  lazy = false,
}
```

Then run `:TSInstall tengo` to download and compile the parser.

The plugin self-registers the parser, filetype detection, and queries — no additional configuration needed.

