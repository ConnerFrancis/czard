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
    // Add a new toast
    state.toasts[state.lastId + 1] = payload
    // Increase the last id
    state.lastId += 1
  },

  [DEPRECATE] (state, id) {
    // Append the toast to the deprecated list
    state.deprecated[id] = state.toasts[id]
    // Delete the toast from the fresh list
    delete state.toasts[id]
  },

  [REMOVE] (state, id) {
    delete state.toasts[id]
    delete state.deprecated[id]
  }

}

const actions = {

  /**
   * Add a new toast
   *
   * @param payload: { type, code, message }
   */
  async add (context, payload) {
    /*
    if (!payload.message) {
      throw new OperationError('store/toast/add/no-message', 'Failed to add toast with code ' + payload.code + '.')
    }
    */

    try {
      context.commit(ADD, payload)
    } catch (e) {
      throw new OperationError(e.code, e.message)
    }
  },

  async deprecate (context, id) {
    context.commit(DEPRECATE, id)
  },

  async remove (context, id) {
    context.commit(REMOVE, id)
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
