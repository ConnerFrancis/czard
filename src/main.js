import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './db/api'
import db from './db'

import './auth'

Vue.prototype.$api = api
Vue.prototype.$db = db

Vue.config.productionTip = false

/*
window.onerror = function (message, source, lineno, colno, error) {
  if (process.env.NODE_ENV !== 'production') {
    alert('Exception: ', error)
  }
}
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
