<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M6 15L12 18L18 15M6 12L12 15L18 12M12 6L6 9L12 12L18 9L12 6Z"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'StackIcon',
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    strokeWidth: {
      type: [Number, String],
      default: 1
    }
  }
}
</script>
