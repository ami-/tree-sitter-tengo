// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterTengo",
    products: [
        .library(name: "TreeSitterTengo", targets: ["TreeSitterTengo"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterTengo",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterTengoTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterTengo",
            ],
            path: "bindings/swift/TreeSitterTengoTests"
        )
    ],
    cLanguageStandard: .c11
)
