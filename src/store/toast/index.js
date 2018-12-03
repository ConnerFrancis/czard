import Vue from 'vue'

import { OperationError } from '@/error'

import {
  ADD,
  DEPRECATE,
  REMOVE
} from './mutations'

const state = {
  toasts: {},
  deprecated: {},

  lastId: 0
}

const mutations = {
  [ADD] (state, payload) {
    if (payload.message == null) {
      throw new OperationError('Message given is invalid or does not exist.', 'toast/add/invalid-message')
    }
    Vue.set(state.toasts, state.lastId + 1, payload)
    state.lastId += 1
  },

  [DEPRECATE] (state, id) {
    Vue.set(state.deprecated, id, state.toasts[id])
    Vue.delete(state.toasts, id)
  },

  [REMOVE] (state, id) {
    Vue.delete(state.toasts, id)
    Vue.delete(state.deprecated, id)
  }
}

const actions = {
  /**
   * Add a new toast.
   *
   * @param {string}  payload.type    - Error, success, etc.
   * @param {string}  payload.code    - Used in error messages to reference code.
   * @param {string}  payload.message - Message for the user.
   * @param {boolean} payload.rawHtml - Is the message raw HTML?
   */
  async add (context, payload) {
    try {
      context.commit(ADD, payload)
    } catch (e) {
      throw e
    }
  },

  /**
   * Deprecate a toast.
   * This does not remove the toast; rather, it moves it to state.deprecated.
   *
   * @param {string|number} id - ID of the toast to deprecate.
   */
  async deprecate (context, id) {
    context.commit(DEPRECATE, id)
  },

  /**
   * Remove a toast.
   *
   * @param {string|number} id - ID of the toast to remove.
   */
  async remove (context, id) {
    context.commit(REMOVE, id)
  },

  /**
   * Add an error toast.
   * This takes an error object and handles it (for syntactical sugar).
   *
   * @param {Error} e - Error object to be added as a toast.
   */
  async error (context, e) {
    try {
      context.commit(ADD, {
        type: 'error',
        code: e.code,
        message: '#MESSAGE#' + e.message + '#STACK#' + e.stack
      })
    } catch (e) {
      throw e
    }
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
