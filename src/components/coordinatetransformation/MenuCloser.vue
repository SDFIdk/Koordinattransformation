<template>
  <div class="content" @click="handleClose">
    <div class="lines"></div> <!-- TODO: remake this into an icon? -->
  </div>
</template>

<script>
/**
 * Dette er blot til at lukke/åbne menuen,
 * når applikationen er i på mobil
 * TODO: would like to have an animation
 */
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
    cursor: pointer;
  }
</style>
