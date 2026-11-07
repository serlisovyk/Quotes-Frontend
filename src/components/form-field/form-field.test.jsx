import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './form-field.jsx'

describe('Form Field', () => {
  test('renders a text input by default', () => {
    render(<FormField id="author" label="Author" value="" onChange={vi.fn()} />)

    expect(screen.getByRole('textbox', { name: 'Author' })).toBeVisible()
  })

  test('renders a select for the select control', () => {
    render(
      <FormField
        id="limit"
        label="Limit"
        control="select"
        options={[10, 20]}
        value="10"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('combobox', { name: 'Limit' })).toBeVisible()
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })
})
