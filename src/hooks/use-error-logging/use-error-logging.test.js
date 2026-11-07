import { beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useErrorLogging } from './use-error-logging.js'

describe('Use Error Logging', () => {
  let consoleErrorSpy

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('writes the error to the console', () => {
    const error = new Error('Network down')

    renderHook(() => useErrorLogging(error))

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith(error)
  })

  test('writes the digest next to the error when there is one', () => {
    const error = Object.assign(new Error('Render failed'), { digest: 'abc123' })

    renderHook(() => useErrorLogging(error))

    expect(consoleErrorSpy).toHaveBeenCalledWith(error, { digest: 'abc123' })
  })

  test('writes the same error once across re-renders', () => {
    const error = new Error('Network down')
    const { rerender } = renderHook(() => useErrorLogging(error))

    rerender()
    rerender()

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  })

  test('writes a new error when the error changes', () => {
    const firstError = new Error('First')
    const secondError = new Error('Second')
    const { rerender } = renderHook(({ error }) => useErrorLogging(error), {
      initialProps: { error: firstError },
    })

    rerender({ error: secondError })

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
    expect(consoleErrorSpy).toHaveBeenLastCalledWith(secondError)
  })
})
