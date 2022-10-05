<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 9.33h8M4 6.67h8"
    />
  </svg>
</template>

<script>
export default {
  name: 'BurgerIcon',
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
