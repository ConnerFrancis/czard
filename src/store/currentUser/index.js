import Vue from 'vue'

import db from '@/db'
import auth from '@/auth'

import { OperationError } from '@/error'

import {
  LOGIN,
  UPDATEDATA
} from './mutations'

const users = db.collection('users')

const state = {
  id: null,
  data: {},
  loggedIn: false
}

const mutations = {
  /**
   * Set the state and nothing more.
   *
   * @param {Object} state - Given by vuex.
   * @param {Object} user  - User data for first populate the state data with.
   */
  [LOGIN] (state, data) {
    Vue.set(state, 'data', data)
    Vue.set(state, 'loggedIn', true)
    return data
  },

  /**
   * Update the state.
   *
   * @param {string} payload.id   - User id.
   * @param {Object} payload.data - User data.
   */
  [UPDATEDATA] (state, payload) {
    Vue.set(state, 'id', payload.id)
    Vue.set(state, 'data', payload.data)
  }
}

const actions = {
  /**
   * Set initial data in the database and state for a login.
   *
   * @param {Object} data - User object from firebase auth.
   */
  async login (context, data) {
    const user = users.doc(data.uid)
    /* 1: Set initial database data.
     * 2: Set initial state data.
     */
    return user.set({
      online: true,
      lastSeen: Math.floor(Date.now()),
      anonymous: data.isAnonymous
    }, { merge: true })
      .then(() => {
        return user.get().then(doc => context.commit(LOGIN, doc.data()))
      })
      .catch(e => context.dispatch('toast/error', new OperationError('User login operations failed.', 'currentUser/login/fail', e)))
  },

  /**
   * Update the user's data
   *
   * @param {string|number} payload.id   - User database reference id.
   * @param {Object}        payload.data - User data object.
   */
  async updateData (context, payload) {
    // eslint-disable-next-line
    if (payload.id == false || payload.data == false) throw new OperationError('Failed to update currentUser data (missing args).', 'currentUser/updateData/missing-args')

    try {
      context.commit(UPDATEDATA, payload)
      return payload
    } catch (e) {
      throw new OperationError('Failed to update currentUser data.', 'currentUser/UPDATEDATA/fail', e)
    }
  }
}

const getters = {
  /**
   * Retrieve a snapshot of the doc
   *
   * @return {Object} User data.
   */
  snapshot () {
    return users.doc(auth.currentUser.uid)
      .get()
      .then(doc => {
        return doc.data()
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
