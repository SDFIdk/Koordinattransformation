<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      d="M7 10h10M7 14h10"
    />
    <rect
      :stroke="color"
      :stroke-width="strokeWidth"
      width="10"
      height="12"
      x="7"
      y="6"
      rx="1.5"
    />
    <circle
      :fill="color"
      :r="strokeWidth"
      cx="9"
      cy="12"
    />
    <circle
      :fill="color"
      :r="strokeWidth"
      cx="9"
      cy="8"
    />
    <circle
      :fill="color"
      :r="strokeWidth"
      cx="9"
      cy="16"
    />
  </svg>
</template>

<script>
export default {
  name: 'DataIcon',
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
