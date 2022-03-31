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
    d="M13.5 5V9H17.5M15 13H9M15 16H9M10.5 10H9M13.6364 5H7.5C7.10218 5 6.72064 5.1475 6.43934 5.41005C6.15804 5.6726 6 6.0287 6 6.4V17.6C6 17.9713 6.15804 18.3274 6.43934 18.5899C6.72064 18.8525 7.10218 19 7.5 19H16.5C16.8978 19 17.2794 18.8525 17.5607 18.5899C17.842 18.3274 18 17.9713 18 17.6V9L13.6364 5Z"
    />
  </svg>
</template>

<script>
export default {
  name: 'DocumentIcon',
  props: {
    width: {
      type: [Number, String],
      default: 1
    },
    height: {
      type: [Number, String],
      default: 1
    },
    color: {
      type: String,
      default: '#000000'
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
