<template>
  <svg
    viewBox="0 0 40 8"
  >
    <ellipse
      cx="3.99983"
      cy="4"
      rx="4"
      ry="4"
      :fill="color"/>
    <ellipse
      cx="19.9981"
      cy="4"
      rx="4"
      ry="4"
      :fill="color"/>
    <ellipse
      cx="36.0002"
      cy="4"
      rx="4"
      ry="4"
      :fill="color"/>
  </svg>
</template>

<script>
export default {
  name: 'ReadMoreIcon',
  props: {
    color: {
      type: String
    }
  }
}
</script>
