<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path d="M15 3.5V6.5M9 3.5V6.5M5 10V17.4444C5 18.3036 5.69645 19 6.55556 19H17.4444C18.3036 19 19 18.3036 19 17.4444V10M5 10V6.55556C5 5.69645 5.69645 5 6.55556 5H17.4444C18.3036 5 19 5.69645 19 6.55556V10M5 10H19"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: 'CheckBoxIcon',
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
