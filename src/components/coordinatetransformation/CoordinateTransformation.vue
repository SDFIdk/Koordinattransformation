<template>
  <Transition name="close">
    <section v-show="!menuClosed || window.width > 704" class="container">
      <article class="coordinate-transformation-box" ref="mother">
        <InputCard class="input"
          @input-epsg-changed="inputEPSGChanged"
          @error-occurred="errorOccurred"
          @input-coords-changed="inputCoordsChanged"
          @is-3d-changed="isInput3DChanged"
        />
        <OutputCard class="output"
          :inputEPSG=inputEPSG
          :inputCoords=inputCoords
          @error-occurred="errorOccurred"
          @coordinates-copied="coordinatesCopied"
          :inputIs3D=inputIs3D
        />
        <menu-closer class="menu-closer" @handle-close="this.menuClosed = true"/>
      </article>
      <div v-show="popupVisible" class="message">Koordinater kopieret</div>
      <div v-show="mapErrorIsVisible" class="message">{{ mapError }}</div>
      <div v-show="errorVisible" class="message">{{ error }}</div>
    </section>
  </Transition>
  <Transition name="open">
    <menu-closer class="menu-closed" v-show="this.menuClosed && window.width < 704" @handle-close="this.menuClosed = false" />
  </Transition>
</template>

<script setup>
/**
 * CoordinateTransformation er forældre til input- og outputkomponenterne samt barn til Map-komponentet.
 * Den er bindeled og står for koordinering mellem de tre komponenter:
 * Når brugeren klikker på kortet i Map, skal både Input og Output vide det.
 * Og når en EPSG-koden eller koordinatsættet ændres i Input, skal Output vide dette for at
 * Komponentet står også for at vise fejlmeddelelser, men (på trods af navnet) ikke for nogen af transformationerne
 */
import { ref, inject } from 'vue'
import InputCard from '@/components/coordinatetransformation/InputCard.vue'
import OutputCard from '@/components/coordinatetransformation/OutputCard.vue'
import MenuCloser from '@/components/coordinatetransformation/MenuCloser.vue'

const inputCoords = ref(inject('inputCoords'))
const inputIs3D = ref(true)
const inputEPSG = ref(inject('inputEPSG'))
const popupVisible = ref(false)
const menuClosed = ref(false)
const window = ref({ width: 0, height: 0 })
const errorVisible = ref('')
const error = ref('')

const props = defineProps({
    mapError: {
        type: String,
            default () { return '' }
    },
    mapErrorIsVisible: {
        type: Boolean,
        default () { return false }
    }
})

const emit = defineEmits([
    'input-epsg-changed',
    'input-coords-changed'
])

const inputEPSGChanged = (code) => {
    inputEPSG.value = code.srid
    emit('input-epsg-changed', code.srid)
}

/**
 * emits an event input-coord-changed
 * run when the input coordinates in the input card is changed
 * e.g. when choosing EPSG, when clicking map, when changed manually, when entering address
 * @param coords
 */
const inputCoordsChanged = (coords) => {
    inputCoords.value = coords
    emit('input-coords-changed', coords)
}

const isInput3DChanged = (state) => {
    inputIs3D.value = state
}

const errorOccurred = (state, err) => {
    error.value = err
    errorVisible.value = state
}

const coordinatesCopied = (state) => {
    popupVisible.value = state
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
  border-radius: 25px;
  box-shadow: 0 0 0 4px rgba(191,223,227,0.7);
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
  box-shadow: 0 0 0 4px rgba(191,223,227,0.7);
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
