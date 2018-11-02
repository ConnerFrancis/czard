import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import db from './db'
import api from './db/api'

import './auth'

// Disabling eslint because some IDEs throw a fit on these lines.
// eslint-disable-next-line
Vue.prototype.$db = db;
// eslint-disable-next-line
Vue.prototype.$api = api;

Vue.config.productionTip = false

/* Ideally we use this but this breaks everything?
Vue.config.errorHandler = function (e, vm, info) {
  console.log(e)
}
*/

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
