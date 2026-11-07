import { describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { createInitialQuoteFormState } from '@/utils/quote-form'
import { useQuoteForm } from './use-quote-form.js'

const initialState = createInitialQuoteFormState({
  text: 'A quote that is long enough',
  author: 'Original',
  categories: 'life',
})

const failedState = {
  values: { text: 'short', author: 'Someone', categories: 'life' },
  errors: { text: 'Text is too short' },
  formError: 'Could not save the quote',
}

const renderQuoteForm = (action = vi.fn(async () => failedState)) =>
  renderHook(() => useQuoteForm(action, initialState))

const submit = (result) =>
  act(async () => {
    result.current.formAction(new FormData())
  })

describe('useQuoteForm', () => {
  test('starts with the initial state and no pending submit', () => {
    const { result } = renderQuoteForm()

    expect(result.current.formState).toEqual(initialState)
    expect(result.current.isPending).toBe(false)
  })

  test('setValues shows the typed values and no errors', () => {
    const { result } = renderQuoteForm()

    act(() => {
      result.current.setValues({ ...initialState.values, author: 'Seneca' })
    })

    expect(result.current.formState).toEqual({
      values: { ...initialState.values, author: 'Seneca' },
      errors: {},
      formError: '',
    })
  })

  test('shows the state the action returns', async () => {
    const action = vi.fn(async () => failedState)
    const { result } = renderQuoteForm(action)

    await submit(result)

    expect(action).toHaveBeenCalledTimes(1)
    expect(result.current.formState).toEqual(failedState)
    expect(result.current.isPending).toBe(false)
  })

  test('clears the errors and keeps the typed values after a failed submit', async () => {
    const { result } = renderQuoteForm()
    await submit(result)

    act(() => {
      result.current.setValues({
        ...failedState.values,
        text: 'A longer quote text',
      })
    })

    expect(result.current.formState.errors).toEqual({})
    expect(result.current.formState.formError).toBe('')
    expect(result.current.formState.values.text).toBe('A longer quote text')
  })

  test('shows the next action result over what was typed before it', async () => {
    const { result } = renderQuoteForm()

    act(() => {
      result.current.setValues({ ...initialState.values, author: 'Typed' })
    })
    await submit(result)

    expect(result.current.formState).toEqual(failedState)
  })

  test('handleReset puts the initial state back', async () => {
    const { result } = renderQuoteForm()
    await submit(result)

    act(() => result.current.handleReset())

    expect(result.current.formState).toEqual(initialState)
  })
})
