import { render, screen } from '@testing-library/react'
import Loading from '../loading'

describe('Loading page', () => {
  it('announces the loading state', () => {
    render(<Loading />)

    expect(screen.getByRole('status').textContent).toContain('Loading')
  })
})
