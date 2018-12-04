<template>
  <div class="room">{{ room }}</div>
</template>

<script>
export default {
  name: 'Room',

  data () {
    return {
      room: ''
    }
  },

  created () {
    this.$db.collection('rooms')
      .doc(this.$route.params.id)
      .onSnapshot(snapshot => {
        this.room = snapshot.data()
      })
  }
}
</script>

<style lang="scss" scoped>
.room {

}
</style>
