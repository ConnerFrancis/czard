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
      <span class="title">{{ room.title }}</span>
      <span class="players">{{ room.players.length }} <template v-if="room.players.length == 1">player</template><template v-else>players</template></span>
      <button @click="joinRoom(key, true)">Join</button>
      <button @click="joinRoom(key, false)">Spectate</button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import RoomsCreateDialogue from '@/components/rooms/RoomsCreateDialogue.vue'

export default {
  name: 'RoomsList',

  components: {
    'rooms-create-dialogue': RoomsCreateDialogue
  },

  data () {
    return {
      rooms: {},
      user: {}
    }
  },

  methods: {
    /** Show and hide the dialogue box for creating a room. */
    toggleDialogue () {
      /* We need to reference the $ref here, since doing
       * so in markup references the $ref before the
       * $ref value is filled.
       */
      this.$refs.dialogue.toggle()
    },

    /**
     * Join a room.
     *
     * @param {string}  room     - ID of the room to join.
     * @param {boolean} isPlayer - Whether the player is actually joining or not. Set to false, this sets the player as a spectator.
     */
    joinRoom (room, isPlayer) {
      // If the player is not a spectator...
      if (isPlayer) this.$api.rooms.joinRoom(room).catch(e => this.$store.dispatch('toast/error', e))

      // Always redirect to the room.
      this.$router.push('/room/' + room)
    }
  },

  mounted () {
    this.$db.collection('rooms')
      .onSnapshot(snapshot => {
        // Reset in case a doc is deleted
        this.rooms = {}
        /* NOTE: We need to use the
         * forEach since merely setting this.rooms
         * to the collection sets it to the reference,
         * not the data.
         */
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
