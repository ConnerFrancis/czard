<template>
  <div id="app">
    <router-view />
    <current-user-modal />
    <toast />
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue'
import CurrentUserModal from '@/components/currentUser/CurrentUserModal.vue'

export default {
  name: 'App',

  components: {
    toast: Toast,
    'current-user-modal': CurrentUserModal
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
