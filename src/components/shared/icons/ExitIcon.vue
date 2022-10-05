<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M16 11.7333V14.9333C16 15.2162 15.8876 15.4875 15.6876 15.6876C15.4875 15.8876 15.2162 16 14.9333 16H9.06667C8.78377 16 8.51246 15.8876 8.31242 15.6876C8.11238 15.4875 8 15.2162 8 14.9333V9.06667C8 8.78377 8.11238 8.51246 8.31242 8.31242C8.51246 8.11238 8.78377 8 9.06667 8H12.2667M14.6667 6H18M18 6V9.33333M18 6L11.8888 12.1111"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'ExitIcon',
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
