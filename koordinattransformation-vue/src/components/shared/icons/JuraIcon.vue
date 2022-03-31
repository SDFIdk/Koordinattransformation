<template>
  <svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24"
            fill="white"/>
    <path d="M24 16L24 36"
            :stroke="color"/>
    <path d="M35.0588 13.8672L30 24"
            :stroke="color"
            stroke-linecap="round"/>
    <path d="M13.0588 13.8672L8 24"
            :stroke="color"
            stroke-linecap="round"/>
    <path d="M35.0588 13.8672L40 24"
            :stroke="color"
            stroke-linecap="round"/>
    <path d="M13.0588 13.8672L18 24"
            :stroke="color"
            stroke-linecap="round"/>
    <circle cx="24" cy="14" r="2"
            :stroke="color"/>
    <path d="M26 14L35 14"
            :stroke="color"/>
    <path d="M13 14L22 14"
            :stroke="color"/>
    <path d="M40 24C40 26.2091 38.2091 28 36 28L34 28C31.7909 28 30 26.2091 30 24L40 24Z"
            :stroke="color"/>
    <path d="M18 24C18 26.2091 16.2091 28 14 28L12 28C9.79086 28 8 26.2091 8 24L18 24Z"
            :stroke="color"/>
    <path d="M14 36H34"
            :stroke="color"/>
  </svg>
</template>

<script>
export default {
  name: 'CookieBiteIcon',
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
