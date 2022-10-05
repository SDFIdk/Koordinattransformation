<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M10 3.8c0-.44-.38-.8-.86-.8H4.86c-.48 0-.86.36-.86.8v6.4c0 .44.38.8.86.8"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11 4.8c0-.44-.38-.8-.86-.8H5.86c-.48 0-.86.36-.86.8v6.4c0 .44.38.8.86.8"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11.14 5H6.86c-.48 0-.86.36-.86.8v6.4c0 .44.38.8.86.8h4.28c.48 0 .86-.36.86-.8V5.8c0-.44-.38-.8-.86-.8z"
    />
  </svg>
</template>

<script>
export default {
  name: 'CasesIcon',
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
