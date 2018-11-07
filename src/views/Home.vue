<template>
  <div class="home">
    <rooms-list />
  </div>
</template>

<script>
import RoomsList from '@/components/rooms/RoomsList.vue'

export default {
  name: 'Home',

  components: {
    'rooms-list': RoomsList
  },

  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
