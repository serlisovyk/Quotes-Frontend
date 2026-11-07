import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingStatus } from './loading-status.jsx'

describe('LoadingStatus Component', () => {
  test('announces the loading state', () => {
    render(<LoadingStatus />)

    expect(screen.getByRole('status').textContent).toContain('Loading')
  })
})
