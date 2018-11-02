<template>
  <div class="home">
    hey fbi go away
    {{ error }}
    <a @click="newToast">add toast</a>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data () {
    return {
      error: 'none m8'
    }
  },

  methods: {
    newToast () {
      this.$store.dispatch('toast/add', {
        type: 'info',
        code: null,
        message: 'yo'
      })
        .catch(e => {
          this.error = { code: e.code, message: e.message }
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
