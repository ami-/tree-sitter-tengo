vim.api.nvim_create_autocmd({ "BufNewFile", "BufRead" }, { pattern = "*.tengo", command = "set filetype=tengo" })
