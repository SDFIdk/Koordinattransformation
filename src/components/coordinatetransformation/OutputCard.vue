<template>
  <section class="output-coordinate">
    <h3>Output</h3>
    <section class="coordinate-selection-wrapper">
      <select :class="{ isSelected: this.epsgSelected }" id='epsg-output-select' @change="onEpsgSelect">
        <option value="0" disabled selected>Vælg Koordinatsystem</option>
        <option v-for="(code, index) in filteredOutputCodes" :key="index" :value='code' >
            {{ code.title_short }} ({{ code.srid }})
        </option>
      </select>
    </section>
    <OutputField :output1="output1" :output2="output2" :output3="output3" :class="{hasTransformed: hasTransformed}" />
    <article class="footer" :class="{isMeters: isMeters}">
      <div class="radio-and-info-group" v-show="!isMeters">
        <div class="radiogroup" :class="{radioGroupDisabled: isMeters}">
          <label class="radio" @click="checkDegrees">
            <input type="radio" name="date-format">
            <Icon v-show="degreesChecked"
              icon="RadioOnIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.turquoise"
            />
            <Icon v-show="!degreesChecked"
              icon="RadioIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.darkSteel"
            />
            DD
          </label>
          <label class="radio" @click="checkMinutes">
            <input type="radio" name="date-format">
            <Icon v-show="minutesChecked"
              icon="RadioOnIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.turquoise"
            />
            <Icon v-show="!minutesChecked"
              icon="RadioIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.darkSteel"
            />
            min.
          </label>
          <label class="radio" @click="checkSeconds">
            <input type="radio" name="date-format">
            <Icon v-show="secondsChecked"
              icon="RadioOnIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.turquoise"
            />
            <Icon  v-show="!secondsChecked"
              icon="RadioIcon"
              :width="1.3"
              :height="1.3"
              :strokeWidth="1"
              :color="colors.darkSteel"
            />
          min. sek.
          </label>
        </div>
        <Icon
          icon="InfoIcon"
          :width="1.3"
          :height="1.3"
          :color="colors.black"
          class="info-icon"
          @mouseenter="hover = true"
          @mouseleave="hover = false"
        />
        <div class="info-text-container">
          <Transition>
            <p class="info-text" v-if="hover">Repræsentation af geografiske koordinater, vælg mellem decimalgrader, grader og decimalminutter eller grader, minutter og sekunder.</p>
          </Transition>
        </div>
      </div>
      <button class="copy-btn" @click="copyCoordinates" :class="{hasTransformed: hasTransformed && !this.isLoading}">
        Kopiér
        <Icon v-show="!hasTransformed || isLoading"
          icon="CopyIcon"
          :width="1.5"
          :height="1.5"
          :color="colors.darkSteel"
          :strokeWidth="1"
          class="copy-icon"
        />
        <Icon v-show="hasTransformed && !isLoading"
          icon="CopyIcon"
          :width="1.5"
          :height="1.5"
          :color="colors.white"
          :strokeWidth="1"
          class="copy-icon"
        />
      </button>
    </article>
  </section>
</template>

<script setup>
/**
 * Ouput foretager den reelle transformation - den er vi er interesseret i
 */
import { defineAsyncComponent, watch, defineProps, defineEmits, inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Formatter from './Formatting'
import Transformer from './Transformer'

const OutputField = defineAsyncComponent(() => import('@/components/coordinatetransformation/OutputField'))
const store = useStore()
const colors = inject('themeColors')
const outputEPSG = ref('')
const transformer = new Transformer()

const degreesChecked = ref(false)
const minutesChecked = ref(false)
const secondsChecked = ref(false)

const inputDegrees = ref([0, 0])
const inputMinutes = ref([0, 0])
const inputSeconds = ref([0, 0])
const epsgSelected = ref(false)
const outputCoords = ref([0, 0, 0])

// the fields in the outputField component
const output1 = ref('')
const output2 = ref('')
const output3 = ref('')
const hasTransformed = ref(false)
const isLoading = ref(false)
const isMeters = ref(true)
const hover = ref(false)
const crs = ref([])
// const EpsgCodes = ref([])
const filteredOutputCodes = ref([])
const route = useRoute()

const props = defineProps({
  inputEPSG: {
    type: String,
    default () { return '' }
  },

  is3D: {
    type: Boolean, default () { return true }
  },

  inputCoords: {
    type: Array, default () { return inject('mapMarkerInputCoords').value }
  }
})

const emit = defineEmits([
  'coordinates-copied',
  'error-occurred'
])

/** watch for changes in inputCoords, minutesChecked, secondsChecked, degreesChecked  */
watch(() => props.inputCoords, () => {
  if (epsgSelected.value) {
    if (!hasTransformed.value) {
      const result = transformer.transform(props.inputEPSG, props.inputCoords, outputEPSG.value, props.is3D)
      updateOutputField(Formatter.formatCoordinates(result, isMeters.value, degreesChecked.value, minutesChecked.value, secondsChecked.value, props.is3D))
    }
  }
})
watch(() => minutesChecked.value, () => {
  updateOutputField(Formatter.formatCoordinates(outputCoords.value, isMeters.value, degreesChecked.value, minutesChecked.value, secondsChecked.value, props.is3D))
})
watch(() => secondsChecked.value, () => {
  updateOutputField(Formatter.formatCoordinates(outputCoords.value, isMeters.value, degreesChecked.value, minutesChecked.value, secondsChecked.value, props.is3D))
})
watch(() => degreesChecked.value, () => {
  updateOutputField(Formatter.formatCoordinates(outputCoords.value, isMeters.value, degreesChecked.value, minutesChecked.value, secondsChecked.value, props.is3D))
})

// En output-EPSG er valgt: Der skal foretages transformation,
// og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
const onEpsgSelect = async (event) => {
  epsgSelected.value = true

  const code = event.target.selectedOptions[0]._value
  outputEPSG.value = code.srid

  if (code.v1_unit === 'metre') {
    isMeters.value = true
    // TODO: this should hide the radio buttons entirely
    disableRadioButtons()
  } else {
    isMeters.value = false
    degreesChecked.value = true
  }
  const result = await transformer.transform(props.inputEPSG, props.inputCoords, outputEPSG.value, props.is3D)
  hasTransformed.value = true
  updateOutputField(result)
}

const disableRadioButtons = () => {
  degreesChecked.value = false
  minutesChecked.value = false
  secondsChecked.value = false
}

const checkDegrees = () => {
  if (!degreesChecked.value) {
    degreesChecked.value = true
    minutesChecked.value = false
    secondsChecked.value = false
    setTransformInput()
  }
}

const checkMinutes = () => {
  if (!minutesChecked.value) {
    degreesChecked.value = false
    minutesChecked.value = true
    secondsChecked.value = false
    setTransformInput()
  }
}

const checkSeconds = () => {
  if (!secondsChecked.value) {
    degreesChecked.value = false
    minutesChecked.value = false
    secondsChecked.value = true
    setTransformInput()
  }
}

const setInputDegrees = () => {
  const deg0 = parseFloat(props.inputCoords[0]).toFixed(4)
  const deg1 = parseFloat(props.inputCoords[1]).toFixed(4)

  inputDegrees.value[0] = deg0
  inputDegrees.value[1] = deg1
}

const setInputMinutes = () => {
  const deg0 = Math.floor(props.inputCoords.value[0])
  const deg1 = Math.floor(props.inputCoords.value[1])

  const min0 = parseFloat(((props.inputCoords.value[0] - deg0) * 60).toFixed(4))
  const min1 = parseFloat(((props.inputCoords.value[1] - deg1) * 60).toFixed(4))

  inputDegrees.value[0] = deg0
  inputDegrees.value[1] = deg1
  inputMinutes.value[0] = min0
  inputMinutes.value[1] = min1
}

const setInputSeconds = () => {
  const deg0 = Math.floor(props.inputCoords.value[0])
  const deg1 = Math.floor(props.inputCoords.value[1])

  const min0 = Math.floor((props.inputCoords.value[0] - deg0) * 60)
  const min1 = Math.floor((props.inputCoords.value[1] - deg1) * 60)

  const sec0 = parseFloat(((props.inputCoords.value[0] - deg0 - min0 / 60) * 3600).toFixed(4))
  const sec1 = parseFloat(((props.inputCoords.value[1] - deg1 - min1 / 60) * 3600).toFixed(4))

  inputDegrees.value[0] = deg0
  inputDegrees.value[1] = deg1
  inputMinutes.value[0] = min0
  inputMinutes.value[1] = min1
  inputSeconds.value[0] = sec0
  inputSeconds.value[1] = sec1
}

const setTransformInput = () => {
  if (degreesChecked.value) {
    setInputDegrees()
  } else if (minutesChecked.value) {
    setInputMinutes()
  } else {
    setInputSeconds()
  }
}

// Mulighed for at kopiere outputtet efter transformation
const copyCoordinates = () => {
  if (epsgSelected.value && !isLoading.value) {
    navigator.clipboard.writeText(output1.value + output2.value + output3.value)

    emit('coordinates-copied', true)

    window.setTimeout(() => {
      emit('coordinates-copied', false)
    }, 3333)
  }
}

// fylder output feltet med de givne koordinater
const updateOutputField = (_coords) => {
  isLoading.value = true // viser et animeret loader ikon.
  setTimeout(() => {
    isLoading.value = false
    const formattedOutput = Formatter.formatCoordinates(_coords, isMeters.value, degreesChecked.value, minutesChecked.value, secondsChecked.value, props.is3D)
    output1.value = formattedOutput[0]
    output2.value = formattedOutput[1]
    output3.value = formattedOutput[2]
  }, 500)
}

const getGreenlandCodes = async () => {
  const tempCodes = []
  for (let i = 0; i < crs.value.GL.length; ++i) {
    await store
      .dispatch('CRSInformation/get', crs.value.GL[i])
      .then(() => {
        tempCodes.push(store.state.CRSInformation.data)
      })
  }
  for (let i = 0; i < crs.value.Global.length; ++i) {
    await store
      .dispatch('CRSInformation/get', crs.value.Global[i])
      .then(() => {
        tempCodes.push(store.state.CRSInformation.data)
      })
  }
  return tempCodes
}

const getDenmarkCodes = async () => {
  const codes = []
  for (let i = 0; i < crs.value.DK.length; ++i) {
    await store
      .dispatch('CRSInformation/get', crs.value.DK[i])
      .then(() => {
        codes.push(store.state.CRSInformation.data)
      })
  }

  for (let i = 0; i < crs.value.Global.length; ++i) {
    await store
      .dispatch('CRSInformation/get', crs.value.Global[i])
      .then(() => {
        codes.push(store.state.CRSInformation.data)
      })
  }
  return codes
}

// fyld dropdown menu med koderne for Danmark eller for Grønland
const updateFilteredCodes = async () => {
  // Der er forskellige lister for Danmark og Grøndland
  if (route.name === 'Denmark' && crs.value.length !== 0) {
    filteredOutputCodes.value = await getDenmarkCodes()
  } else if (route.name === 'Greenland') {
    filteredOutputCodes.value = await getGreenlandCodes()
  }
}

// eslint-disable-next-line no-unused-vars
const error = err => {
  emit('error-occurred', true, err)
  setTimeout(() => {
    emit('error-occurred', false)
  }, 4000)
}

onMounted(() => {
  // clear og opdater de viste koder.
  store.dispatch('CRS/clear')
  store.dispatch('CRS/get', '')
    .then(() => {
      crs.value = store.state.CRS.data
      updateFilteredCodes()
    })
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

option {
  background: white;
  color: black;
}

#epsg-output-select {
  padding-left: 20px;
  width: 100%;
  height: 2.5rem;
  border-radius: 30px;
  border-color: var(--darkSteel);
}

.isSelected {
  background: white;
}

.coordinate-selection-wrapper {
  margin-top: 1.4rem;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.info-icon {
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  background: var(--white);
  margin-left: 0.5rem;
}
.info-text-container {
  position: relative;
  flex-grow: 1;
}
.info-text {
  position: absolute;
  width: 20vw;
  padding: 10px;
  border: 1px solid var(--darkSteel);
  border-radius: 10px;
  background-color: var(--white);
  margin: 0 2rem 0 0.5rem;
}
label {
  display: inline-flex;
}
.output-coordinate {
  padding: 1rem 1.5rem;
  background-color: var(--lightSteel);
}

.copy-btn {
  background-color: var(--lightSteel);
  color: var(--darkSteel);
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  float: right;
  padding: 0.3rem 1rem;
  display: inline-flex;
  align-items: center;
}
.copy-btn.hasTransformed {
  background-color: var(--action);
  color: var(--white);
}
input[type=radio] {
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
}
input[type=radio]:checked {
  outline: var(--darkSteel) solid 1px;
}
.radioGroupDisabled {
  pointer-events: none;
}
.footer {
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
}
.isMeters {
  justify-content: end;
}
.radio-and-info-group {
  display: inline-flex;
  flex-grow: 1;
}
.radiogroup {
  display: inline-flex;
  flex-wrap: nowrap;
}
.copy-icon {
  margin-left: 0.75rem;
}
@media screen and (max-width: 828px) {
  .info-icon {
    display: none;
  }
}
@media screen and (max-width: 703px) {
  .info-icon {
    display: inline;
  }
}
@media screen and (max-width: 410px) {
  .info-icon {
    display: none;
  }
}
</style>
