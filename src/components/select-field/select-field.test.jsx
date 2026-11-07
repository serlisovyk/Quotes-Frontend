import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectField } from './select-field.jsx'

const renderField = (props = {}) =>
  render(
    <SelectField
      id="limit"
      label="Limit"
      options={[10, 20, 50]}
      value="10"
      onChange={vi.fn()}
      {...props}
    />,
  )

describe('Select Field', () => {
  test('labels the select with a visible label and names it after the id', () => {
    renderField()

    expect(screen.getByRole('combobox', { name: 'Limit' })).toHaveAttribute(
      'name',
      'limit',
    )
    expect(screen.getByText('Limit', { selector: 'label' })).toBeVisible()
  })

  test('uses the name it is given instead of the id', () => {
    renderField({ name: 'pageSize' })

    expect(screen.getByLabelText('Limit')).toHaveAttribute('name', 'pageSize')
  })

  test('lists the options and shows the chosen value', () => {
    renderField({ value: '20' })

    const options = screen
      .getAllByRole('option')
      .map(({ textContent }) => textContent)

    expect(options).toEqual(['10', '20', '50'])
    expect(screen.getByLabelText('Limit')).toHaveValue('20')
  })

  test('reports the chosen option to the parent', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn((event) => event.target.value)
    renderField({ onChange })

    await user.selectOptions(screen.getByLabelText('Limit'), '50')

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveReturnedWith('50')
  })

  test('marks the field invalid and links its error when the error is shown', () => {
    renderField({ error: 'Limit must be in range 1..50.', showError: true })

    const select = screen.getByLabelText('Limit')

    expect(select).toBeInvalid()
    expect(select).toHaveAccessibleDescription('Limit must be in range 1..50.')
  })

  test('hides the error until it is meant to be shown', () => {
    renderField({ error: 'Limit must be in range 1..50.', showError: false })

    expect(screen.getByLabelText('Limit')).toBeValid()
    expect(
      screen.queryByText('Limit must be in range 1..50.'),
    ).not.toBeInTheDocument()
  })
})
