export const createQuoteInputFields = ({ values, setValues, validationErrors }) => [
  {
    id: 'text',
    name: 'text',
    placeholder: 'Quote text',
    value: values.text,
    error: validationErrors.text,
    onChange: setValues
      ? (e) => setValues({ ...values, text: e.target.value })
      : undefined,
  },
  {
    id: 'author',
    name: 'author',
    placeholder: 'Author',
    value: values.author,
    error: validationErrors.author,
    onChange: setValues
      ? (e) => setValues({ ...values, author: e.target.value })
      : undefined,
  },
  {
    id: 'categories',
    name: 'categories',
    placeholder: 'Categories (comma-separated)',
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
    placeholder: 'Search by text',
    value: searchValues.text,
    error: validationErrors.text,
  },
  {
    id: 'author',
    name: 'author',
    placeholder: 'Search by author',
    value: searchValues.author,
    error: validationErrors.author,
  },
  {
    id: 'category',
    name: 'category',
    placeholder: 'Search by category',
    value: searchValues.category,
    error: validationErrors.category,
  },
  {
    id: 'limit',
    name: 'limit',
    placeholder: 'Limit',
    value: searchValues.limit || '',
    error: null,
  },
]
