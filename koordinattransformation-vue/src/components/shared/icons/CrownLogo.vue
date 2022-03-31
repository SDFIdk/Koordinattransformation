<template>
  <svg
    viewBox="0 0 24 24"
  >
    <circle
      :fill="background"
      cx="12"
      cy="12"
      r="12"
    />
    <path
      :stroke="color"
      :stroke-width="strokeWidth * 1.66666666667"
      stroke-linecap="round"
      d="M12 14.5V9m0 0c.32-.42 1.5-1.5 3-1.5s2 1 2 2.25c0 1.5-1.08 3-2.5 4.75M12 9a4.18 4.18 0 00-3-1.5c-1.5 0-2 1-2 2.25 0 1.5 1.08 3 2.5 4.75M7 16h10M7 17h10M7 18h10M12 3.36v.82m0 1.64v.82m0 0a.95.95 0 100 1.9.95.95 0 000-1.9zM13.64 5h-.82m-1.64 0h-.82M17 9.5c1.32 0 2 .57 2 1.5s-.8 2.27-2 3.5m-10-5c-1.32 0-2 .57-2 1.5s.8 2.27 2 3.5"
    />
  </svg>
</template>

<script>
export default {
  name: 'CrownLogo',
  props: {
    color: {
      type: String
    },
    strokeWidth: {
      type: [Number, String]
    },
    background: {
      type: String,
      default: '#FFF'
    }
  }
}
</script>
