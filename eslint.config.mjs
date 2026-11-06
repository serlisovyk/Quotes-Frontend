import { globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextVitals,
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  globalIgnores(['.next/**', '.claude/**', 'node_modules/**', 'coverage/**']),
]

export default eslintConfig
