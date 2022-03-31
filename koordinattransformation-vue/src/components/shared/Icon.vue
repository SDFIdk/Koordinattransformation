<template>
  <div class="icon-border" v-if="borderColor" :style="[borderStyle, borderFillStyle]" >
    <component
      :is="component"
      :color="color"
      :strokeWidth="strokeWidth"
      :width="width * rootFontSize"
      :height="height * rootFontSize"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      :style="{ width: (width * rootFontSize) + 'px', height: height * rootFontSize + 'px' }"
    />
  </div>
  <component v-else
    :is="component"
    :color="color"
    :strokeWidth="strokeWidth"
    :width="width * rootFontSize"
    :height="height * rootFontSize"
    :style="{ width: (width * rootFontSize) + 'px', height: height * rootFontSize + 'px' }"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'IconWrapperComponent',
  props: {
    width: {
      type: [Number, String],
      default: 3
    },
    height: {
      type: [Number, String],
      default: 3
    },
    color: {
      type: String,
      default: '#FFF'
    },
    strokeWidth: {
      type: [Number, String],
      default: 0.3
    },
    icon: {
      type: String,
      default: 'NoIcon'
    },
    borderColor: {
      type: String
    },
    borderFillColor: {
      type: String
    }
  },
  computed: {
    iconName () {
      return this.icon
    },
    rootFontSize () {
      return parseFloat(getComputedStyle(document.documentElement).fontSize) ?? 16
    },
    component () {
      return defineAsyncComponent(() => import('@/components/shared/icons/' + this.icon))
    },
    borderStyle () {
      return {
        'border-radius': (this.width * this.rootFontSize / 2) + 'px',
        'border-style': 'solid',
        'border-width': '1px',
        'border-color': this.borderColor,
        width: (this.width * this.rootFontSize) + 'px',
        height: (this.height * this.rootFontSize) + 'px'
      }
    },
    borderFillStyle () {
      return this.borderFillColor
        ? {
            'background-color': this.borderFillColor
          }
        : {}
    }
  }
}
</script>

<style lang="stylus" scoped>
*
  transition all 200ms ease
  backface-visibility hidden
  perspective none
  perspective-origin center center
  transform translate3d(0, 0, 0)
  text-rendering optimizeLegibility
  -webkit-font-smoothing subpixel-antialiased
  -moz-osx-font-smoothing subpixel-antialiased
</style>
