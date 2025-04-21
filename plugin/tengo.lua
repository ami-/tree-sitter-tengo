--[[ if vim.g.ts_tengo_skip_queries then
	return
end

local root = require("ts_tengo").plugin_dir
vim.treesitter.language.add("tengo", {
	path = root .. "/parser/tengo.so",
})

for _, file in ipairs(vim.fn.glob(root .. "/queries/tengo/*", false, true)) do
	vim.treesitter.query.set("tengo", vim.fn.fnamemodify(file, ":t:r"), table.concat(vim.fn.readfile(file), "\n"))
end
]]

if vim.g.ts_tengo_skip_queries then
	return
end

-- Assuming your plugin structure is:
-- tree-sitter-tengo/
-- ├── plugin/
-- │   └── tengo.lua
-- ├── tengo.so
-- └── queries/
--     └── tengo/
--         ├── highlights.scm
--         └── locals.scm
--         └── tags.scm

-- We can determine the plugin root directly within this file
local root = vim.fn.expand("<sfile>:p:h:h")

--print(root)

-- Register the language with nvim-treesitter
vim.treesitter.language.register("tengo", {
	filetypes = { "tengo" }, -- Associate the language with the 'tengo' filetype
	parser_path = root .. "/tengo.so",
})

local query_dir = root .. "/queries/tengo/"

for _, file in ipairs(vim.fn.glob(query_dir .. "*.scm", false, true)) do
	local query_name = vim.fn.fnamemodify(file, ":t:r")
	local query_content = table.concat(vim.fn.readfile(file), "\n")
	local ok, err = pcall(vim.treesitter.query.set, "tengo", query_name, query_content)
	if not ok then
		vim.notify(
			"Error loading tengo query " .. query_name .. ": " .. err,
			vim.log.levels.ERROR,
			{ title = "nvim-treesitter-tengo" }
		)
	end
end
-- Optional: Print a message to confirm query loading (for debugging)
--vim.notify("Loaded tengo queries from: " .. query_dir, vim.log.levels.INFO, { title = "nvim-treesitter-tengo" })
