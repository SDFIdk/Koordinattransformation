<template>
  <svg viewBox="0 0 80 80">
    <path d="M34.0004 6.00002C34.0004 9.31374 36.6867 12 40.0004 12C43.3141 12 46.0004 9.31374 46.0004 6.00002C46.0004 2.6863 43.3141 -1.17422e-07 40.0004 -2.62268e-07C36.6867 -4.07115e-07 34.0004 2.6863 34.0004 6.00002Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0s"/>
    </path>
    <path d="M58 16C58 19.3137 60.6863 22 64 22C67.3137 22 70 19.3137 70 16C70 12.6863 67.3137 10 64 10C60.6863 10 58 12.6863 58 16Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.0625s"/>
    </path>
    <path d="M68 39.9998C68 43.3135 70.6863 45.9998 74 45.9998C77.3137 45.9998 80 43.3135 80 39.9998C80 36.6861 77.3137 33.9998 74 33.9998C70.6863 33.9998 68 36.6861 68 39.9998Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.125s"/>
    </path>
    <path d="M58 64C58 67.3137 60.6863 70 64 70C67.3137 70 70 67.3137 70 64C70 60.6863 67.3137 58 64 58C60.6863 58 58 60.6863 58 64Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.1875s"/>
    </path>
    <path d="M34.0004 74C34.0004 77.3137 36.6867 80 40.0004 80C43.3141 80 46.0004 77.3137 46.0004 74C46.0004 70.6863 43.3141 68 40.0004 68C36.6867 68 34.0004 70.6863 34.0004 74Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.25s"/>
    </path>
    <path d="M10.0014 64C10.0014 67.3137 12.6877 70.0001 16.0014 70.0001C19.3151 70.0001 22.0014 67.3137 22.0014 64C22.0014 60.6863 19.3151 58 16.0014 58C12.6877 58 10.0014 60.6863 10.0014 64Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.3125s"/>
    </path>
    <path d="M0.00139592 39.9998C0.00139577 43.3135 2.68769 45.9998 6.0014 45.9998C9.31511 45.9998 12.0014 43.3135 12.0014 39.9998C12.0014 36.6861 9.31511 33.9998 6.0014 33.9998C2.68769 33.9998 0.00139606 36.6861 0.00139592 39.9998Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.375s"/>
    </path>
    <path d="M10.0014 16C10.0014 19.3137 12.6877 22 16.0014 22C19.3151 22 22.0014 19.3137 22.0014 16C22.0014 12.6863 19.3151 10 16.0014 10C12.6877 10 10.0014 12.6863 10.0014 16Z" :fill="color">
      <animate
      attributeName="opacity"
      dur="0.5s"
      values="0.125;1"
      repeatCount="indefinite"
      begin="0.4375s"/>
    </path>
  </svg>
</template>

<script>
export default {
  name: 'LoadingIcon2',
  props: {
    color: {
      type: String
    }
  }
}
</script>
