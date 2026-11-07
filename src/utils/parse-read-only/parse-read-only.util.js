export function parseReadOnly(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'true'
}
