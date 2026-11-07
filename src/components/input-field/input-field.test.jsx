import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputField } from './input-field.jsx'

const renderField = (props = {}) =>
  render(<InputField id="author" placeholder="Author" {...props} />)

describe('Input Field', () => {
  test('labels the input with its placeholder and names it after the id', () => {
    renderField()

    expect(screen.getByLabelText('Author')).toHaveAttribute('name', 'author')
  })

  test('uses the name it is given instead of the id', () => {
    renderField({ name: 'quoteAuthor' })

    expect(screen.getByLabelText('Author')).toHaveAttribute('name', 'quoteAuthor')
  })

  test('starts with the default value', () => {
    renderField({ defaultValue: 'Churchill' })

    expect(screen.getByLabelText('Author')).toHaveValue('Churchill')
  })

  test('keeps what the user types when it holds its own value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderField({ onChange })

    await user.type(screen.getByLabelText('Author'), 'Ann')

    expect(screen.getByLabelText('Author')).toHaveValue('Ann')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  test('shows the controlled value and reports typing to the parent', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderField({ value: 'Ann', onChange })

    await user.type(screen.getByLabelText('Author'), 'a')

    expect(screen.getByLabelText('Author')).toHaveValue('Ann')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  test('shows an empty value for a controlled null', () => {
    renderField({ value: null })

    expect(screen.getByLabelText('Author')).toHaveValue('')
  })

  test('shows no clear button while the field is empty', () => {
    renderField()

    expect(
      screen.queryByRole('button', { name: 'Clear Author' }),
    ).not.toBeInTheDocument()
  })

  test('clears its own value, tells the parent and refocuses the input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderField({ defaultValue: 'Ann', onChange })

    await user.click(screen.getByRole('button', { name: 'Clear Author' }))

    expect(screen.getByLabelText('Author')).toHaveValue('')
    expect(screen.getByLabelText('Author')).toHaveFocus()
    expect(onChange).toHaveBeenCalledWith({ target: { value: '' } })
  })

  test('only tells the parent to clear a controlled value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderField({ value: 'Ann', onChange })

    await user.click(screen.getByRole('button', { name: 'Clear Author' }))

    expect(screen.getByLabelText('Author')).toHaveValue('Ann')
    expect(onChange).toHaveBeenCalledWith({ target: { value: '' } })
  })

  test('clears without a parent callback', async () => {
    const user = userEvent.setup()
    renderField({ defaultValue: 'Ann' })

    await user.click(screen.getByRole('button', { name: 'Clear Author' }))

    expect(screen.getByLabelText('Author')).toHaveValue('')
  })

  test('marks the field invalid and links its error when the error is shown', () => {
    renderField({ error: 'Author is required', showError: true })

    const input = screen.getByLabelText('Author')

    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Author is required')
  })

  test('hides the error until it is meant to be shown', () => {
    renderField({ error: 'Author is required', showError: false })

    const input = screen.getByLabelText('Author')

    expect(input).toBeValid()
    expect(input).not.toHaveAttribute('aria-describedby')
    expect(screen.queryByText('Author is required')).not.toBeInTheDocument()
  })

  test('passes the number attributes to the input', () => {
    renderField({
      id: 'limit',
      placeholder: 'Limit',
      type: 'number',
      min: 1,
      max: 9,
      step: 2,
    })

    const input = screen.getByLabelText('Limit')

    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('min', '1')
    expect(input).toHaveAttribute('max', '9')
    expect(input).toHaveAttribute('step', '2')
  })
})
