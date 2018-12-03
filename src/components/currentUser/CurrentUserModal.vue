<template>
  <div class="current-user-modal">
    {{ currentUser }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CurrentUserModal',

  computed: {
    ...mapState({
      currentUser: state => state.currentUser.data
    })
  }
}
</script>

<style lang="scss" scoped >
.current-user-modal {

}
</style>
