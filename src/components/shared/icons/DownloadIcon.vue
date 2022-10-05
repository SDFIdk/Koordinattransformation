<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M7 11l5 5 5-5M12 6v10"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18h12"
    />
  </svg>
</template>

<script>
export default {
  name: 'DownloadIcon',
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
