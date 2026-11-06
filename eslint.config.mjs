import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import checkFile from 'eslint-plugin-check-file'
import prettier from 'eslint-config-prettier'

const SOURCES = ['src/**/*.{js,jsx}']

const SERVICES_FOLDER = 'src/services/**'

const TRANSITIONAL_SERVICES_FOLDER = 'app/_services/**'

const ROUTE_FILES = [
  'src/app/**/{page,layout,not-found,error,loading}.jsx',
  'src/app/{robots,sitemap}.js',
]

const KEBAB_WORD = '+([a-z0-9])*(-+([a-z0-9]))'

const FOLDER_NAME_PATTERN = `{${KEBAB_WORD},\\(${KEBAB_WORD}\\),\\[${KEBAB_WORD}\\]}`

const FETCH_OWNERS = ['window', 'globalThis', 'self', 'global']

const FETCH_MESSAGE = 'The global fetch is only called in src/services.'
const API_URL_MESSAGE = 'API_URL is only read in src/services.'
const DEFAULT_EXPORT_MESSAGE =
  'Use a named export; only the route files keep the default export Next.js requires (ai/rules/style.md).'
const PARENT_IMPORT_MESSAGE =
  'Use the `@/` alias instead of a relative `../` import (ai/rules/style.md).'
const OWN_BARREL_MESSAGE =
  "A module never imports through its folder's own barrel; import the sibling file directly (ai/rules/style.md)."

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

const restrictedDefaultExportSyntax = {
  selector: 'ExportDefaultDeclaration',
  message: DEFAULT_EXPORT_MESSAGE,
}

const createRestrictedImports = (ownBarrelAlias) => {
  const ownBarrelPaths = ['.', './', './index', './index.js', ownBarrelAlias]
    .filter(Boolean)
    .map((name) => ({ name, message: OWN_BARREL_MESSAGE }))

  return [
    'error',
    {
      paths: ownBarrelPaths,
      patterns: [{ group: ['../*', '../**'], message: PARENT_IMPORT_MESSAGE }],
    },
  ]
}

export default defineConfig([
  globalIgnores(['.next', '.claude', 'coverage']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [nextVitals],
  },
  {
    files: ['**/*.{js,jsx,mjs}'],
    ignores: [SERVICES_FOLDER, TRANSITIONAL_SERVICES_FOLDER],
    rules: {
      'no-restricted-globals': ['error', { name: 'fetch', message: FETCH_MESSAGE }],
      'no-restricted-properties': ['error', ...restrictedFetchProperties],
      'no-restricted-syntax': ['error', ...restrictedApiUrlSyntax],
    },
  },
  {
    files: SOURCES,
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{js,jsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        { 'src/**': FOLDER_NAME_PATTERN },
      ],
      'no-restricted-imports': createRestrictedImports(),
    },
  },
  {
    files: ['src/constants/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': createRestrictedImports('@/constants'),
    },
  },
  {
    files: ['src/config/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': createRestrictedImports('@/config'),
    },
  },
  {
    files: SOURCES,
    ignores: [SERVICES_FOLDER, ...ROUTE_FILES],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...restrictedApiUrlSyntax,
        restrictedDefaultExportSyntax,
      ],
    },
  },
  {
    files: ['src/services/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': ['error', restrictedDefaultExportSyntax],
    },
  },
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    rules: {
      'react/display-name': 'off',
    },
  },
  {
    files: [
      'src/components/quote-form/quote-form.jsx',
      'src/components/search-form/search-form.jsx',
    ],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  prettier,
])
