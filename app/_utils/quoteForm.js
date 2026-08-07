export const createInitialQuoteFormState = (values) => ({
  values,
  errors: {},
  formError: '',
})

export const createQuoteFormValues = (quote) => ({
  text: quote.text,
  author: quote.author,
  categories: quote.categories.join(', '),
})
