<template>
  <Transition name="close">
    <section v-show="!menuClosed" class="container">
      <article class="coordinate-transformation-box" ref="mother">
        <InputCoordinates class="input"
          @input-epsg-changed="inputEPSGChanged"
          @error-occurred="errorOccurred"
          @input-coords-changed="inputCoordsChanged"
          @is-3d-changed="is3DChanged"
        />
        <OutputCoordinates class="output"
          :inputEPSG=inputEPSG
          :inputCoords=inputCoords
          @error-occurred="errorOccurred"
          @coordinates-copied="coordinatesCopied"
          :is3D=is3D
        />
        <menu-closer class="menu-closer" @handle-close="this.menuClosed = true"/>
      </article>
      <div v-show="popupVisible" class="message">Koordinater kopieret</div>
      <div v-show="mapErrorVisible" class="message">{{ mapError }}</div>
      <div v-show="errorVisible" class="message">{{ error }}</div>
    </section>
  </Transition>
  <Transition name="open">
    <menu-closer class="menu-closed" v-show="this.menuClosed" @handle-close="this.menuClosed = false" />
  </Transition>
</template>

<script>
/**
 * CoordinateTransformation er forældre til input- og outputkomponenterne samt barn til Map-komponentet.
 * Den er bindeled og står for koordinering mellem de tre komponenter:
 * Når brugeren klikker på kortet i Map, skal både Input og Output vide det.
 * Og når en EPSG-koden eller koordinatsættet ændres i Input, skal Output vide dette for at
 * Komponentet står også for at vise fejlmeddelelser, men (på trods af navnet) ikke for nogen af transformationerne
 */
import { defineAsyncComponent, ref, inject } from 'vue'

export default {
  name: 'CoordinateTransformation',
  components: {
    InputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/InputCoordinates')),
    OutputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/OutputCoordinates')),
    MenuCloser: defineAsyncComponent(() => import('@/components/coordinatetransformation/MenuCloser'))
  },
  props: {
    mapError: {
      type: String,
      default () {
        return ''
      }
    },
    mapErrorVisible: {
      type: Boolean,
      default () {
        return false
      }
    }
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
    is3DChanged (state) {
      this.is3D = state
    },
    errorOccurred (state, err) {
      this.error = err
      this.errorVisible = state
    },
    coordinatesCopied (state) {
      this.popupVisible = state
    },
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
    }
  },
  setup () {
    const inputCoords = ref(inject('inputCoords'))
    const is3D = ref(true)
    const colors = inject('themeColors')
    const inputEPSG = inject('inputEPSG')
    const popupVisible = ref(false)
    const menuClosed = ref(false)
    const window = ref({ width: 0, height: 0 })
    const errorVisible = ref('')
    const error = ref('')
    return {
      inputCoords,
      colors,
      inputEPSG,
      popupVisible,
      menuClosed,
      window,
      error,
      errorVisible,
      is3D
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
}
</script>

<style scoped>
.close-enter-active,
.close-leave-active {
  transition: all 1s ease-in-out;
}
.close-enter-from,
.close-leave-to {
  transform: translateY(-50vh);
}
.open-enter-active {
  transition: all 1s step-end;
}
.open-leave-active {
  transition: all 1s step-start;
}
.open-enter-from,
.open-leave-to {
  opacity: 0;
}
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
