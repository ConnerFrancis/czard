/**
 * OperationError
 *
 * Throws an error with a code.
 * @param code: code for the error
 * @param message: message in the error
 */
export class OperationError extends Error {
  constructor (code, message) {
    super('(' + code + ') ' + message + '.')
    this.name = 'OperationError'
    this.code = code
  }
}
