<template>
  <div class="toast">
    <div
      v-for="toast in toasts"
      :key="toast"
      :class="toast.type"
    >
      <span v-if="toast.type" class="type">{{ toast.type }}</span>
      <span v-if="toast.code" class="code"> {{ toast.code }}</span>
      <span class="message"> {{ toast.message }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Toast',

  computed: {
    ...mapState({
      toasts: state => state.toast.toasts
    })
  }
}
</script>

<style lang="scss" scoped>

</style>
