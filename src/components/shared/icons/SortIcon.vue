<template>
  <svg
    viewBox="0 0 7 18"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3.66664 16.3333L3.66664 1M6.33333 14.3333L3.66667 17L1 14.3333"
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
