<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 4h8c.6 0 1 .5 1 1v6c0 .6-.4 1-1 1H4a1 1 0 01-1-1V5c0-.5.5-1 1-1z"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13 5L8 9 3 5"
    />
  </svg>
</template>

<script>
export default {
  name: 'MailIcon',
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
