import { render } from '@testing-library/react'
import { toast } from 'sonner'
import AppToasts from '@components/AppToasts'

const mockReplace = jest.fn()
const mockUsePathname = jest.fn()
const mockUseSearchParams = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => mockUseSearchParams(),
}))

jest.mock('sonner', () => ({
  Toaster: () => null,
  toast: { success: jest.fn() },
}))

const renderWithSearch = (search) => {
  mockUsePathname.mockReturnValue('/search')
  mockUseSearchParams.mockReturnValue(new URLSearchParams(search))

  return render(<AppToasts />)
}

describe('App Toasts', () => {
  test.each([
    ['created', 'Quote created successfully.'],
    ['updated', 'Quote updated successfully.'],
    ['deleted', 'Quote deleted successfully.'],
  ])('shows the %s success toast', (toastType, message) => {
    renderWithSearch(`toast=${toastType}`)

    expect(toast.success).toHaveBeenCalledWith(message, {
      id: `success-${toastType}`,
    })
  })

  test('removes the toast param from the URL after showing the toast', () => {
    renderWithSearch('toast=created')

    expect(mockReplace).toHaveBeenCalledWith('/search')
  })

  test('keeps the other search params when removing the toast param', () => {
    renderWithSearch('text=life&toast=deleted&limit=5')

    expect(mockReplace).toHaveBeenCalledWith('/search?text=life&limit=5')
  })

  test('ignores an unknown toast type', () => {
    renderWithSearch('toast=unknown')

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  test('does nothing without the toast param', () => {
    renderWithSearch('text=life')

    expect(toast.success).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})
