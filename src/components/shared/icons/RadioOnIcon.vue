<template>
  <svg
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="7" :stroke="color" :stroke-width="strokeWidth"/>
    <circle cx="12" cy="12" r="3" :fill="color" :stroke-width="strokeWidth"/>
  </svg>

</template>

<script>
export default {
  name: 'RadioOnIcon',
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
