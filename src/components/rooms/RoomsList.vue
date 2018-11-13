<template>
  <div class="rooms-list">
    rooms pls:
    {{ rooms }}
    <div
      v-for="(room, key) in rooms"
      class="room"
      :key="key"
    >
      <span class="name">{{ room.name }}</span>
      <span class="players">{{ room.players.length }} <template v-if="room.players.length == 1">player</template><template v-else>players</template></span>
      <button @click="joinRoom(key, true)">Join</button>
    <button @click="joinRoom(key, false)">Spectate</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import firebase from 'firebase'

export default {
  name: 'RoomsList',

  data () {
    return {
      rooms: {}
    }
  },

  methods: {
    joinRoom (id, isPlayer) {
      // Only add to the players if u wanna
      if (isPlayer) {
        this.$db.collection('rooms')
          .doc(id)
          .update({
            players: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
          })
      }

      this.$router.push('/room/' + id)
    }
  },

  mounted () {
    this.$db.collection('rooms')
      .onSnapshot(snapshot => {
        // Reset in case a doc is deleted
        this.rooms = {}
        // NOTE: We need to use the forEach
        //       since merely setting this.rooms
        //       to the collection is just a
        //       reference object.
        snapshot.forEach(doc => {
          // NOTE: Use Vue.set for reactivity
          if (doc) Vue.set(this.rooms, doc.id, doc.data())
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.rooms-list {

}
</style>
