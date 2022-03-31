<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      d="M17.4922 5H7.49219C6.66376 5 5.99219 5.67157 5.99219 6.5V17.5C5.99219 18.3284 6.66376 19 7.49219 19H18.4922C19.3206 19 19.9922 18.3284 19.9922 17.5V12"/>
    <!-- <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M20.9922 6L12.9737 15.2315L8.99219 12.0463" /> -->
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
