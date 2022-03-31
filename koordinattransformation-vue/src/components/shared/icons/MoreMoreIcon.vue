<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      d="M6 18L12 12L6 6M13 18L19 12L13 6"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'MoreMoreIcon',
  props: {
    color: {
      type: String
    },
    strokeWidth: {
      type: [Number, String],
      default: 1
    }
  }
}
</script>
