<template>
  <section class="input-coordinate">
    <div class="title-bar">
      <h3>Input</h3>
    </div>
    <section class="coordinate-selection-wrapper">
      <CoordinateSelection :isOutput="false" @epsg-changed="inputEPSGChanged"/>
    </section>
    <div class="input">
      <span :class="{isDegreesInput: isDegrees, isMetresInput: !isDegrees}">
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
          class="arrow-icon-x-coordinate"
        />
        <span class="chosen-coordinates">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=degrees[0]
            type="number"
            step="any"
          />
          <span class="degrees" v-show="isDegrees"> °</span>
        <span class="degrees" v-show="!isDegrees" style="font-size: 0.9rem"> m</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && (minutesChecked || secondsChecked)">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=minutes[0]
            type="number"
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && secondsChecked">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=seconds[0]
            type="number"
            step="any"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span :class="{isDegreesInput: isDegrees, isMetresInput: !isDegrees}">
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
        />
        <span class="chosen-coordinates">
          <input
              :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=degrees[1]
              type="number"
            step="any"
          />
          <span class="degrees" v-show="isDegrees"> °</span>
        <span class="degrees" v-show="!isDegrees" style="font-size: 0.9rem"> m</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && (minutesChecked || secondsChecked)">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=minutes[1]
            type="number"
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && secondsChecked">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=seconds[1]
            type="number"
            step="any"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span :class="{isDegreesInput: isDegrees, isMetresInput: !isDegrees}">
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
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
          v-model=degrees[2]
            type="number"
          step="any"
        />
        <span class="degrees" v-show="isDegrees"> °</span>
        <span class="degrees" v-show="!isDegrees" style="font-size: 0.9rem"> m</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && (minutesChecked || secondsChecked)">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=minutes[2]
            type="number"
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isDegrees && secondsChecked">
          <input
            :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
            v-model=seconds[2]
            type="number"
            step="any"
          />
         <span class="degrees">"</span>
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
      <!-- <div class="radiogroup" :class="{isDegrees: !isDegrees}"> -->
      <div class="radiogroup" :class="{radioGroupDisabled: !isDegrees}">
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

<script>

import { defineAsyncComponent, ref, inject, onUpdated, watch, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'InputCoordinates',
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.$emit('input-epsg-changed', code)
      if (code.v1_unit === 'degree') {
        this.isDegrees = true
        this.checkDegrees()
      } else {
        this.isDegrees = false
        this.disableRadioButtons()
      }
      this.is3D = code.v3 !== null
      this.store.dispatch('trans/get', this.inputEPSG + '/' + code.srid + '/' + this.inputCoords[0] + ',' + this.inputCoords[1]).then(() => {
        const output = this.store.state.trans.data
        this.inputEPSG = code.srid
        this.inputCoords[0] = output.v1
        this.inputCoords[1] = output.v2
        this.setInput()
      })
    },
    disableRadioButtons () {
      this.degreesChecked = false
      this.minutesChecked = false
      this.secondsChecked = false
    },
    checkDegrees () {
      if (!this.degreesChecked) {
        this.degreesChecked = true
        this.minutesChecked = false
        this.secondsChecked = false
        this.setInput()
      }
    },
    checkMinutes () {
      if (!this.minutesChecked) {
        this.degreesChecked = false
        this.minutesChecked = true
        this.secondsChecked = false
        this.setInput()
      }
    },
    checkSeconds () {
      if (!this.secondsChecked) {
        this.degreesChecked = false
        this.minutesChecked = false
        this.secondsChecked = true
        this.setInput()
      }
    }
  },
  setup (props, context) {
    const mapMarkerInputCoords = inject('inputCoords')
    const inputEPSG = ref('')
    const inputCoords = ref(mapMarkerInputCoords.value)
    const colors = inject('themeColors')
    const store = useStore()
    const degreesChecked = ref(false)
    const minutesChecked = ref(false)
    const secondsChecked = ref(false)
    const degrees = ref([0, 0, 0])
    const minutes = ref([0, 0, 0])
    const seconds = ref([0, 0, 0])
    const is3D = ref(true)
    const isDegrees = ref(false)
    const selected = ref('')
    const setInput = (coords) => {
      if (coords == null) return
      if (degreesChecked.value) {
        degrees.value[0] = parseFloat(coords[0].toFixed(4))
        degrees.value[1] = parseFloat(coords[1].toFixed(4))
      } else if (minutesChecked.value) {
        const deg0 = Math.floor(coords[0])
        const deg1 = Math.floor(coords[1])
        const min0 = parseFloat(((coords[0] - deg0) * 60).toFixed(4))
        const min1 = parseFloat(((coords[1] - deg1) * 60).toFixed(4))
        degrees.value[0] = deg0
        degrees.value[1] = deg1
        minutes.value[0] = min0
        minutes.value[1] = min1
      } else {
        const deg0 = Math.floor(coords[0])
        const deg1 = Math.floor(coords[1])
        const min0 = Math.floor((coords[0] - deg0) * 60)
        const min1 = Math.floor((coords[1] - deg1) * 60)
        const sec0 = parseFloat(((coords[0] - deg0 - min0 / 60) * 3600).toFixed(4))
        const sec1 = parseFloat(((coords[1] - deg1 - min1 / 60) * 3600).toFixed(4))
        degrees.value[0] = deg0
        degrees.value[1] = deg1
        minutes.value[0] = min0
        minutes.value[1] = min1
        seconds.value[0] = sec0
        seconds.value[1] = sec1
      }
    }
    onMounted(() => {
      inputEPSG.value = inject('inputEPSG')
      const dawaAutocomplete2 = require('dawa-autocomplete2')
      const inputElm = document.getElementById('dawa-autocomplete-input')
      dawaAutocomplete2.dawaAutocomplete(inputElm, {
        select: function (selected) {
          selected.value = selected.tekst
          fetch('https://api.dataforsyningen.dk/adresser?q=' + selected.value)
            .then(res => res.json())
            .then(data => data[0].adgangsadresse.vejpunkt.koordinater)
            .then(coords => {
              store.dispatch('trans/get', 'EPSG:4258/' + inputEPSG.value + '/' + coords[1] + ',' + coords[0]).then(() => {
                const output = store.state.trans.data
                inputCoords.value[0] = output.v1
                inputCoords.value[1] = output.v2
                setInput([output.v1, output.v2])
                context.emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1]])
              })
            })
            .catch(err => {
              // console.log(err)
              this.$emit('error-occurred', true, err)
              window.setTimeout(() => {
                this.$emit('error-occurred', false)
              }, 3000)
            })
        }
      })
    })
    setInput(inputCoords.value)
    watch(mapMarkerInputCoords, () => {
      inputCoords.value = mapMarkerInputCoords.value
      setInput(inputCoords.value)
    })
    watch([degrees.value, minutes.value, seconds.value], () => {
      if (degreesChecked.value) {
        const val = [degrees.value[0], degrees.value[1]]
        inputCoords.value = val
      } else if (minutesChecked.value) {
        const val = [degrees.value[0] + minutes.value[0] / 60, degrees.value[1] + minutes.value[1] / 60]
        inputCoords.value = val
      } else if (secondsChecked.value) {
        const val1 = degrees.value[0] + minutes.value[0] / 60 + seconds.value[0] / 3600
        const val2 = degrees.value[1] + minutes.value[1] / 60 + seconds.value[1] / 3600
        const val = [val1, val2]
        inputCoords.value = val
      }
    })
    onUpdated(() => {
      context.emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1]])
    })
    return {
      inputCoords,
      colors,
      store,
      inputEPSG,
      minutesChecked,
      secondsChecked,
      degreesChecked,
      setInput,
      degrees,
      minutes,
      seconds,
      is3D,
      isDegrees,
      selected
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
  border-bottom: var(--action) solid 1px;
  margin: 0 0.5rem 0 0;
  box-sizing: border-box;
  padding-bottom: 0.25rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input {
  -moz-appearance: textfield;
  border: none;
  width: 91%;
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
.degrees {
  font-size: 1.25rem;
}
.searchbar {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 0.5rem;
  border: var(--darkSteel) solid 1px;
  border-radius: 16px;
  flex-grow: 1;
  padding: 0.1rem 0.5rem 0.1rem 1rem;
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
.degreesInput {
  width: 90%;
}
.metresInput {
  width: 43%;
}
.secondsInput {
  width: 28%;
}
.isDegreesInput {
  display: block;
}
.isMetresInput {
  margin-top: 0.25rem;
  display: inline-flex;
  width: 32.5%;
  align-items: center;
}
.chosen-coordinates {
  width: 100%;
}
@media screen and (max-width: 1180px) {
  .degreesInput {
    width: 80%;
  }
  .metresInput {
    width: 38%;
  }
  .secondsInput {
    width: 24%;
  }
  .first-input, .second-input, .third-input {
    display: block;
  }
  .footer {
    display: block;
  }
  .searchbar {
    width: 100%;
  }
}
</style>
