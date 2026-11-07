import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { QUOTE_ACTION_TOAST_MESSAGES } from '@/constants'
import { useQuoteActions } from './use-quote-actions.js'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const quote = { id: 7, text: 'Be yourself', author: 'Oscar Wilde' }
const quoteLink = `${window.location.origin}/quotes/7`

const renderQuoteActions = () => renderHook(() => useQuoteActions(quote))

describe('Use Quote Actions', () => {
  let writeText
  let share

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue()
    share = vi.fn().mockResolvedValue()

    vi.stubGlobal('navigator', { clipboard: { writeText }, share })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('copyQuote', () => {
    test('writes the formatted quote to the clipboard and shows a success toast', async () => {
      const { result } = renderQuoteActions()

      await act(() => result.current.copyQuote())

      expect(writeText).toHaveBeenCalledWith('"Be yourself" — Oscar Wilde')
      expect(toast.success).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.QUOTE_COPIED,
      )
    })

    test('shows an error toast when the clipboard refuses the write', async () => {
      writeText.mockRejectedValue(new DOMException('denied', 'NotAllowedError'))
      const { result } = renderQuoteActions()

      await act(() => result.current.copyQuote())

      expect(toast.error).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.COPY_FAILED,
      )
      expect(toast.success).not.toHaveBeenCalled()
    })

    test('shows an error toast when there is no clipboard', async () => {
      vi.stubGlobal('navigator', {})
      const { result } = renderQuoteActions()

      await act(() => result.current.copyQuote())

      expect(toast.error).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.COPY_FAILED,
      )
    })
  })

  describe('shareQuote', () => {
    test('opens the system share sheet with the title, the text and the quote link', async () => {
      const { result } = renderQuoteActions()

      await act(() => result.current.shareQuote())

      expect(share).toHaveBeenCalledWith({
        title: 'Quote by Oscar Wilde',
        text: '"Be yourself" — Oscar Wilde',
        url: quoteLink,
      })
      expect(writeText).not.toHaveBeenCalled()
    })

    test('shows nothing when the user closes the share sheet', async () => {
      share.mockRejectedValue(new DOMException('cancelled', 'AbortError'))
      const { result } = renderQuoteActions()

      await act(() => result.current.shareQuote())

      expect(toast.error).not.toHaveBeenCalled()
      expect(toast.success).not.toHaveBeenCalled()
    })

    test('shows an error toast when sharing fails for another reason', async () => {
      share.mockRejectedValue(new Error('boom'))
      const { result } = renderQuoteActions()

      await act(() => result.current.shareQuote())

      expect(toast.error).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.SHARE_FAILED,
      )
    })

    test('copies the quote link when the share API is missing', async () => {
      vi.stubGlobal('navigator', { clipboard: { writeText } })
      const { result } = renderQuoteActions()

      await act(() => result.current.shareQuote())

      expect(writeText).toHaveBeenCalledWith(quoteLink)
      expect(toast.success).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.LINK_COPIED,
      )
    })

    test('shows the copy error toast when the link cannot be copied', async () => {
      vi.stubGlobal('navigator', {})
      const { result } = renderQuoteActions()

      await act(() => result.current.shareQuote())

      expect(toast.error).toHaveBeenCalledWith(
        QUOTE_ACTION_TOAST_MESSAGES.COPY_FAILED,
      )
    })
  })
})
