<template>
  <svg
    width="50" height="50" viewBox="0 0 92 118" fill="none"
  >
    <g
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <mask id="path-1-inside-1_9981_1012" fill="white">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M46 118C46 118 91.0647 75.8993 91.0647 45.8562C91.0647 20.9676 70.8885 0.791504 46 0.791504C21.1115 0.791504 0.935326 20.9676 0.935326 45.8562C0.935326 75.8993 46 118 46 118ZM46 68.3884C58.4443 68.3884 68.5323 58.3004 68.5323 45.8561C68.5323 33.4118 58.4443 23.3238 46 23.3238C33.5557 23.3238 23.4677 33.4118 23.4677 45.8561C23.4677 58.3004 33.5557 68.3884 46 68.3884Z"/>
      </mask>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M46 118C46 118 91.0647 75.8993 91.0647 45.8562C91.0647 20.9676 70.8885 0.791504 46 0.791504C21.1115 0.791504 0.935326 20.9676 0.935326 45.8562C0.935326 75.8993 46 118 46 118ZM46 68.3884C58.4443 68.3884 68.5323 58.3004 68.5323 45.8561C68.5323 33.4118 58.4443 23.3238 46 23.3238C33.5557 23.3238 23.4677 33.4118 23.4677 45.8561C23.4677 58.3004 33.5557 68.3884 46 68.3884Z"
        fill="#3EDDC6" fill-opacity=".8"/>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'MapIcon',
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
