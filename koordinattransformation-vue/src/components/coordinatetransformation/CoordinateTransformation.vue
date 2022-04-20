<template>
  <section class="container">
    <article class="coordinate-transformation-box" ref="mother">
      <InputCoordinates class="input" @input-epsg-changed="inputEPSGChanged"  @input-coords-changed="inputCoordsChanged"/>
      <OutputCoordinates class="output" :inputEPSG=inputEPSG :inputCoords=inputCoords @coordinates-copied="coordinatesCopied"/>
    </article>
  <div v-if="popupVisible" class="message">Koordinater kopieret</div>
  </section>
</template>

<script>
import { defineAsyncComponent, ref, inject } from 'vue'
import { isMobile } from 'mobile-device-detect'

export default {
  name: 'CoordinateTransformation',
  components: {
    InputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/InputCoordinates')),
    OutputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/OutputCoordinates'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.inputEPSG = code
    },
    inputCoordsChanged (coords) {
      this.inputCoords = coords
    },
    coordinatesCopied (state) {
      this.popupVisible = state
    }
  },
  setup () {
    const inputCoords = ref([0, 0])
    const colors = inject('themeColors')
    const inputEPSG = ref(Object)
    const popupVisible = ref(false)
    return {
      inputCoords,
      colors,
      isMobile,
      inputEPSG,
      popupVisible
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.coordinate-transformation-box {
  display: grid;
  width: 100%;
  border: 2px solid var(-darkSteel);
  outline: 4px solid rgba(191, 223, 227, 0.7);
  border-radius: 25px;
  overflow: visible;
  z-index: 1;
}
.message {
  align-self: center;
  text-align: center;
  margin: 1rem 0 0 0;
  padding: 1rem;
  background: var(--lightSteel);
  border-radius: 18px;
}
.input {
  border-radius: 25px 25px 0 0;
  position: relative;
  background: var(--white);
  padding: 1rem 3rem 1rem 3rem;
  border-bottom: var(--action) solid 2px;
  border-right: none;
}
.output {
  border-radius: 0 0 25px 25px;
  border-top: none;
}
.input:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  border-style: solid;
  border-width: 14px 10px 0;
  border-color: var(--white) transparent;
  display: block;
  width: 0;
  z-index: 3;
  transform: translateY(100%);
}
.input:before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  border-style: solid;
  border-width: 18px 13px 0;
  border-color: var(--action) transparent;
  display: block;
  width: 0;
  z-index: 2;
  transform: translateY(100%) translateX(-3px);
}
@media screen and (min-width: 37.5rem) {
  .coordinate-transformation-box {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "input output"
  }
  .input {
    border-radius: 25px 0 0 25px;
    border-right: var(--action) solid 2px;
    border-bottom: none;
  }
  .input:after {
    content: "";
    position: absolute;
    bottom: 50%;
    left: 100%;
    border-style: solid;
    border-width: 10px 0 10px 14px;
    border-color: transparent var(--white);
    display: block;
    width: 0;
    z-index: 3;
    transform: translateY(50%);
  }
  .input:before {
    content: "";
    position: absolute;
    bottom: 50%;
    left: 100%;
    border-style: solid;
    border-width: 12px 0 12px 17px;
    border-color: transparent var(--action);
    display: block;
    width: 0;
    z-index: 2;
    transform: translateY(50%);
  }
  .output {
    border-radius: 0 25px 25px 0;
  }
}
</style>
