<template>
  <svg
    viewBox="0 0 24 24"
  >
  <circle
      :stroke="color"
      :stroke-width="strokeWidth"
      cx="12" cy="12" r="7"/>
</svg>

</template>

<script>
export default {
  name: 'RadioIcon',
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
