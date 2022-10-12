lear<template>
  <section class="output-coordinate">
    <h3>Output</h3>
    <section class="coordinate-selection-wrapper">
      <CoordinateSelection
        :isOutput="true"
        :outputSelected="!outputSelected"
        @output-selected="outputSelectedMethod"/>
    </section>
    <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
      <span v-if="isLoading">
        <Loader size="1.5" :isLoading=isLoading />
      </span>
      <span v-else>
        {{ output1 }}
        {{ output2 }}
        {{ output3 }}
      </span>
    </div>
    <article class="footer">
      <div class="radio-and-info-group">
        <div class="radiogroup"  :class="{radioGroupDisabled: isMetres}">
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
import { defineAsyncComponent, inject, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'OutputCoordinates',
  props: {
    inputEPSG: {
      type: String,
      default () {
        return ''
      }
    },
    is3D: {
      type: Boolean,
      default () {
        return true
      }
    },
    inputCoords: {
      type: Array,
      default () {
        return inject('mapMarkerInputCoords').value
      }
    }
  },
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection')),
    Loader: defineAsyncComponent(() => import('@/components/shared/Loader'))
  },
  methods: {
    // En output-EPSG er valgt: Der skal foretages transformation,
    // og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
    outputSelectedMethod (code) {
      if (code.v1_unit === 'metre') {
        this.isMetres = true
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
    // Mulighed for at kopiere outputtet efter transformation
    copyCoordinates () {
      if (this.outputSelected && !this.isLoading) {
        navigator.clipboard.writeText(this.output1 + this.output2 + this.output3)
        this.$emit('coordinates-copied', true)
        window.setTimeout(() => {
          this.$emit('coordinates-copied', false)
        }, 3333)
      }
    },
    // Formatknapperne skal kun være aktive,
    // hvis EPSG-enheden også er i decimalgrader - ikke meter
    disableRadioButtons () {
      this.degreesChecked = false
      this.minutesChecked = false
      this.secondsChecked = false
    },
    checkDegrees () {
      this.degreesChecked = true
      this.minutesChecked = false
      this.secondsChecked = false
      this.setOutput()
    },
    checkMinutes () {
      this.degreesChecked = false
      this.minutesChecked = true
      this.secondsChecked = false
      this.setOutput()
    },
    checkSeconds () {
      this.degreesChecked = false
      this.minutesChecked = false
      this.secondsChecked = true
      this.setOutput()
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
    }
  },
  setup (props, { emit }) {
    const store = useStore()
    const colors = inject('themeColors')
    const outputEPSG = ref('')
    const degreesChecked = ref(false)
    const minutesChecked = ref(false)
    const secondsChecked = ref(false)
    const outputSelected = ref(false)
    const outputCoords = ref([0, 0, 0])
    const output1 = ref('')
    const output2 = ref('')
    const output3 = ref('')
    const hasTransformed = ref(false)
    const isLoading = ref(false)
    const isMetres = ref(true)
    const hover = ref(false)
    // Smuksering af outputtet
    const setOutput = () => {
      let res1 = ''
      let res2 = ''
      let res3 = ''
      const d3 = outputCoords.value[2].toFixed(2)
      if (isMetres.value) {
        const d1 = outputCoords.value[0].toFixed(4)
        const d2 = outputCoords.value[1].toFixed(4)
        res1 = d1 + ' m, '
        res2 = d2 + ' m'
        if (props.is3D) {
          res2 += ', '
          res3 = d3 + ' m'
        } else {
          res3 = ''
        }
      } else {
        if (degreesChecked.value) {
          const d1 = outputCoords.value[0].toFixed(4)
          const d2 = outputCoords.value[1].toFixed(4)
          res1 = d1 + ' °N, '
          res2 = d2 + ' °E'
          if (props.is3D) {
            res2 += ', '
            res3 = d3 + ' m'
          } else {
            res3 = ''
          }
        } else if (minutesChecked.value) {
          const d1 = Math.floor(outputCoords.value[0])
          const d2 = Math.floor(outputCoords.value[1])
          const m1 = ((outputCoords.value[0] - d1) * 60).toFixed(4)
          const m2 = ((outputCoords.value[1] - d2) * 60).toFixed(4)
          res1 = d1 + ' ° ' + m1 + '\' N, '
          res2 = d2 + ' ° ' + m2 + ' \' E'
          if (props.is3D) {
            res2 += ', '
            res3 = d3 + ' m'
          } else {
            res3 = ''
          }
        } else {
          const d1 = Math.floor(outputCoords.value[0])
          const d2 = Math.floor(outputCoords.value[1])
          const m1 = Math.floor((outputCoords.value[0] - d1) * 60)
          const m2 = Math.floor((outputCoords.value[1] - d2) * 60)
          const s1 = ((outputCoords.value[0] - d1 - m1 / 60) * 3600).toFixed(4)
          const s2 = ((outputCoords.value[1] - d2 - m2 / 60) * 3600).toFixed(4)
          res1 = d1 + '° ' + m1 + '\' ' + s1 + '" N, '
          res2 = d2 + '° ' + m2 + '\' ' + s2 + '" E'
          if (props.is3D) {
            res2 += ', '
            res3 = d3 + ' m'
          } else {
            res3 = ''
          }
        }
      }
      // Opdater kun hvis der er sket noget nyt
      if (output1.value === res1 && output2.value === res2 && output3.value === res3) {
        return
      }
      // Et lille "loader"-icon, der skal gøre brugeren opmærksom på,
      // at der altså fortages en transformation.
      isLoading.value = true
      setTimeout(() => {
        isLoading.value = false
        output1.value = res1
        output2.value = res2
        output3.value = res3
      }, 500)
    }
    const error = err => {
      emit('error-occurred', true, err)
      setTimeout(() => {
        emit('error-occurred', false)
      }, 4000)
    }
    const transform = () => {
      if (!hasTransformed.value) return
      if (props.is3D) {
        if (props.inputEPSG === outputEPSG.value) {
          outputCoords.value = props.inputCoords
          setOutput()
        }
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
            setOutput()
          })
      } else {
        store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1])
          .then(() => {
            const output = store.state.trans.data
            if (output.message !== undefined) {
              error(output.message)
              return
            }
            outputCoords.value[0] = parseFloat(output.v1)
            outputCoords.value[1] = parseFloat(output.v2)
            setOutput()
          })
      }
    }
    return {
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
      setOutput,
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
.coordinate-selection-wrapper {
  margin: 1.4rem 0 0.75rem 0;
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
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  width: 100%;
  height: 3rem;
  display: inline-flex;
  flex-wrap: nowrap;
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
  margin-top: 1.25rem;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
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
