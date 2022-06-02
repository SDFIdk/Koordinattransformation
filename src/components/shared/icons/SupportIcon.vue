<template>
  <svg
    viewBox="0 0 16 16"
  >
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 11V8.2a4.3 4.3 0 011.17-2.97A3.9 3.9 0 018 4a3.9 3.9 0 012.83 1.23A4.3 4.3 0 0112 8.2V11"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 11.14c0 .23-.1.45-.26.6a.9.9 0 01-.63.26h-.44a.9.9 0 01-.63-.25.84.84 0 01-.26-.6v-1.3c0-.22.1-.44.26-.6a.9.9 0 01.63-.25H12v2.14zm-8 0c0 .23.1.45.26.6.17.17.4.26.63.26h.44a.9.9 0 00.63-.25.84.84 0 00.26-.6v-1.3c0-.22-.1-.44-.26-.6A.9.9 0 005.33 9H4v2.14z"
    />
  </svg>
</template>

<script>
export default {
  name: 'SupportIcon',
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
