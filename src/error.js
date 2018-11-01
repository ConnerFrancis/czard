import store from './store'

/**
 * OperationError
 *
 * Throws an error and shows a toast, automatically handling it for the user.
 * @param code: code for the error
 * @param message: message in the error
 * @param toast: whether or not to show a toast
 */
export class OperationError extends Error {
  constructor (code, message, toast = true) {
    super('(' + code + ') ' + message + '.')
    this.name = 'OperationError'
    this.code = code

    store.dispatch('toast/add', {
      type: 'error',
      code: code,
      message: message
    })
  }
}
