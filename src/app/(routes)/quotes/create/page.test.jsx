import { metadata } from './page'

jest.mock('@/actions/quote', () => ({
  createQuoteAction: jest.fn(),
}))

jest.mock('@/components/quote-form', () => ({ QuoteForm: () => <form /> }))

describe('Create quote page', () => {
  it('is not indexed', () => {
    expect(metadata.robots.index).toBe(false)
  })
})
