import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.claude/'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.claude/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^server-only$': '<rootDir>/src/tests/mocks/server-only',
  },
}

export default createJestConfig(config)
