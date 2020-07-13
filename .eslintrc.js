/**
 * https://eslint.org/docs/user-guide/configuring
 */
module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "standard"
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018
    },
    plugins: [
        "sort-imports-es6-autofix",
        "@typescript-eslint"
    ],
    rules: {
        "@typescript-eslint/interface-name-prefix": ["warn", { prefixWithI: "always" }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
        "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
        "space-before-function-paren": "off",
        indent: ["warn", 4, { SwitchCase: 1 }],
        quotes: ["warn", "double", { avoidEscape: true }],
        semi: ["error", "always"]
    }
};
