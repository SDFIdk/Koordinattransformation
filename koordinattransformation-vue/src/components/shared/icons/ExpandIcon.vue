<template>
 <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
  >
    <path
      d="M6.57 10.87L9.43 8 6.57 5.13"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'ExpandIcon',
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
