<template>
  <svg
    viewBox="0 0 24 24"
  >
    <path d="M11.3412 5.01146C12.048 4.38228 12.9793 4 14 4C16.2091 4 18 5.79086 18 8C18 9.48368 17.1919 10.7782 15.9922 11.4688M18 19V18.4208C18 17.7788 17.6313 17.163 16.9749 16.709C16.3185 16.255 15.4283 16 14.5 16H7.5C6.57174 16 5.6815 16.255 5.02513 16.709C4.36875 17.163 4 17.7788 4 18.4208V19M20 17V16.4208C20 15.7788 19.6313 15.163 18.9749 14.709C18.3185 14.255 17.4283 14 16.5 14H15M15 10C15 12.2091 13.2091 14 11 14C8.79086 14 7 12.2091 7 10C7 7.79086 8.79086 6 11 6C13.2091 6 15 7.79086 15 10Z"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: 'UsersIcon',
  props: {
    color: {
      type: String,
      default: '#000000'
    },
    strokeWidth: {
      type: [Number, String],
      default: 1
    }
  }
}
</script>
