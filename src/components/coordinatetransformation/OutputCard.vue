<template>
  <section class="output-coordinate">
    <h3>Output</h3>
    <section class="coordinate-selection-wrapper">
      <select :class="{ isSelected: this.outputSelected }" id='epsg-output-select' @change="onEpsgSelect">
        <option value="0" disabled selected>Vælg Koordinatsystem</option>
        <option v-for="(code, index) in filteredOutputCodes" :key="index" :value='code' >
            {{ code.title_short }} ({{ code.srid }})
        </option>
      </select>
    </section>
    <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
      <div v-if="isLoading">
        <Loader size="1.5" :isLoading=isLoading />
      </div>
      <div v-else>
        <div class="output-coordinates">{{ output1 }}</div>
        <div class="output-coordinates">{{ output2 }} </div>
        <div class="output-coordinates">{{ output3 }}</div>
      </div>
    </div>
    <article class="footer" :class="{isMetres: isMetres}">
      <div class="radio-and-info-group" v-show="!isMetres">
        <div class="radiogroup" :class="{radioGroupDisabled: isMetres}">
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

<script>
/**
 * Ouput foretager den reelle transformation - den er vi er interesseret i
 */
import { defineAsyncComponent, inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'OutputCoordinates',

  props: {
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
  },

  components: {
    Loader: defineAsyncComponent(() => import('@/components/shared/Loader'))
  },

  methods: {
    // En output-EPSG er valgt: Der skal foretages transformation,
    // og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
    onEpsgSelect (event) {
      const code = event.target.selectedOptions[0]._value
      if (code.v1_unit === 'metre') {
        this.isMetres = true
        // TODO: this should hide the radio buttons entirely
        this.disableRadioButtons()
      } else {
        this.isMetres = false
        this.degreesChecked = true
      }
      this.outputSelected = true
      this.outputEPSG = code.srid
      this.hasTransformed = true
      this.transform()
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
        this.setTransformInput()
      }
    },

    checkMinutes () {
      if (!this.minutesChecked) {
        this.degreesChecked = false
        this.minutesChecked = true
        this.secondsChecked = false
        this.setTransformInput()
      }
    },

    checkSeconds () {
      if (!this.secondsChecked) {
        this.degreesChecked = false
        this.minutesChecked = false
        this.secondsChecked = true
        this.setTransformInput()
      }
    },

    setTransformInput () {
      if (!this.epsgIsDegrees || this.degreesChecked.value) {
        const deg0 = parseFloat(this.inputCoords[0]).toFixed(4)
        const deg1 = parseFloat(this.inputCoords[1]).toFixed(4)

        this.degrees[0] = deg0
        this.degrees[1] = deg1
      } else if (this.minutesChecked.value) {
        const deg0 = Math.floor(this.inputCoords[0])
        const deg1 = Math.floor(this.inputCoords[1])

        const min0 = parseFloat(((this.inputCoords.value[0] - deg0) * 60).toFixed(4))
        const min1 = parseFloat(((this.inputCoords.value[1] - deg1) * 60).toFixed(4))

        this.degrees.value[0] = deg0
        this.degrees.value[1] = deg1
        this.minutes.value[0] = min0
        this.minutes.value[1] = min1
      } else {
        const deg0 = Math.floor(this.inputCoords.value[0])
        const deg1 = Math.floor(this.inputCoords.value[1])

        const min0 = Math.floor((this.inputCoords.value[0] - deg0) * 60)
        const min1 = Math.floor((this.inputCoords.value[1] - deg1) * 60)

        const sec0 = parseFloat(((this.inputCoords.value[0] - deg0 - min0 / 60) * 3600).toFixed(4))
        const sec1 = parseFloat(((this.inputCoords.value[1] - deg1 - min1 / 60) * 3600).toFixed(4))

        this.degrees.value[0] = deg0
        this.degrees.value[1] = deg1
        this.minutes.value[0] = min0
        this.minutes.value[1] = min1
        this.seconds.value[0] = sec0
        this.seconds.value[1] = sec1
      }
    },

    // Mulighed for at kopiere outputtet efter transformation
    copyCoordinates () {
      if (this.outputSelected && !this.isLoading) {
        navigator.clipboard.writeText(this.output1 + this.output2 + this.output3)
        this.$emit('coordinates-copied', true)
        window.setTimeout(() => {
          this.$emit('coordinates-copied', false)
        }, 3333)
      }
    }
  },

  watch: {
    // Holder øje med inputkoordinaterne og transformerer kun,
    // hvis der også er valgt en EPSG-kode for outputtet.
    // Når først det er valgt én gang, transformerer den derefter frit.
    inputCoords () {
      if (this.outputSelected) {
        this.transform()
      }
    },

    minutesChecked () {
      this.updateOutputField(this.formatCoordinates(this.outputCoords))
    },
    secondsChecked () {
      this.updateOutputField(this.formatCoordinates(this.outputCoords))
    },
    degreesChecked () {
      this.updateOutputField(this.formatCoordinates(this.outputCoords))
    }
  },

  setup (props, { emit }) {
    const store = useStore()
    const colors = inject('themeColors')
    const outputEPSG = ref('')

    const degreesChecked = ref(false)
    const minutesChecked = ref(false)
    const secondsChecked = ref(false)

    const degrees = ref([0, 0])
    const outputSelected = ref(false)
    const outputCoords = ref([0, 0, 0])
    const output1 = ref('')
    const output2 = ref('')
    const output3 = ref('')
    const hasTransformed = ref(false)
    const isLoading = ref(false)
    const isMetres = ref(true)
    const hover = ref(false)
    const crs = ref([])
    // const EpsgCodes = ref([])
    const filteredOutputCodes = ref([])
    const route = useRoute()

    const appendThirdParameter = (coordinates, parameter) => {
      coordinates[1] += ', '
      coordinates.push(parameter + ' m')
    }

    const formatToMetres = (coords) => {
      let formatted = []
      const degrees1 = coords[0].toFixed(4)
      const degrees2 = coords[1].toFixed(4)

      // result1 = degrees1 + ' m, '
      // result2 = degrees2 + ' m'
      formatted = [degrees1 + ' m, ', degrees2 + ' m']

      return formatted
    }

    const formatToDegrees = (coords) => {
      const degrees1 = coords[0].toFixed(4)
      const degrees2 = coords[1].toFixed(4)
      // result1 = degrees1 + ' °N, '
      // result2 = degrees2 + ' °E'
      const formatted = [degrees1 + ' °N, ', degrees2 + ' °E']

      return formatted
    }

    const formatToDegreesAndMinutes = (coords) => {
      const degrees1 = Math.floor(coords[0])
      const degrees2 = Math.floor(coords[1])
      const minutes1 = (parseFloat(coords[0] - degrees1) * 60).toFixed(4)
      const minutes2 = (parseFloat(coords[1] - degrees2) * 60).toFixed(4)

      const formatted = [degrees1 + ' ° ' + minutes1 + '\' N, ', degrees2 + ' ° ' + minutes2 + ' \' E']

      return formatted
    }

    const formatToDegreesMinutesAndSeconds = (coords) => {
      const degrees1 = Math.floor(coords[0])
      const degrees2 = Math.floor(coords[1])
      const minutes1 = Math.floor((coords[0] - degrees1) * 60)
      const minutes2 = Math.floor((coords[1] - degrees2) * 60)
      const seconds1 = ((coords[0] - degrees1 - minutes1 / 60) * 3600).toFixed(4)
      const seconds2 = ((coords[1] - degrees2 - minutes2 / 60) * 3600).toFixed(4)

      const formatted = [
        degrees1 + '° ' + minutes1 + '\' ' + seconds1 + '" N, ',
        degrees2 + '° ' + minutes2 + '\' ' + seconds2 + '" E'
      ]
      return formatted
    }

    /** Fylder output feltet med de aktuelle koordinater formateret på en pæn måde */
    const formatCoordinates = (coords) => {
      let formattedCoordinates = []

      if (isMetres.value) {
        formattedCoordinates = formatToMetres(coords)
      } else {
        if (degreesChecked.value) {
          formattedCoordinates = formatToDegrees(coords)
        } else if (minutesChecked.value) {
          formattedCoordinates = formatToDegreesAndMinutes(coords)
        } else {
          formattedCoordinates = formatToDegreesMinutesAndSeconds(coords)
        }
      }
      if (props.is3D) {
        appendThirdParameter(formattedCoordinates, coords[2])
      } else {
        formattedCoordinates.push('')
      }

      return formattedCoordinates
    }

    const updateOutputField = (coords) => {
      // Opdater kun hvis der er sket noget nyt
      // Et lille "loader"-icon, der skal gøre brugeren opmærksom på,
      // at der altså fortages en transformation.
      isLoading.value = true
      setTimeout(() => {
        isLoading.value = false
        output1.value = coords[0]
        output2.value = coords[1]
        output3.value = coords[2]
      }, 500)
    }

    const getEpsgCodes = async () => {
      const tempCodes = []
      // Der er forskellige lister for Danmark og Grøndland
      if (route.name === 'Denmark' && crs.value.length !== 0) {
        for (let i = 0; i < crs.value.DK.length; ++i) {
          await store
            .dispatch('CRSInformation/get', crs.value.DK[i])
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
        filteredOutputCodes.value = tempCodes
        document.getElementById('epsg-output-select').value = filteredOutputCodes.value[0].title
      } else if (route.name === 'Greenland') {
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
        filteredOutputCodes.value = tempCodes
        document.getElementById('epsg-output-select').value = 'Vælg koordinatsystem'
      }
    }

    const error = err => {
      emit('error-occurred', true, err)
      setTimeout(() => {
        emit('error-occurred', false)
      }, 4000)
    }

    const setOutput3D = async () => {
      store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1] + ',' + props.inputCoords[2])
        .then(() => {
          const output = store.state.trans.data
          if (output.message !== undefined) {
            error(output.message)
            return
          }
          outputCoords.value[0] = parseFloat(output.v1)
          outputCoords.value[1] = parseFloat(output.v2)
          outputCoords.value[2] = parseFloat(output.v3)
          updateOutputField(formatCoordinates(outputCoords.value))
        })
    }

    const setOutput2D = async () => {
      store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1])
        .then(() => {
          const output = store.state.trans.data
          if (output.message !== undefined) {
            error(output.message)
            return
          }
          outputCoords.value[0] = parseFloat(output.v1)
          outputCoords.value[1] = parseFloat(output.v2)
          updateOutputField(formatCoordinates(outputCoords.value))
        })
    }

    const setOutputDirect = () => {
      outputCoords.value[0] = props.inputCoords[0]
      outputCoords.value[1] = props.inputCoords[1]
      outputCoords.value[2] = props.inputCoords[2]
      updateOutputField(formatCoordinates(outputCoords.value))
    }

    const transform = () => {
      if (!hasTransformed.value) {
        return
      }
      if (props.inputEPSG === outputEPSG.value) {
        setOutputDirect()
        return
      }
      if (props.is3D) {
        setOutput3D()
      } else {
        setOutput2D()
      }
    }

    onMounted(() => {
      store.dispatch('CRS/clear')
      store.dispatch('CRS/get', '').then(() => {
        crs.value = store.state.CRS.data
        getEpsgCodes()
      })
    })

    return {
      updateOutputField,
      degrees,
      filteredOutputCodes,
      getEpsgCodes,
      store,
      colors,
      degreesChecked,
      minutesChecked,
      secondsChecked,
      outputSelected,
      outputCoords,
      outputEPSG,
      hasTransformed,
      isLoading,
      transform,
      formatCoordinates,
      output1,
      output2,
      output3,
      hover,
      isMetres
    }
  }
}
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
.transformed-coordinates {
  margin: 1rem 0 1rem 0.25rem;
  padding-left: 0.5rem;
  width: 98.75%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  background-color: var(--white);
  border: var(--darkSteel) solid 1px;
}
.transformed-coordinates.hasTransformed {
  background-color: var(--action);
  color: var(--white);
}
.transformed-coordinates::selection {
  background: var(--highlight2);
}
.output-coordinates {
  display: inline-flex;
  margin-right: 0.25rem;
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
.isMetres {
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
