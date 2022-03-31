<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13 13l-2-2M8 12a4 4 0 100-8 4 4 0 000 8z"
    />
  </svg>
</template>

<script>
export default {
  name: 'SearchIcon',
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
