<template>
  <div class="rooms-list">
    <rooms-create-dialogue ref="dialogue" />
    <div>
      <button @click="toggleDialogue">Create room</button>
    </div>
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
import auth from '@/auth'

import RoomsCreateDialogue from '@/components/rooms/RoomsCreateDialogue.vue'

export default {
  name: 'RoomsList',

  components: {
    'rooms-create-dialogue': RoomsCreateDialogue
  },

  data () {
    return {
      rooms: {}
    }
  },

  methods: {
    toggleDialogue () {
      this.$refs.dialogue.toggle()
    },

    joinRoom (room, isPlayer) {
      // If the player is not a spectator
      if (isPlayer) this.$api.rooms.joinRoom(auth.currentUser.uid, room).catch(e => this.$store.dispatch('toast/error', e))

      // Always redirect to the room
      this.$router.push('/room/' + room)
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
