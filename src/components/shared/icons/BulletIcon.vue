<template>
  <svg
    viewBox="0 0 24 24"
  >
    <circle :fill="color" cx="12" cy="12" r="6"/>
  </svg>
</template>

<script>
export default {
  name: 'BulletIcon',
  props: {
    color: {
      type: String
    }
  }
}
</script>
