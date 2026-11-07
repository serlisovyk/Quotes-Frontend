import { DEFAULT_SEARCH_LIMIT, SEARCH_LIMIT_OPTIONS } from '@/constants'

export const createQuoteInputFields = ({ values, setValues, validationErrors }) => [
  {
    id: 'text',
    name: 'text',
    label: 'Quote text',
    value: values.text,
    error: validationErrors.text,
    onChange: setValues
      ? (e) => setValues({ ...values, text: e.target.value })
      : undefined,
  },
  {
    id: 'author',
    name: 'author',
    label: 'Author',
    value: values.author,
    error: validationErrors.author,
    onChange: setValues
      ? (e) => setValues({ ...values, author: e.target.value })
      : undefined,
  },
  {
    id: 'categories',
    name: 'categories',
    label: 'Categories (comma-separated)',
    control: 'category',
    isMultiple: true,
    value: values.categories,
    error: validationErrors.categories,
    onChange: setValues
      ? (e) => setValues({ ...values, categories: e.target.value })
      : undefined,
  },
]

export const createSearchInputFields = ({ searchValues, validationErrors }) => [
  {
    id: 'text',
    name: 'text',
    label: 'Text',
    placeholder: 'e.g. courage',
    value: searchValues.text,
    error: validationErrors.text,
  },
  {
    id: 'author',
    name: 'author',
    label: 'Author',
    placeholder: 'e.g. Winston Churchill',
    value: searchValues.author,
    error: validationErrors.author,
  },
  {
    id: 'category',
    name: 'category',
    label: 'Category',
    control: 'category',
    placeholder: 'e.g. leadership',
    value: searchValues.category,
    error: validationErrors.category,
  },
  {
    id: 'limit',
    name: 'limit',
    label: 'Limit',
    control: 'select',
    options: SEARCH_LIMIT_OPTIONS,
    value: searchValues.limit || String(DEFAULT_SEARCH_LIMIT),
    error: validationErrors.limit,
  },
]
