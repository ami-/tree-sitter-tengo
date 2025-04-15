import XCTest
import SwiftTreeSitter
import TreeSitterTengo

final class TreeSitterTengoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tengo())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Tengo grammar")
    }
}
