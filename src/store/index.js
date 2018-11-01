import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from './currentUser'
import toast from './toast'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    currentUser,
    toast
  }
})
