<template>
  <svg
    viewBox="0 0 18 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M17 15H1M17 8H1M17 1H1"
    />
  </svg>
</template>

<script>
export default {
  name: 'AppIcon',
  props: {
    color: {
      type: String
    },
    strokeWidth: {
      type: [Number, String]
    }
  }
}
</script>
