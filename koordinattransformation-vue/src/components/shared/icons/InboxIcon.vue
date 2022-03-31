<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13 8.05H9.96L8.95 9.57H6.93L5.9 8.05H2.87"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4.62 4.56L2.87 8.05v3.04A1.01 1.01 0 003.9 12.1h8.1A1.01 1.01 0 0013 11.09V8.05l-1.75-3.49a1.01 1.01 0 00-.9-.56H5.53a1.01 1.01 0 00-.9.56v0z"
    />
  </svg>
</template>

<script>
export default {
  name: 'InboxIcon',
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
