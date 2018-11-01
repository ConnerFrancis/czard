import {
  LOGIN
} from './mutations'

const state = {
  data: {}
}

const mutations = {
  [LOGIN] (state, user) {
    state.data = user
  }
}

const actions = {
  loginAnonymously (context, user) {
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
