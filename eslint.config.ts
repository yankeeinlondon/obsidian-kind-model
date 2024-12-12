import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  unocss: false,
  formatters: true,
  stylistic: {
    quotes: "double",
    semi: true,
    overrides: {
      "style/indent-binary-ops": ["warn", 2],
      "array-callback-return": ["warn"],
      "valid-typeof": ["warn"],
      "no-console": ["off"],
      "no-new": ["off"],
      "no-alert": ["off"],
      "no-tabs": ["warn"],
      "style/no-tabs": ["off"],
    },
  },
  regexp: {
    overrides: {
      "regexp/no-super-linear-backtracking": ["warn"],
    },
  },
  javascript: {
    overrides: {
      "no-irregular-whitespace": ["warn"],
    },
  },
  typescript: {
    overrides: {
      "ts/explicit-function-return-type": ["off"],
      "ts/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "ts/no-use-before-define": ["warn"],
    },
  },
});
