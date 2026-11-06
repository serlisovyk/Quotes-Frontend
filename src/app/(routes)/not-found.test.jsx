import { render, screen } from '@testing-library/react'
import NotFound from './not-found'

describe('Not Found page', () => {
  it('tells the page was not found', () => {
    render(<NotFound />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeTruthy()
  })

  it('links back to the home page', () => {
    render(<NotFound />)

    expect(
      screen.getByRole('link', { name: 'Go to home page' }).getAttribute('href'),
    ).toBe('/')
  })
})
