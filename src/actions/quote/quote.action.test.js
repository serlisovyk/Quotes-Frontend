import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { deleteQuote, patchQuote, postQuote } from '@/services/quotes'
import { ApiError } from '@/errors/api'
import {
  createQuoteAction,
  deleteQuoteAction,
  updateQuoteAction,
} from './quote.action.js'

jest.mock('next/navigation', () => ({
  redirect: jest.fn((url) => {
    const error = new Error('NEXT_REDIRECT')

    error.digest = `NEXT_REDIRECT;push;${url};307;`

    throw error
  }),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('@/services/quotes', () => ({
  postQuote: jest.fn(),
  patchQuote: jest.fn(),
  deleteQuote: jest.fn(),
}))

const QUOTE_ID = '42'

const validValues = {
  text: 'Stay sharp and keep going',
  author: 'Winston Churchill',
  categories: 'life, work',
}

const validPayload = {
  text: 'Stay sharp and keep going',
  author: 'Winston Churchill',
  categories: ['life', 'work'],
}

const invalidValues = { text: 'short', author: 'A', categories: '' }

function createFormData(values) {
  const formData = new FormData()

  Object.entries(values).forEach(([name, value]) => formData.append(name, value))

  return formData
}

async function catchError(promise) {
  try {
    await promise
  } catch (error) {
    return error
  }
}

describe('Quote Server Actions', () => {
  afterEach(() => jest.clearAllMocks())

  describe('createQuoteAction', () => {
    test('returns validation errors and does not call the API', async () => {
      const state = await createQuoteAction(null, createFormData(invalidValues))

      expect(state.values).toEqual(invalidValues)
      expect(Object.keys(state.errors)).toEqual(['text', 'author', 'categories'])
      expect(postQuote).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('returns the API error message as form state', async () => {
      postQuote.mockRejectedValue(
        new ApiError({ message: 'Backend is down', status: 500 }),
      )

      const state = await createQuoteAction(null, createFormData(validValues))

      expect(state).toEqual({
        values: validValues,
        errors: {},
        formError: 'Backend is down',
      })
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('returns API field errors as form state', async () => {
      postQuote.mockRejectedValue(
        new ApiError({
          message: 'Invalid request data',
          status: 400,
          fields: { text: 'Text is taken' },
        }),
      )

      const state = await createQuoteAction(null, createFormData(validValues))

      expect(state.errors).toEqual({ text: 'Text is taken' })
      expect(state.formError).toBe('Text is taken (text)')
      expect(redirect).not.toHaveBeenCalled()
    })

    test('revalidates the public pages and redirects to the new quote', async () => {
      postQuote.mockResolvedValue({ id: 7 })

      const error = await catchError(
        createQuoteAction(null, createFormData(validValues)),
      )

      expect(postQuote).toHaveBeenCalledWith(validPayload)
      expect(revalidatePath).toHaveBeenCalledTimes(3)
      expect(revalidatePath).toHaveBeenCalledWith('/')
      expect(revalidatePath).toHaveBeenCalledWith('/search')
      expect(revalidatePath).toHaveBeenCalledWith('/random')
      expect(redirect).toHaveBeenCalledWith('/quotes/7?toast=created')
      expect(error?.message).toBe('NEXT_REDIRECT')
    })
  })

  describe('updateQuoteAction', () => {
    test('returns validation errors and does not call the API', async () => {
      const state = await updateQuoteAction(
        QUOTE_ID,
        null,
        createFormData(invalidValues),
      )

      expect(state.values).toEqual(invalidValues)
      expect(Object.keys(state.errors)).toEqual(['text', 'author', 'categories'])
      expect(patchQuote).not.toHaveBeenCalled()
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('returns the API error message as form state', async () => {
      patchQuote.mockRejectedValue(
        new ApiError({ message: 'Quote not found', status: 404 }),
      )

      const state = await updateQuoteAction(
        QUOTE_ID,
        null,
        createFormData(validValues),
      )

      expect(state).toEqual({
        values: validValues,
        errors: {},
        formError: 'Quote not found',
      })
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('revalidates the quote pages and redirects to the quote', async () => {
      patchQuote.mockResolvedValue({ id: 42 })

      const error = await catchError(
        updateQuoteAction(QUOTE_ID, null, createFormData(validValues)),
      )

      expect(patchQuote).toHaveBeenCalledWith(QUOTE_ID, validPayload)
      expect(revalidatePath).toHaveBeenCalledTimes(4)
      expect(revalidatePath).toHaveBeenCalledWith('/')
      expect(revalidatePath).toHaveBeenCalledWith('/search')
      expect(revalidatePath).toHaveBeenCalledWith('/random')
      expect(revalidatePath).toHaveBeenCalledWith('/quotes/42')
      expect(redirect).toHaveBeenCalledWith('/quotes/42?toast=updated')
      expect(error?.message).toBe('NEXT_REDIRECT')
    })
  })

  describe('deleteQuoteAction', () => {
    test('returns the API error message and does not redirect', async () => {
      deleteQuote.mockRejectedValue(
        new ApiError({ message: 'Quote not found', status: 404 }),
      )

      const state = await deleteQuoteAction(QUOTE_ID)

      expect(state).toEqual({ error: 'Quote not found' })
      expect(revalidatePath).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    test('revalidates the quote pages and redirects to the home page', async () => {
      deleteQuote.mockResolvedValue(null)

      const error = await catchError(deleteQuoteAction(QUOTE_ID))

      expect(deleteQuote).toHaveBeenCalledWith(QUOTE_ID)
      expect(revalidatePath).toHaveBeenCalledTimes(4)
      expect(revalidatePath).toHaveBeenCalledWith('/quotes/42')
      expect(redirect).toHaveBeenCalledWith('/?toast=deleted')
      expect(error?.message).toBe('NEXT_REDIRECT')
    })
  })
})
