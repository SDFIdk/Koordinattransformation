<template>
  <div class="content" @click="handleClose">
    <div class="lines"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuCloser',
  methods: {
    handleClose () {
      this.$emit('handle-close')
    }
  }
}
</script>

<style>
  .content {
    position: relative;
    width: 100%;
    height: 1.5rem;
    background: white;
  }
  .lines {
    position: absolute;
    right: 45%;
    top: 35%;
    height: 0.5rem;
    width: 3rem;
    border-bottom: 2px solid var(--action);
    border-top: 2px solid var(--action);
  }
</style>
