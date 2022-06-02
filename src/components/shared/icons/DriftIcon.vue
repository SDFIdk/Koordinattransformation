<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      d="M20 12H16.8L14.4 18L9.6 6L7.2 12H4"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: 'DriftIcon',
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
