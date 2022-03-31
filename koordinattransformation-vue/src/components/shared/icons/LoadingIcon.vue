<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15.8 8C15.8 3.7 12.3.2 8 .2"
    >
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 8 8"
        to="360 8 8"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </path>
    <circle
      :stroke="color"
      stroke-opacity=".1"
      :stroke-width="strokeWidth"
      cx="8"
      cy="8"
      r="7.8"
    />
  </svg>
</template>

<script>
export default {
  name: 'LoadingIcon',
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
