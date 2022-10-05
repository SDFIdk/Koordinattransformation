<template>
  <svg
    viewBox="0 0 56 56"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M34 16h6m0 0v6m0-6l-8 8M22 40h-6m0 0v-6m0 6l7-8m17 2v6m0 0h-6m6 0l-8-8M16 22v-6m0 0h6m-6 0l8 8"
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
