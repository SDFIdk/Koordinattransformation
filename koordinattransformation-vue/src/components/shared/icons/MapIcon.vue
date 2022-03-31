<template>
  <svg
    viewBox="0 0 16 16"
  >
    <g
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M3.6 5.6V12l2.8-1.6L9.6 12l2.8-1.6V4L9.6 5.6 6.4 4 3.6 5.6zM6.4 4v6.4M9.6 5.6V12"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'MapIcon',
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
