import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    parser: "@typescript-eslint/parser",
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])

// {
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "ecmaVersion": 2020,
//     "sourceType": "module",
//     "ecmaFeatures": {
//       "jsx": true
//     },
//     "tsconfigRootDir": "./",
//     "project": "./tsconfig.json"
//   },
//   "extends": [
//     "eslint:recommended",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react/recommended",
//     "plugin:react-hooks/recommended"
//   ],
//   "settings": {
//     "react": {
//       "version": "detect"
//     }
//   }
// }
