import { escapeRegExp } from '@utils/escapeRegExp'

describe('escapeRegExp utility function', () => {
  test.each(['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'])(
    'should escape the special character %s',
    (character) => {
      expect(escapeRegExp(character)).toBe(`\\${character}`)
    },
  )

  test('should leave a plain string unchanged', () => {
    expect(escapeRegExp('life is good 42')).toBe('life is good 42')
  })

  test('should return an empty string for an empty string', () => {
    expect(escapeRegExp('')).toBe('')
  })

  test('should produce a pattern that matches the input literally', () => {
    const input = 'c++ (a|b) [x] 1.5*2'
    const pattern = new RegExp(`^${escapeRegExp(input)}$`)

    expect(pattern.test(input)).toBe(true)
    expect(pattern.test('c+ (a|b) [x] 1.5*2')).toBe(false)
  })
})
