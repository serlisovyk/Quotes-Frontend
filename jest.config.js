import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  verbose: true,

  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/app/_components/$1',
    '^@utils/(.*)$': '<rootDir>/app/_utils/$1',
  },
}

export default createJestConfig(config)
