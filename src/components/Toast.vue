<template>
  <div class="toast">
    <div
      v-for="(value, key) in toasts"
      :key="key"
      :class="value.type"
      @click="deprecate(key)"
    >
      <span v-if="value.type" class="type"></span>
      <span v-if="value.code" class="code">{{ value.code }}</span>
      <span class="message" v-if="value.html" v-html="value.message"></span>
      <span class="message" v-else>{{ value.message }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Toast',

  computed: {
    ...mapState({
      toasts: state => state.toast.toasts,
      deprecated: state => state.toast.deprecated
    })
  },

  methods: {
    deprecate (id) {
      this.$store.dispatch('toast/deprecate', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.toast {
  /* Display */
  position: fixed;
  z-index: 2;
}
</style>
