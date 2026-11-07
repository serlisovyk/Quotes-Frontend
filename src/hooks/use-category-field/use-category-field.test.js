import { describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCategorySuggestions } from '@/hooks/use-category-suggestions'
import { NO_ACTIVE_OPTION } from '@/constants'
import { useCategoryField } from './use-category-field.js'

vi.mock('@/hooks/use-category-suggestions', () => ({
  useCategorySuggestions: vi.fn(),
}))

const createKeyEvent = (key) => ({ key, preventDefault: vi.fn() })

const renderField = ({ value = 'lea', isMultiple = false, suggestions } = {}) => {
  const onChange = vi.fn()

  useCategorySuggestions.mockImplementation((query) =>
    query ? (suggestions ?? ['leadership', 'learning', 'leap']) : [],
  )

  const view = renderHook((props) => useCategoryField(props), {
    initialProps: { id: 'category', value, isMultiple, onChange },
  })

  return { ...view, onChange }
}

const open = (result) =>
  act(() => result.current.handleChange({ target: { value: 'lea' } }))

const press = (result, key) => {
  const event = createKeyEvent(key)

  act(() => result.current.handleKeyDown(event))

  return event
}

describe('useCategoryField', () => {
  test('asks for suggestions of the category token only', () => {
    renderField({ value: 'life, cou', isMultiple: true })

    expect(useCategorySuggestions).toHaveBeenCalledWith('cou')
  })

  test('asks for suggestions of the whole value for a single category', () => {
    renderField({ value: 'lea', isMultiple: false })

    expect(useCategorySuggestions).toHaveBeenCalledWith('lea')
  })

  test('describes every suggestion as an option with its own id', () => {
    const { result } = renderField()

    expect(result.current.listboxId).toBe('category-suggestions')
    expect(result.current.options).toEqual([
      { name: 'leadership', id: 'category-suggestions-leadership' },
      { name: 'learning', id: 'category-suggestions-learning' },
      { name: 'leap', id: 'category-suggestions-leap' },
    ])
  })

  test('starts collapsed with no active option', () => {
    const { result } = renderField()

    expect(result.current.isExpanded).toBe(false)
    expect(result.current.activeIndex).toBe(NO_ACTIVE_OPTION)
    expect(result.current.activeOptionId).toBeUndefined()
  })

  test('typing reports the change and expands the list', () => {
    const { result, onChange } = renderField()
    const event = { target: { value: 'lea' } }

    act(() => result.current.handleChange(event))

    expect(onChange).toHaveBeenCalledWith(event)
    expect(result.current.isExpanded).toBe(true)
  })

  test('stays collapsed while there are no suggestions', () => {
    const { result } = renderField({ suggestions: [] })

    open(result)

    expect(result.current.isExpanded).toBe(false)
  })

  test('ArrowDown moves to the next option and wraps around', () => {
    const { result } = renderField()
    open(result)

    const event = press(result, 'ArrowDown')

    expect(event.preventDefault).toHaveBeenCalled()
    expect(result.current.activeIndex).toBe(0)
    expect(result.current.activeOptionId).toBe('category-suggestions-leadership')

    press(result, 'ArrowDown')
    press(result, 'ArrowDown')
    press(result, 'ArrowDown')

    expect(result.current.activeIndex).toBe(0)
  })

  test('ArrowUp starts at the last option and moves up', () => {
    const { result } = renderField()
    open(result)

    press(result, 'ArrowUp')
    expect(result.current.activeIndex).toBe(2)

    press(result, 'ArrowUp')
    expect(result.current.activeIndex).toBe(1)
  })

  test('ArrowDown expands a collapsed list that has suggestions', () => {
    const { result } = renderField()

    const event = press(result, 'ArrowDown')

    expect(event.preventDefault).toHaveBeenCalled()
    expect(result.current.isExpanded).toBe(true)
    expect(result.current.activeIndex).toBe(NO_ACTIVE_OPTION)
  })

  test('arrow keys do nothing without suggestions', () => {
    const { result } = renderField({ suggestions: [] })

    const event = press(result, 'ArrowDown')

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(result.current.isExpanded).toBe(false)
  })

  test('Enter on the active option picks it, closes the list and does not submit', () => {
    const { result, onChange } = renderField()
    open(result)
    press(result, 'ArrowDown')
    press(result, 'ArrowDown')
    onChange.mockClear()

    const event = press(result, 'Enter')

    expect(event.preventDefault).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith({ target: { value: 'learning' } })
    expect(result.current.isExpanded).toBe(false)
    expect(result.current.activeIndex).toBe(NO_ACTIVE_OPTION)
  })

  test('Enter replaces only the last token of a list', () => {
    const { result, onChange } = renderField({
      value: 'life, lea',
      isMultiple: true,
    })
    open(result)
    press(result, 'ArrowDown')
    onChange.mockClear()

    press(result, 'Enter')

    expect(onChange).toHaveBeenCalledWith({
      target: { value: 'life, leadership' },
    })
  })

  test('Enter without an active option leaves the form to submit', () => {
    const { result, onChange } = renderField()
    open(result)
    onChange.mockClear()

    const event = press(result, 'Enter')

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  test('Escape closes an expanded list', () => {
    const { result } = renderField()
    open(result)

    const event = press(result, 'Escape')

    expect(event.preventDefault).toHaveBeenCalled()
    expect(result.current.isExpanded).toBe(false)
  })

  test('Escape does nothing when the list is closed', () => {
    const { result } = renderField()

    const event = press(result, 'Escape')

    expect(event.preventDefault).not.toHaveBeenCalled()
  })

  test('other keys are left alone', () => {
    const { result } = renderField()
    open(result)

    const event = press(result, 'a')

    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(result.current.isExpanded).toBe(true)
  })

  test('leaving the field closes the list', () => {
    const { result } = renderField()
    open(result)

    act(() => result.current.handleBlur())

    expect(result.current.isExpanded).toBe(false)
  })

  test('picking an option with the mouse replaces the token and closes the list', () => {
    const { result, onChange } = renderField()
    open(result)
    onChange.mockClear()

    act(() => result.current.selectOption('learning'))

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'learning' } })
    expect(result.current.isExpanded).toBe(false)
  })

  test('typing again clears the active option', () => {
    const { result } = renderField()
    open(result)
    press(result, 'ArrowDown')

    open(result)

    expect(result.current.activeIndex).toBe(NO_ACTIVE_OPTION)
  })

  test('has no active option id when the active index is beyond the shorter list', () => {
    const { result, rerender, onChange } = renderField()
    open(result)
    press(result, 'ArrowUp')

    useCategorySuggestions.mockImplementation(() => ['leadership'])
    rerender({ id: 'category', value: 'lead', isMultiple: false, onChange })

    expect(result.current.activeOptionId).toBeUndefined()
  })
})
