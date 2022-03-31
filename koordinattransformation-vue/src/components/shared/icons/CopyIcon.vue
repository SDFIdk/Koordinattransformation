<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M17.5 9h-7C9.7 9 9 9.7 9 10.5v7c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5v-7c0-.8-.7-1.5-1.5-1.5z"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M7.3 15h-.8A1.5 1.5 0 015 13.5v-7A1.5 1.5 0 016.5 5h7A1.5 1.5 0 0115 6.5v.8"
    />
  </svg>
</template>

<script>
export default {
  name: 'CopyIcon',
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
