<template>
  <section class="input-coordinate">
    <div class="title-bar">
      <h3>Input</h3>
      <Icon v-show="!isMobile"
        icon="InfoIcon"
        :width="1.8"
        :height="1.8"
        :color="colors.black"
        class="info-icon"
      />
    </div>
    <section class="coordinate-selection-wrapper">
      <CoordinateSelection :isOutput="false" @epsg-changed="inputEPSGChanged"/>
    </section>
    <article class="chosen-coordinates">
      <span>
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon-x-coordinate"
        />
        <input
          class="input-coordinates"
          v-model=inputCoords[0]
          type="number"
          step="any"
        />
        <div class="degrees">°</div>
      </span>
      <span>
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :stroke-width="0"
          :color="colors.turquoise"
        />
        <input
          class="input-coordinates"
          v-model=inputCoords[1]
          type="number"
          step="any"
        />
        <div class="degrees">°</div>
      </span>
    </article>
  </section>
</template>

<script>

import { isMobile } from 'mobile-device-detect'
import { defineAsyncComponent, ref, inject, onUpdated } from 'vue'

export default {
  name: 'InputCoordinates',
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.$emit('input-epsg-changed', code)
    }
  },
  setup (props, context) {
    const inputCoords = ref([0, 0])
    const colors = inject('themeColors')
    onUpdated(() => {
      if (inputCoords.value[0] !== '' && inputCoords.value[1] !== '') {
        context.emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1]])
      }
    })
    return {
      inputCoords,
      colors,
      isMobile
    }
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.coordinate-selection-wrapper {
  display: flex;
  align-items: center;
}
.title-bar {
  display: inline-flex;
  align-self: center;
}
input:focus {
  outline: none;
}
.info-icon {
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  margin: 0 0 0 auto;
}
li {
  list-style-type: none;
  padding: 0.5rem 0 0.5rem 0;
  margin: 0;
  border-bottom: var(--action) solid 1px;
}
li:hover {
  background-color: var(--action);
}
ul {
  list-style-type: none;
}
.chosen-coordinates {
  display: flex;
  flex-flow: row wrap;
  align-self: center;
}
.chosen-coordinates span {
  border-bottom: var(--action) solid 1px;
  margin: 0 1rem 0 0;
  flex-grow: 1;
  justify-content: space-between;
  display: inline-flex;
  align-items: flex-end;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  border: none;
  width: 90%;
  align-self: center;
}
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}
.degrees {
  padding: 0 1.5rem 0.5rem 0;
  font-size: 1.25rem;
}
</style>
