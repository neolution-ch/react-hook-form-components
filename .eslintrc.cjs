module.exports = {
  settings: {
    react: {
      version: "18",
    },
  },
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["dist", "cypress"],
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    // Doesn't work with some imports from reactstrap
    "import/no-unresolved": "off",

    // Enforce double quotes
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    // Prefer string interpolation
    "prefer-template": "error",
    "max-lines": [
      "error",
      {
        max: 200,
      },
    ],
    complexity: [
      "error",
      {
        max: 15,
      },
    ],
    "prefer-destructuring": "error",
    "no-empty-function": "error",
    "arrow-body-style": ["error", "as-needed"],
  },
};
