<template>
  <section v-show="!menuClosed || window.width > 703" class="container">
    <article class="coordinate-transformation-box" ref="mother">
      <InputCoordinates class="input" @input-epsg-changed="inputEPSGChanged"  @input-coords-changed="inputCoordsChanged"/>
      <OutputCoordinates class="output" :inputEPSG=inputEPSG :inputCoords=inputCoords @coordinates-copied="coordinatesCopied"/>
      <menu-closer @handle-close="closeMenu" class="menu-closer"/>
    </article>
    <div v-if="popupVisible" class="message">Koordinater kopieret</div>
  </section>
  <menu-closer v-show="menuClosed && window.width < 703" @handle-close="closeMenu" class="menu-closed"/>
</template>

<script>
import { defineAsyncComponent, ref, inject } from 'vue'

export default {
  name: 'CoordinateTransformation',
  components: {
    InputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/InputCoordinates')),
    OutputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/OutputCoordinates')),
    MenuCloser: defineAsyncComponent(() => import('@/components/coordinatetransformation/MenuCloser'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.inputEPSG = code.srid
      this.$emit('input-epsg-changed', code.srid)
    },
    inputCoordsChanged (coords) {
      this.inputCoords = coords
      this.$emit('input-coords-changed', coords)
    },
    coordinatesCopied (state) {
      this.popupVisible = state
    },
    closeMenu () {
      this.menuClosed = !this.menuClosed
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  },
  setup () {
    const inputCoords = ref(['0', '0'])
    const colors = inject('themeColors')
    // const window = inject('window')
    const inputEPSG = inject('inputEPSG')
    const popupVisible = ref(false)
    const menuClosed = ref(false)
    const window = ref({ width: 0, height: 0 })
    return {
      inputCoords,
      colors,
      inputEPSG,
      popupVisible,
      menuClosed,
      window
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
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
  padding: 1rem 1.5rem;
  border-bottom: var(--action) solid 2px;
  border-right: none;
}
.output {
  border-radius: 0 0 0 0;
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
.menu-closer {
  border-radius: 0 0 25px 25px;
}
.menu-closed {
  border-radius: 25px;
  border: 2px solid var(-darkSteel);
  outline: 4px solid rgba(191, 223, 227, 0.7);
}
@media screen and (min-width: 44rem) {
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
  .menu-closer {
    display: none;
  }
}

@media screen and (max-width: 703px) {
  .output {
    border-radius: 0 0 0 0;
  }
}
</style>
