<template>
  <div class="users">
    <users-list />
  </div>
</template>

<script>
import UsersList from '@/components/users/UsersList.vue'

export default {
  name: 'Users',

  components: {
    'users-list': UsersList
  }
}
</script>

<style lang="scss" scoped>
.users {

}
</style>
