module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: [
            "./tsconfig.json",
            "./test/tsconfig.json",
        ],
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    rules: {
        // updated to address conflicts with code base / typescript such as interface redeclare, etc.

        // reason: @typescript-eslint/indent says to disable indent so it works correctly
        "indent": "off",
        // reason: blocks all use of any on anything exposed by the library
        "@typescript-eslint/explicit-module-boundary-types": "off",
        // reason: blocks our use of interfaces defined from concrete types
        "@typescript-eslint/no-empty-interface": "off",

        // migrated by tool from tslint.json
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "explicit",
                overrides: {
                    accessors: "explicit",
                    constructors: "no-public",
                    methods: "explicit",
                    properties: "explicit",
                    parameterProperties: "explicit"
                  }
            }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": ["error", { "default": ["field", "constructor", "signature", "method"] }],
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/quotes": [
            "error",
            "double",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/type-annotation-spacing": "error",
        "brace-style": [
            "error",
            "1tbs"
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "curly": "error",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": "off",
        "id-match": "off",
        "max-len": [
            "error",
            {
                "code": 180
            }
        ],
        "no-bitwise": "error",
        "no-caller": "error",
        "no-console": [
            "error",
            {
                "allow": [
                    "log",
                    "warn",
                    "dir",
                    "timeLog",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-debugger": "off",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-multiple-empty-lines": "off",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-trailing-spaces": "error",
        "no-underscore-dangle": "off",
        "no-unused-labels": "error",
        "no-var": "error",
        "prefer-const": "error",
        "radix": "error",
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
    },
};
