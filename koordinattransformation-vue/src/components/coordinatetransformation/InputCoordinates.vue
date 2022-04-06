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
    <CoordinateSelection @epsg-changed="inputChanged"/>
    <article class="chosen-coordinates">
      <span>
        <Icon
          icon="ExpandIcon"
          :width="2"
          :height="2"
          :color="colors.black"
        />
        <input
          class="input-coordinates"
          v-model="inputCoords[0]"
          type="number"
          step="any"
        />
        <div class="degrees">°</div>
      </span>
      <span>
        <Icon
          icon="ExpandIcon"
          :width="2"
          :height="2"
          :color="colors.black"
          class="arrow-icon-y-coordinate"
        />
        <input
          class="input-coordinates"
          v-model="inputCoords[1]"
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
import { defineAsyncComponent, ref, inject } from 'vue'

export default {
  name: 'InputCoordinates',
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    inputChanged (code) {
      this.$emit('input-changed', code)
    }
  },
  setup () {
    const inputCoords = ref('')
    const colors = inject('themeColors')
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
span {
  display: inline-flex;
  align-items: flex-end;
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
}
.input-coordinates {
  border: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
.arrow-icon-y-coordinate {
  transform: rotate(-90deg);
}
.degrees {
  padding-right: 1rem;
}
</style>
