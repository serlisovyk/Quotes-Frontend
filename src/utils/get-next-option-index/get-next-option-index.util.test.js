import { describe, expect, test } from 'vitest'
import { NO_ACTIVE_OPTION, OPTION_STEP_DOWN, OPTION_STEP_UP } from '@/constants'
import { getNextOptionIndex } from './get-next-option-index.util.js'

describe('getNextOptionIndex utility function', () => {
  test('moves down to the next option', () => {
    expect(getNextOptionIndex(0, 3, OPTION_STEP_DOWN)).toBe(1)
  })

  test('starts at the first option when none is active and moves down', () => {
    expect(getNextOptionIndex(NO_ACTIVE_OPTION, 3, OPTION_STEP_DOWN)).toBe(0)
  })

  test('wraps from the last option to the first when moving down', () => {
    expect(getNextOptionIndex(2, 3, OPTION_STEP_DOWN)).toBe(0)
  })

  test('moves up to the previous option', () => {
    expect(getNextOptionIndex(2, 3, OPTION_STEP_UP)).toBe(1)
  })

  test('starts at the last option when none is active and moves up', () => {
    expect(getNextOptionIndex(NO_ACTIVE_OPTION, 3, OPTION_STEP_UP)).toBe(2)
  })

  test('wraps from the first option to the last when moving up', () => {
    expect(getNextOptionIndex(0, 3, OPTION_STEP_UP)).toBe(2)
  })

  test('has no active option when there are no options', () => {
    expect(getNextOptionIndex(NO_ACTIVE_OPTION, 0, OPTION_STEP_DOWN)).toBe(
      NO_ACTIVE_OPTION,
    )
    expect(getNextOptionIndex(0, 0, OPTION_STEP_UP)).toBe(NO_ACTIVE_OPTION)
  })
})
