export const createQuoteInputFields = ({ values, setValues, validationErrors }) => [
  {
    id: 'text',
    placeholder: 'Quote text',
    value: values.text,
    error: validationErrors.text,
    onChange: (e) => setValues({ ...values, text: e.target.value }),
  },
  {
    id: 'author',
    placeholder: 'Author',
    value: values.author,
    error: validationErrors.author,
    onChange: (e) => setValues({ ...values, author: e.target.value }),
  },
  {
    id: 'categories',
    placeholder: 'Categories (comma-separated)',
    value: values.categories,
    error: validationErrors.categories,
    onChange: (e) => setValues({ ...values, categories: e.target.value }),
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
