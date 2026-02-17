import path from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      ...compat.extends('plugin:jsx-a11y/recommended'),
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'arrow-parens': 1,
      'arrow-spacing': 1,
      'block-spacing': 1,
      'comma-dangle': [
            1,
            {
                'arrays': 'always-multiline',
                'objects': 'always-multiline'
            }
        ],
        'comma-spacing': [
            1,
            {
                'before': false,
                'after': true
            }
        ],
        'default-case': 1,
        'eol-last': 1,
        'indent': [
            1,
            4,
            {
                'SwitchCase': 1
            }
        ],
        'jsx-quotes': [
            1,
            'prefer-double'
        ],
        'linebreak-style': [
            0
        ],
        'object-curly-spacing': [
            1,
            'always'
        ],
        'semi': 1,
        'no-trailing-spaces': [
            1
        ],
        'no-unused-vars': 0,
        'react/jsx-curly-spacing': [
            1,
            {
                'when': 'always',
                'children': true,
                'allowMultiline': true,
                'spacing': {
                    'objectLiterals': 'always'
                }
            }
        ],
        'react/destructuring-assignment': [
            2,
            'always'
        ],
        'react/jsx-indent': [
            1,
            4,
            {
                'checkAttributes': true,
                'indentLogicalExpressions': true
            }
        ],
        'react/jsx-indent-props': [
            1,
            4
        ],
        'react/jsx-tag-spacing': [
            1,
            {
                'beforeSelfClosing': 'always'
            }
        ],
        'react/jsx-wrap-multilines': [
            1,
            {
                'declaration': 'parens-new-line',
                'assignment': 'parens-new-line',
                'return': 'parens-new-line'
            }
        ],
        'jsx-a11y/no-onchange': [
            0
        ],
        'jsx-a11y/no-autofocus': [
            0
        ],
        'import/no-named-as-default-member': [
            0
        ],
        'react/prop-types': [
            0
        ]
    },
  },
])
