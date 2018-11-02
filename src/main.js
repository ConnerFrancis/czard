import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import db from './db'
import api from './db/api'

Vue.prototype.$db = db
// eslint-disable-next-line
;Vue.prototype.$api = api

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
