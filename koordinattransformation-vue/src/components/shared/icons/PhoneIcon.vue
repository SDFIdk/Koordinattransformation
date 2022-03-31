<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth * 2"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M13 10.49v1.5a1 1 0 01-1.1 1 9.96 9.96 0 01-7.35-4.55A9.92 9.92 0 013 4.1 1 1 0 014 3h1.51a1 1 0 011 .86c.07.48.19.96.36 1.41a1 1 0 01-.23 1.06l-.63.64a8.04 8.04 0 003.01 3.01l.64-.64a1 1 0 011.06-.22c.46.17.93.28 1.41.35a1 1 0 01.87 1.02z"
    />
  </svg>
</template>

<script>
export default {
  name: 'PhoneIcon',
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
