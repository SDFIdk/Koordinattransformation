<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M17.0001 6.99997L7.00004 17M6.99995 6.99997L17 17"
      />
  </svg>
</template>

<script>
export default {
  name: 'CloseIcon',
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
