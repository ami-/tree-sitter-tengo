-- Register the Tengo parser with nvim-treesitter so that
-- `:TSInstall tengo` works without any manual user config.
local ok, parsers = pcall(require, 'nvim-treesitter.parsers')
if ok then
  -- nvim-treesitter >= 0.9 (new API): parsers is a plain table.
  -- nvim-treesitter <  0.9 (old API): parsers.get_parser_configs() returns it.
  local parser_config = type(parsers.get_parser_configs) == 'function'
    and parsers.get_parser_configs()
    or parsers
  parser_config.tengo = {
    install_info = {
      url = 'https://github.com/ami-/tree-sitter-tengo',
      files = { 'src/parser.c' },
      branch = 'master',
      generate_requires_npm = false,
      requires_generate_from_grammar = false,
    },
    filetype = 'tengo',
  }
end
