<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 5V19M5 12H19"
    />
  </svg>
</template>

<script>
export default {
  name: 'PlusIcon',
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
