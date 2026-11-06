import { render, screen } from '@testing-library/react'
import { LoadingStatus } from './loading-status.jsx'

describe('LoadingStatus Component', () => {
  it('announces the loading state', () => {
    render(<LoadingStatus />)

    expect(screen.getByRole('status').textContent).toContain('Loading')
  })
})
