export function createSearchFormState(searchValues) {
  return {
    searchValues,
    validationErrors: {},
    showError: false,
  }
}
