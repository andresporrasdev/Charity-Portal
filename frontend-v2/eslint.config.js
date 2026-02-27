import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Downgrade to warn: the async data-fetch-then-setState pattern is valid
      // and very common; the rule fires on any function call inside useEffect
      // that internally calls setState, which is overly broad.
      'react-hooks/set-state-in-effect': 'warn',
      // Context files necessarily export both components and non-component values
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
