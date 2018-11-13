<template>
  <div class="users-list">
    {{ users }}
    <div
      v-for="(user, key) in users"
      :key="key"
    >{{ user.lastSeen.seconds }}</div>
    {{ now }}
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'UsersList',

  data () {
    return {
      users: {},
      now: Math.floor(Date.now() / 1000)
    }
  },

  mounted () {
    this.$db.collection('users')
      .where('lastSeen', '>=', 1000)
      .onSnapshot(snapshot => {
        this.users = {}

        snapshot.forEach(doc => {
          if (doc) Vue.set(this.users, doc.id, doc.data())
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.users-list {

}
</style>
