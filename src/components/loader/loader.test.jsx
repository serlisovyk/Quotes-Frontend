import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { Loader } from './loader.jsx'

describe('Loader', () => {
  test('draws a spinner that assistive technology skips', () => {
    const { container } = render(<Loader />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
    expect(container.textContent).toBe('')
  })

  test('draws the spinner at full height when asked', () => {
    const { container } = render(<Loader isFullHeight />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })
})
