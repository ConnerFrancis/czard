<template>
  <div class="rooms-create-dialogue" v-if="show">
    <form @submit.prevent="submit">
      <input type="text" v-model="title" />
      <button type="button" @click="show = !show">Close</button>
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import auth from '@/auth'

export default {
  name: 'RoomsCreateDialogue',

  data () {
    return {
      show: false,

      title: null,
      decks: ['default']
    }
  },

  methods: {
    toggle () {
      this.show = !this.show
    },

    submit () {
      this.$api.rooms.createRoom(this.title, this.decks, auth.currentUser.uid)
        .then(id => {
          this.$store.dispatch('toast/add', {
            type: 'info',
            message: 'Successfully created room ' + id + '.'
          })
          this.$router.push('/room/' + id)
        })
        .catch(e => this.$store.dispatch('toast/error', e))
    }
  }
}
</script>

<style lang="scss" scoped>
.rooms-create-dialogue {
  /* Display */
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Size */
  width: 100vw;
  height: 100vh;
  /* Colors */
  background-color: black;
  background-color: rgba(0,0,0,0.5);
}
</style>
