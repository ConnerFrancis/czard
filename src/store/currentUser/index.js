import db from '@/db'

import {
  LOGIN
} from './mutations'

const state = {
  // Holds init login data
  data: {},
  loggedIn: false
}

const mutations = {
  /**
   * Set the state and nothing more
   */
  [LOGIN] (state, user) {
    state.data = user
    state.loggedIn = true
  }
}

const actions = {
  /**
   * Commit and login
   */
  async login (context, user) {
    db.collection('users').doc(user.uid)
      .set({
        anonymous: user.isAnonymous
      }, { merge: true })
    context.commit(LOGIN, user)
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
