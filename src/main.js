import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import db from '@/db'

firebase.initializeApp({
  apiKey: 'AIzaSyBb3bkrYkEd3b9B4O4g-o7-hwF8Wr_8rpc',
  authDomain: 'czard-db.firebaseapp.com',
  databaseURL: 'https://czard-db.firebaseio.com',
  projectId: 'czard-db',
  storageBucket: '',
  messagingSenderId: '921443101176'
})

Vue.prototype.$db = db

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
