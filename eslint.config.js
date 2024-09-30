import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {languageOptions: { 
    globals: globals.browser,
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      "ecmaFeatures": {
        "jsx": true
      }
    }
  }},
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  { 
    plugins: {
      "simple-import-sort": simpleImportSort,
      "react": pluginReact
    },
    rules: {
      'no-console': 'warn',  // Warn on console logs
      'semi': ['error', 'always'],  // Enforce semicolons
      "sort-imports": ["error", {
        "ignoreCase": false,
        "ignoreDeclarationSort": true,
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": true
      }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off',  // Not needed with React 17+
      'react/prop-types': 'error',
      'react/jsx-filename-extension': [1, { 'extensions': ['.jsx', '.tsx'] }],  // Allow JSX in .jsx and .tsx files
      'react/jsx-props-no-spreading': 'off',  // Allow prop spreading
      'react/jsx-key': 'error',  // Ensure key prop is present in list items
      'react/jsx-no-target-blank': 'error',  // Prevent security risk with target="_blank"
      'react/jsx-no-duplicate-props': 'error',  // Prevent duplicate props in JSX
      'react/jsx-no-undef': 'error',  // Disallow undeclared variables in JSX
      'react/jsx-pascal-case': 'error',  // Enforce PascalCase for user-defined JSX components
      'react/jsx-indent': ['warn', 2],
      'react/jsx-indent-props': ['error', 2]
    },
  },
];