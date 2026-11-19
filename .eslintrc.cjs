/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "i18next"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }
    ],
    "i18next/no-literal-string": [
      "error",
      {
        mode: "jsx-only",
        "jsx-attributes": {
          include: [
            "title",
            "aria-label",
            "ariaLabel",
            "placeholder",
            "alt",
            "label",
            "description"
          ]
        },
        words: {
          exclude: [
            "^[0-9%+.×xX/*\\-:\\s]+$",
            "Browse Assist",
            "PiP",
            "HEX",
            "RGB",
            "HSL",
            "Ctrl \\+ Z",
            "about:addons",
            "Shift",
            "Alt",
            "Ctrl",
            "Flow",
            "Free",
            "X",
            "<video>",
            "v\\d+",
            "^v$",
            "^•$",
            "^·$",
            "^±$",
            "^s$",
            "^\\(N/A\\)$"
          ]
        },
        callees: {
          exclude: ["t", "translateFor", "includes", "renderDirectionNode"]
        }
      }
    ]
  },
  overrides: [
    {
      files: ["**/__tests__/**", "src/locales/**"],
      rules: {
        "i18next/no-literal-string": "off"
      }
    }
  ],
  ignorePatterns: [
    "build/",
    "dist/",
    ".plasmo/",
    "node_modules/",
    "*.mjs"
  ]
};
