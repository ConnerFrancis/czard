/**
 * Users API
 */

import Vue from 'vue'
import db from '@/db'

const ref = db.collection('users')

const getters = {
  all () {
    let users = {}

    ref
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          Vue.set(users, doc.id, doc.data())
        })
      })

    return users
  }
}

const setters = {

}

export default {
  ...getters,
  ...setters
}
