import { beforeEach, vi } from 'vitest'

const createLightQueryList = () => ({
  matches: false,
  addEventListener: () => {},
  removeEventListener: () => {},
})

beforeEach(() => vi.stubGlobal('matchMedia', createLightQueryList))
