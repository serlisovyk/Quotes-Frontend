import { describe, expect, test } from 'vitest'
import { parseReadOnly } from './parse-read-only.util.js'

describe('parseReadOnly', () => {
  test.each(['true', 'TRUE', 'True', ' true ', '\ttrue\n'])(
    'turns read-only on for %j',
    (value) => {
      expect(parseReadOnly(value)).toBe(true)
    },
  )

  test.each([
    undefined,
    null,
    '',
    ' ',
    'false',
    'FALSE',
    '1',
    'yes',
    'on',
    'truee',
    0,
  ])('leaves read-only off for %j', (value) => {
    expect(parseReadOnly(value)).toBe(false)
  })
})
