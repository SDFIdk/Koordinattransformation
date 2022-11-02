<template>
  <section class="input-coordinate">
    <div class="title-bar">
      <h3>Input</h3>
    </div>
    <section class="coordinate-selection-wrapper">
      <EpsgSelection :isOutput="false" @epsg-changed="inputEPSGChanged"/>
    </section>
    <div class="input">
      <span class="first-input" :class="{isDegreesInput: epsgIsDegrees, isMetresInput: !epsgIsDegrees}">
        <!-- Ombyt ikoner ved decimalgrader -->
        <Icon v-if="epsgIsDegrees"
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon"
        />
        <Icon v-else
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon arrow-icon-x-coordinate"
        />
        <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}">
          <input
            class="coordinates"
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            type="number"
            step="0.0001"
            v-model=degrees[0]
          />
          <span class="unit" v-show="epsgIsDegrees">°N</span>
          <span class="unit" v-show="!epsgIsDegrees">m</span>
        </span>
        <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}" v-show="epsgIsDegrees && (minutesChecked || secondsChecked)">
          <input
            class="coordinates"
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=minutes[0]
            type="number"
            step="0.0001"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}" v-show="epsgIsDegrees && secondsChecked">
          <input
            class="coordinates"
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=seconds[0]
            type="number"
            step="0.0001"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span class="second-input" :class="{isDegreesInput: epsgIsDegrees, isMetresInput: !epsgIsDegrees}">
        <!-- Ombyt ikoner ved decimalgrader -->
        <Icon v-if="epsgIsDegrees"
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon arrow-icon-x-coordinate"
        />
        <Icon v-else
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon"
        />
        <span class="chosen-coordinates">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=degrees[1]
            type="number"
            step="0.0001"
          />
          <span class="degrees" v-show="epsgIsDegrees">°E</span>
        <span class="degrees" v-show="!epsgIsDegrees">m</span>
        </span>
        <span class="chosen-coordinates" v-show="epsgIsDegrees && (minutesChecked || secondsChecked)">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=minutes[1]
            type="number"
            step="0.0001"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="epsgIsDegrees && secondsChecked">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=seconds[1]
            type="number"
            step="0.0001"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span class="third-input" :class="{isDegreesInput: epsgIsDegrees, isMetresInput: !epsgIsDegrees}" v-show = "is3D">
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon-z-coordinate"
        />
        <span class="chosen-coordinates">
        <input
          :class="{degreesInput: true}"
          v-model=meters
          type="number"
          step="0.0001"
        />
        <span class="degrees">m</span>
        </span>
      </span>
    </div>

    <div class="footer">
      <div class="searchbar">
        <input class="searchbar-input" id="dawa-autocomplete-input"/>
        <Icon
          icon="SearchIcon"
          class="searchbar-icon"
          :color="colors.turquoise"
          :width="1.8"
          :height="1.8"
          :stroke-width="0.75"
        />
      </div>
      <div class="radiogroup" v-show="epsgIsDegrees" :class="{radioGroupDisabled: !epsgIsDegrees}">
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
          <Icon v-show="!secondsChecked"
            icon="RadioIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.darkSteel"
          />
          <span style="display: inline-flex;">min. sek.</span>
        </label>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * InputCoordinates er selvsagt komponentet, hvor brugeren vælger en input EPSG-kode og inputkoordinater.
 * Koordinaterne kan tastees manuelt, eller ved at indtaste en addresse i søgefeltet.
 * De kan også nedarves fra Map.vue (og kaldes her 'mapMarkerInputCoords') via inject
 * Det skal emitte til sin forældre CoordinateTransformation, hvis koordinaterne eller EPSG-koden ændres,
 * eller hvis der er sket en transformationsfejl (f.eks. out-of-bounds)
 */
import { ref, inject, onUpdated, watch, onMounted, defineEmits } from 'vue'
import { useStore } from 'vuex'
import EpsgSelection from '@/components/coordinatetransformation/EpsgSelection'

const mapMarkerInputCoords = inject('mapMarkerInputCoords')
const inputCoords = ref(mapMarkerInputCoords.value)
const inputEPSG = ref('')
const colors = inject('themeColors')
const store = useStore()
// Formatknapperne
const degreesChecked = ref(false)
const minutesChecked = ref(false)
const secondsChecked = ref(false)
// DMS
const degrees = ref([0, 0])
const minutes = ref([0, 0])
const seconds = ref([0, 0])
const meters = ref(0)
const is3D = ref(true)
const epsgIsDegrees = ref(false)

const addressSelected = ref('')

const emit = defineEmits([
  'input-epsg-changed',
  'error-occurred',
  'input-coords-changed',
  'is-3d-changed'
])
/**
 * UTranformation af inputkoordinaterne, når brugeren vælger ny EPSG
 * @param code
 */
const inputEPSGChanged = (code) => {
  // check units. Er de grader eller meter
  if (code.v1_unit === 'degree') {
    epsgIsDegrees.value = true
    checkDegrees()
  } else {
    epsgIsDegrees.value = false
    disableRadioButtons()
  }
  // 3D eller 2D?
  is3D.value = code.v3 !== null
  if (is3D.value) {
    store.dispatch('trans/get', inputEPSG.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1] + ',' + inputCoords.value[2])
      .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
          error(output.message)
          return
        }
        inputEPSG.value = code.srid
        inputCoords.value[0] = output.v1
        inputCoords.value[1] = output.v2
        inputCoords.value[2] = output.v3
        // Vi formaterer inputtet, så det ser pænt ud,
        // og gør CoordinateTransformation opmærksom på ændringen
        // så den kan fortælle Map samt Output om den nye EPSG-kode.
        setInput()
        emit('input-epsg-changed', code)
      })
  } else {
    store.dispatch('trans/get', inputEPSG.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1])
      .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
          error(output.message)
          return
        }
        inputEPSG.value = code.srid
        inputCoords.value[0] = output.v1
        inputCoords.value[1] = output.v2
        emit('input-epsg-changed', code)
        setInput()
      })
  }
}

// Formatknapperne virker kun ved DMS
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
    setInput()
  }
}

const checkMinutes = () => {
  if (!minutesChecked.value) {
    degreesChecked.value = false
    minutesChecked.value = true
    secondsChecked.value = false
    setInput()
  }
}

const checkSeconds = () => {
  if (!secondsChecked.value) {
    degreesChecked.value = false
    minutesChecked.value = false
    secondsChecked.value = true
    setInput()
  }
}

// Smuksering af inputkoordinaterne i de tre til syv tastefelter
const setInput = () => {
  if (!epsgIsDegrees.value || degreesChecked.value) {
    const deg0 = parseFloat(inputCoords.value[0].toFixed(4))
    const deg1 = parseFloat(inputCoords.value[1].toFixed(4))

    degrees.value[0] = deg0
    degrees.value[1] = deg1
  } else if (minutesChecked.value) {
    const deg0 = Math.floor(inputCoords.value[0])
    const deg1 = Math.floor(inputCoords.value[1])

    const min0 = parseFloat(((inputCoords.value[0] - deg0) * 60).toFixed(4))
    const min1 = parseFloat(((inputCoords.value[1] - deg1) * 60).toFixed(4))

    degrees.value[0] = deg0
    degrees.value[1] = deg1
    minutes.value[0] = min0
    minutes.value[1] = min1
  } else {
    const deg0 = Math.floor(inputCoords.value[0])
    const deg1 = Math.floor(inputCoords.value[1])

    const min0 = Math.floor((inputCoords.value[0] - deg0) * 60)
    const min1 = Math.floor((inputCoords.value[1] - deg1) * 60)

    const sec0 = parseFloat(((inputCoords.value[0] - deg0 - min0 / 60) * 3600).toFixed(4))
    const sec1 = parseFloat(((inputCoords.value[1] - deg1 - min1 / 60) * 3600).toFixed(4))

    degrees.value[0] = deg0
    degrees.value[1] = deg1
    minutes.value[0] = min0
    minutes.value[1] = min1
    seconds.value[0] = sec0
    seconds.value[1] = sec1
  }
}

// Beder CoordinateTransformation om at vise en fejlmeddelselse
// med beskeden 'err' i tre sekunder.
const error = err => {
  emit('error-occurred', true, err)
  setTimeout(() => {
    emit('error-occurred', false)
  }, 3000)
}

/**
 * Henter koordinaterne for en given adresse,
 * sætter nålen på kortet
 * og foretager en transformation
 * @param url
 */
const getCoordsFromAdress = async (location) => {
  return fetch('https://api.dataforsyningen.dk/adresser?q=' + location)
    .then(res => res.json())
    .then(data => data[0].adgangsadresse.vejpunkt.koordinater)
    .then(coords => {
      if (is3D.value) {
        store.dispatch('trans/get', 'EPSG:4258/' + inputEPSG.value + '/' + coords[1] + ',' + coords[0] + ',' + meters.value).then(() => {
          const output = store.state.trans.data
          // Abort hvis fejl
          if (output.message !== undefined) {
            error(output.message)
            return
          }
          inputCoords.value[0] = output.v1
          inputCoords.value[1] = output.v2
          inputCoords.value[2] = output.v3
          setInput()
          emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1], inputCoords.value[2]])
        })
      } else {
        store.dispatch('trans/get', 'EPSG:4258/' + inputEPSG.value + '/' + coords[1] + ',' + coords[0]).then(() => {
          const output = store.state.trans.data
          if (output.message !== undefined) {
            error(output.message)
            return
          }
          inputCoords.value[0] = output.v1
          inputCoords.value[1] = output.v2
          setInput()
          emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1], inputCoords.value[2]])
        })
      }
    })
}

onMounted(() => {
  // Søgefeltet til indtastning af addresser (DAWA)
  inputEPSG.value = inject('inputEPSG')
  const dawaAutocomplete2 = require('dawa-autocomplete2')
  const inputElm = document.getElementById('dawa-autocomplete-input')

  dawaAutocomplete2.dawaAutocomplete(inputElm, {
    select: (selected) => {
      addressSelected.value = selected.tekst
      // Tranformation efter valgt addresse
      getCoordsFromAdress(addressSelected.value)
    }
  })
})
setInput()

// Hold øje med kortmarkørens placering,
// så inputkoordinaterne kan opdateres.
watch(mapMarkerInputCoords, () => {
  inputCoords.value = mapMarkerInputCoords.value
  setInput()
})

// Hold øje med de tastefelterne til inputkoordinater,
// skulle brugeren vælge at indtaste koordinaterne manuelt.
watch([degrees.value, minutes.value, seconds.value], () => {
  // Sørg for at lade koordinaterne være tal og aldrig bogstaver
  let v1 = degrees.value[0]
  let v2 = degrees.value[1]
  if (minutesChecked.value || secondsChecked.value) {
    v1 += minutes.value[0] / 60
    v2 += minutes.value[1] / 60
  }
  if (secondsChecked.value) {
    v1 += seconds.value[0] / 3600
    v2 += seconds.value[1] / 3600
  }
  inputCoords.value = [v1, v2, meters.value]
})

// Højdeparameteren til 3D-projektering er særskildt.
watch(meters, () => {
  inputCoords.value = [inputCoords.value[0], inputCoords.value[1], meters.value]
})

// Gør CoordinateTransformation opmærksom på ændringer i inputkoordinaterne,
// og om hvorvidt input EPGS-koden er i 3D eller 2D.
onUpdated(() => {
  emit('is-3d-changed', is3D.value)
  emit('input-coords-changed', inputCoords.value)
})
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.coordinate-selection-wrapper {
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
  border-bottom: var(--action) solid 1px;
  display: inline-flex;
  flex: 1;
  width: 10%;
  margin-right: 0.5rem;
  padding-bottom: 0.25rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input {
  -moz-appearance: textfield;
  border: none;
  width: 100%;
}
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}
.arrow-icon-z-coordinate {
  transform: rotate(45deg);
}
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}
.searchbar {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 0.5rem;
  border: var(--darkSteel) solid 1px;
  border-radius: 16px;
  flex-grow: 1;
  padding: 0rem 0.75rem 0.1rem 1rem;
}
input[type=radio] {
  opacity: 0;
  width: 0;
  height: 0;
  cursor: pointer;
}
.radiogroup {
  display: inline-flex;
  flex-wrap: nowrap;
}
.radioGroupDisabled {
  pointer-events: none;
}
.footer {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
}
.isDegreesInput {
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
  width: 100%;
}
.isMetresInput {
  width: 33%;
}
.isMetresInput {
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
}
@media screen and (max-width: 1180px) {
  .footer {
    display: inline-flex;
    margin-bottom: 0.5rem;
  }
  .searchbar {
    flex: 1;
  }
}
</style>