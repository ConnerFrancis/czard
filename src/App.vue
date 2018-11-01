<template>
  <div id="app">
    uhm view pls:
    <router-view />
    <toast />
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue'

export default {
  name: 'App',

  components: {
    toast: Toast
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
