import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import react from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["resources/js/**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    // rules: {
    //   // Custom rules
    //   "react/jsx-uses-react": "error",
    //   "react/jsx-uses-vars": "error",
    //   "react/prop-types": "off", // Disable prop-types validation
    // },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    // Explicitly override prop-types after applying recommended configs
    rules: {
      "react/prop-types": "off",
    },
  },
];