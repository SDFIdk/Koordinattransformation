<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 12v-1a2 2 0 00-2-2H6a2 2 0 00-2 2v1M8 8a2.07 2.07 0 100-4.15A2.07 2.07 0 008 8z"
    />
  </svg>
</template>

<script>
export default {
  name: 'UserIcon',
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
