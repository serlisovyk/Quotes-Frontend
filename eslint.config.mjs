import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier'

const SERVICES_FOLDER = 'app/_services/**'

const FETCH_OWNERS = ['window', 'globalThis', 'self', 'global']

const FETCH_MESSAGE = 'The global fetch is only called in app/_services.'
const API_URL_MESSAGE = 'API_URL is only read in app/_services.'

const restrictedFetchProperties = FETCH_OWNERS.map((object) => ({
  object,
  property: 'fetch',
  message: FETCH_MESSAGE,
}))

const restrictedApiUrlSyntax = [
  {
    selector:
      "MemberExpression[object.object.name='process'][object.property.name='env']:matches([property.name='API_URL'], [property.value='API_URL'])",
    message: API_URL_MESSAGE,
  },
  {
    selector:
      "VariableDeclarator[init.object.name='process'][init.property.name='env'] > ObjectPattern > Property[key.name='API_URL']",
    message: API_URL_MESSAGE,
  },
]

export default defineConfig([
  globalIgnores(['.next', '.claude', 'coverage']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [nextVitals],
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: [SERVICES_FOLDER],
    rules: {
      'no-restricted-globals': ['error', { name: 'fetch', message: FETCH_MESSAGE }],
      'no-restricted-properties': ['error', ...restrictedFetchProperties],
      'no-restricted-syntax': ['error', ...restrictedApiUrlSyntax],
    },
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
