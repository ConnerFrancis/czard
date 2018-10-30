<template>
  <div class="home">
    {{ error }}
    {{ db }}
  </div>
</template>

<script>

export default {
  name: 'Home',

  computed: {
    db () {
      return this.$db
    }
  },

  data () {
    return {
      error: 'blank'
    }
  }// ,

  // mounted () {
  //   this.$db.rooms.createRoom({ meme: 'meme' })
  //     .then(() => {
  //       this.error = 'none'
  //     })
  //     .catch(e => {
  //       this.error = e
  //     })
  // }
}
</script>

<style lang="scss" scoped>

</style>
