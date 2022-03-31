<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      stroke-linecap="square"
      d="M6 7.5L6 16.5"
    />
    <path
      :stroke="color"
      stroke-linecap="square"
      d="M18 7.5L18 16.5"
    />
    <path
      :stroke="color"
      stroke-linecap="square"
      d="M16.5 6L7.5 6"
    />
    <path
      :stroke="color"
      stroke-linecap="square"
      d="M16.5 18L7.5 18"
    />
    <rect
      :stroke="color"
      x="5"
      y="5"
      width="2"
      height="2"
    />
    <rect
      :stroke="color"
      x="5"
      y="17"
      width="2"
      height="2"
    />
    <rect
      :stroke="color"
      x="17"
      y="5"
      width="2"
      height="2"
    />
    <rect
      :stroke="color"
      x="17"
      y="17"
      width="2"
      height="2"
    />
  </svg>
</template>

<script>
export default {
  name: 'InboxIcon',
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
