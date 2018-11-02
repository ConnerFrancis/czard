import Vue from 'vue'

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
      // I can throw literals WHENEVER I WANT THE FUTURE IS NOW OLD MAN
      // eslint-disable-next-line
      throw ({ code: 'toast/add/invalid-message', message: 'Message is invalid or does not exist.' })
    }
    // We need to use Vue.set, since Vue cannot detect
    // normal object key changes
    Vue.set(state.toasts, state.lastId + 1, payload)
    // Increase the last id
    state.lastId += 1
  },

  [DEPRECATE] (state, id) {
    // Append the toast to the deprecated list
    Vue.set(state.deprecated, id, state.toasts[id])
    // Delete the toast from the fresh list
    Vue.delete(state.toasts, id)
  },

  [REMOVE] (state, id) {
    Vue.delete(state.toasts, id)
    Vue.delete(state.deprecated, id)
  }

}

const actions = {

  /**
   * Add a new toast
   *
   * @param payload: { type, code, message }
   */
  async add (context, payload) {
    try {
      context.commit(ADD, payload)
    } catch (e) {
      throw e
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
