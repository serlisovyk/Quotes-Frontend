import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['.next', '.claude', 'coverage']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [nextVitals],
  },
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    files: ['app/_components/QuoteForm.jsx', 'app/_components/SearchForm.jsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  prettier,
])
