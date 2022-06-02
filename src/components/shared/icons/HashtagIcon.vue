<template>
  <svg viewBox="0 0 24 24" >
  <path d="M9 5L9 19" :color="color" :fill="color" :stroke="color" stroke-linecap="round"/>
  <path d="M15 5L15 19" :color="color" :fill="color" :stroke="color" stroke-linecap="round"/>
  <path d="M19 9L5 9" :color="color" :fill="color" :stroke="color" stroke-linecap="round"/>
  <path d="M19 15L5 15" :color="color" :fill="color"
  :stroke="color" stroke-linecap="round"/>
  </svg>
</template>

<script>
export default {
  name: 'HashtagIcon',
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
