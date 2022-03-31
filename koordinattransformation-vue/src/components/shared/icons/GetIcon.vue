<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width * rootFontSize"
    :height="height * rootFontSize"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M7 12l5 5 5-5M12 7v10"
    />
  </svg>
</template>

<script>
export default {
  name: 'GetIcon',
  props: {
    width: {
      type: [Number, String],
      default: 1.5
    },
    height: {
      type: [Number, String],
      default: 1.5
    },
    color: {
      type: String,
      default: '#000'
    },
    strokeWidth: {
      type: [Number, String],
      default: 0.3
    }
  },
  computed: {
    rootFontSize () {
      return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    }
  }
}
</script>

<style lang="stylus" scoped>
*
  transition all 200ms ease
</style>
