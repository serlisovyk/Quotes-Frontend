export class ApiError extends Error {
  constructor({ message, status, code, fields }) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}
