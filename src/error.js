/**
 * Provides simple support for operation based errors with codes.
 * @extends SyntaxError
 */
export class OperationError extends Error {
  /**
   * @param {string} message      - Short error description.
   * @param {string} [code=null]  - Hierarchy based code, e.g. 'db/api/rooms/getters/all/failed-query'.
   * @param {Error}  [cause=null] - Reference to the potential original error.
   */
  constructor (message, code = null, cause = null) {
    const finalMessage = (cause === null) ? message : message + '#CAUSE#' + cause
    super(finalMessage)
    this.name = 'OperationError'
    this.message = finalMessage
    this.code = code
    this.cause = cause
    Error.captureStackTrace(this, this.constructor)
  }
}
