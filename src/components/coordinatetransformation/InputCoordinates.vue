<template>
  <section class="input-coordinate">
    <div class="title-bar">
      <h3>Input</h3>
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
    <div class="searchbar">
      <input class="searchbar-input"/>
      <Icon
        icon="SearchIcon"
        class="searchbar-icon"
        :color="colors.turquoise"
        :width="1.8"
        :height="1.8"
        :stroke-width="0.75"
      />
    </div>
  </section>
</template>

<script>

import { defineAsyncComponent, ref, inject, onUpdated, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'InputCoordinates',
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.$emit('input-epsg-changed', code)
      this.store.dispatch('trans/get', this.inputEPSG + '/' + code.srid + '/' + this.inputCoords[0] + ',' + this.inputCoords[1]).then(() => {
        const output = this.store.state.trans.data
        this.inputEPSG = code.srid
        this.inputCoords[0] = output.v1
        this.inputCoords[1] = output.v2
      })
    }
  },
  setup (props, context) {
    // const inputEPSG = ref('')
    const store = useStore()
    const isMobile = true
    const mapMarkerInputCoords = inject('inputCoords')
    const inputEPSG = inject('inputEPSG')
    const inputCoords = ref(mapMarkerInputCoords.value)
    const colors = inject('themeColors')
    watch(mapMarkerInputCoords, () => {
      inputCoords.value = mapMarkerInputCoords.value
    })
    onUpdated(() => {
      if (inputCoords.value[0] !== '' && inputCoords.value[1] !== '') {
        context.emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1]])
      }
    })
    return {
      inputCoords,
      colors,
      isMobile,
      store,
      inputEPSG
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
  margin: 1rem 0;
}
.title-bar {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.5rem;
  width: 100%;
}
input:focus {
  outline: none;
}
.hide {
  margin: 0 0 0 auto;
}
.info-icon {
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  margin: 0 0 0 auto;
  transform: rotate(90deg);
}
li {
  list-style-type: none;
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
  margin: 0 0.5rem 0 0;
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
input {
  -moz-appearance: textfield;
  border: none;
  width: 90%;
  align-self: center;
}
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}
.degrees {
  padding: 0 0.5rem 0.5rem 0;
  font-size: 1.25rem;
}
.searchbar {
  display: inline-flex;
  align-items: center;
  margin-top: 1.25rem;
  width: 100%;
  border: var(--darkSteel) solid 1px;
  border-radius: 16px;
  height: 2rem;
}
.searchbar-input {
  margin: 0 0 0 1rem;
}
.searchbar-icon {
  margin: 0 0.5rem 0 0;
}

@media screen and (max-width: 1144px) {
  .chosen-coordinates > span{
    margin: 0.25rem 0;
  }
}
</style>
