<template>
  <svg
    viewBox="0 0 26 26"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M23 1H17C15.8954 1 15 1.89543 15 3V9C15 10.1046 15.8954 11 17 11H23C24.1046 11 25 10.1046 25 9V3C25 1.89543 24.1046 1 23 1Z"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M23 15H17C15.8954 15 15 15.8954 15 17V23C15 24.1046 15.8954 25 17 25H23C24.1046 25 25 24.1046 25 23V17C25 15.8954 24.1046 15 23 15Z"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 1H3C1.89543 1 1 1.89543 1 3V9C1 10.1046 1.89543 11 3 11H9C10.1046 11 11 10.1046 11 9V3C11 1.89543 10.1046 1 9 1Z"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 15H3C1.89543 15 1 15.8954 1 17V23C1 24.1046 1.89543 25 3 25H9C10.1046 25 11 24.1046 11 23V17C11 15.8954 10.1046 15 9 15Z"
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
