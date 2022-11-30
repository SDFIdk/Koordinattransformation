<template>
  <aside
    :style="{'--background-color': currentbackgroundColor}"
    class="tooltip"
    ref="tooltip"
    role="tooltip"
    :class="{ hidden: !getVisibility }"
  >
    <div
      class="arrow"
      v-if="getArrowPlacement !== ''"
      ref="tooltipArrow"
      data-popper-arrow
      :data-arrow-placement="getArrowPlacement"
    />
    <slot
      class="tooltip-content"
    />
  </aside>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  name: 'TooltipComponent',
  props: {
    placement: { type: String, default: 'top' },
    arrow: { type: String, default: '' },
    mother: { type: HTMLElement, default () { return document.body } },
    isVisible: { type: Boolean, default: false },
    backgroundColor: { type: String }
  },
  data () {
    return {
      popup: null,
      currentbackgroundColor: ''
    }
  },
  computed: {
    getElement () {
      return this.$refs.tooltip
    },
    getPlacement () {
      return this.placement
    },
    getArrow () {
      return this.$refs.tooltipArrow
    },
    getArrowPlacement () {
      return this.arrow
    },
    getMother () {
      return this.mother
    },
    getVisibility () {
      return this.isVisible
    }
  },
  created () {
    const self = this
    self.currentbackgroundColor = self.backgroundColor ?? self.$themeColors.darkTurquoise2
  },
  mounted () {
    const self = this
    self.$nextTick(() => {
      self.popup = createPopper(self.getMother, self.getElement, {
        placement: self.getPlacement,
        modifiers: [
          {
            name: 'arrow',
            enabled: true,
            phase: 'main',
            options: {
              element: self.getArrow,
              padding: 0 // 0px from the edges of the popper
            }
          },
          {
            name: 'computeStyles',
            enabled: true,
            options: {
              gpuAcceleration: true, // true by default
              adaptive: true // true by default
            }
          },
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: ({ placement, reference, popper }) => {
                // const arrowsize = self.getArrow.offsetWidth
                // return (placement[1] === 'o') ? [0, (reference.height / 2) + arrowsize] : [0, (reference.width / 2)]
                return [0, (reference.height / 2)]
                // return [(popper.width - 0), ((1.5 + 3.5) * parseFloat(getComputedStyle(document.documentElement).fontSize))]
                /*
                if (placement === 'bottom') {
                  return [0, popper.height / 2]
                } else {
                  return [0, 70]
                }
               */
              }
            }
          },
          {
            name: 'flip',
            enabled: true,
            options: {
              fallbackPlacements: ['top', 'bottom'],
              // padding: { top: 8, right: 16 },
              // boundary: element, // 'clippingParents' by default
              rootBoundary: 'viewport', // 'viewport' by default
              altBoundary: true, // false by default
              flipVariations: true, // true by default
              allowedAutoPlacements: ['top', 'bottom', 'top-start', 'bottom-start', 'top-end', 'bottom-end'] // by default, all the placements are allowed
            }
          },
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              mainAxis: false, // true by default
              altAxis: false, // false by default
              // padding: { top: 8, right: 16 },
              // boundary: element, // 'clippingParents' by default
              altBoundary: true, // false by default
              rootBoundary: 'viewport', // 'viewport' by default
              tether: true // true by default
              // tetherOffset: ({ popper, reference, placement }) => popper.width / 2
            }
          }
        ]
      })
    })
  }
}
</script>

<style lang="stylus" scoped>
aside
  box-sizing border-box
  filter drop-shadow(0 4px 4px var(--lightGrey))
  border-radius 1rem
  background var(--background-color)
aside.hidden,
aside[data-popper-reference-hidden],
aside[data-popper-escaped]
  visibility hidden
  pointer-events none

div.arrow
  width 0.5rem
  height 0.5rem
  background-color var(--background-color)
  transform-origin 100% 100%

div::before,
div::after
  content ''
  position absolute
  background-color inherit
  width 100%
  height 100%
  border-top-right-radius 30%
div::before
  transform rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%)
div::after
  transform rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%)

div[data-arrow-placement^="top"]
  top calc(-0.5rem)
  transform rotate(60deg) skewX(-30deg) scale(1, 0.866) !important

div[data-arrow-placement^="bottom"]
  transform rotate(-120deg) skewX(-30deg) scale(1, 0.866) !important

div[data-arrow-placement="top"],
div[data-arrow-placement="bottom"]
  left calc(50% - 1rem) !important
  bottom 0
div[data-arrow-placement="top-end"],
div[data-arrow-placement="bottom-end"]
  left calc(100% - (2 * 1rem) - 1rem) !important
  bottom 0
div[data-arrow-placement="top-start"],
div[data-arrow-placement="bottom-start"]
  left calc(1rem + 1rem) !important
  bottom 0
</style>
