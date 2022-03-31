<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6.807 3.845H4.345a.5.5 0 00-.5.5v2.462a.5.5 0 00.5.5h2.462a.5.5 0 00.5-.5V4.345a.5.5 0 00-.5-.5zM6.807 8.693H4.345a.5.5 0 00-.5.5v2.462a.5.5 0 00.5.5h2.462a.5.5 0 00.5-.5V9.193a.5.5 0 00-.5-.5zM11.655 3.845H9.193a.5.5 0 00-.5.5v2.462a.5.5 0 00.5.5h2.462a.5.5 0 00.5-.5V4.345a.5.5 0 00-.5-.5zM11.655 8.693H9.193a.5.5 0 00-.5.5v2.462a.5.5 0 00.5.5h2.462a.5.5 0 00.5-.5V9.193a.5.5 0 00-.5-.5z"
    />
  </svg>
</template>

<script>
export default {
  name: 'AppIcon',
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
