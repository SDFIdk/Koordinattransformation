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
        {{ output }}
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
      this.transform()
    },
    copyCoordinates () {
      if (this.outputSelected && !this.isLoading) {
        navigator.clipboard.writeText(this.output)
        this.$emit('coordinates-copied', true)
        window.setTimeout(() => {
          this.$emit('coordinates-copied', false)
        }, 3333)
      }
    },
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
    inputCoords (_after, _before) {
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
    // const outputCoords = ref(props.isDenmark ? [677_555, 61_481_00, 0] : [-5758833.2009, 9393681.2087, 0])
    const outputCoords = ref([0, 0, 0])
    const output = ref('')
    const hasTransformed = ref(false)
    const isLoading = ref(false)
    const isMetres = ref(true)
    const hover = ref(false)
    const setOutput = () => {
      if (!hasTransformed.value) return
      const d3 = outputCoords.value[2].toFixed(2)
      if (isMetres.value) {
        const d1 = outputCoords.value[0].toFixed(4)
        const d2 = outputCoords.value[1].toFixed(4)
        let res = d1 + ' m, ' + d2 + ' m'
        if (props.is3D) res += ', ' + d3 + ' m'
        output.value = res
      } else {
        if (degreesChecked.value) {
          const d1 = outputCoords.value[0].toFixed(4)
          const d2 = outputCoords.value[1].toFixed(4)
          let res = d1 + ' °N, ' + d2 + ' °E'
          if (props.is3D) res += ', ' + d3 + ' m'
          output.value = res
        } else if (minutesChecked.value) {
          const d1 = Math.floor(outputCoords.value[0])
          const d2 = Math.floor(outputCoords.value[1])
          const m1 = ((outputCoords.value[0] - d1) * 60).toFixed(4)
          const m2 = ((outputCoords.value[1] - d2) * 60).toFixed(4)
          let res = d1 + ' ° ' + m1 + '\' N, ' + d2 + ' ° ' + m2 + ' \' E'
          if (props.is3D) res += ', ' + d3 + ' m'
          output.value = res
        } else {
          const d1 = Math.floor(outputCoords.value[0])
          const d2 = Math.floor(outputCoords.value[1])
          const m1 = Math.floor((outputCoords.value[0] - d1) * 60)
          const m2 = Math.floor((outputCoords.value[1] - d2) * 60)
          const s1 = ((outputCoords.value[0] - d1 - m1 / 60) * 3600).toFixed(4)
          const s2 = ((outputCoords.value[1] - d2 - m2 / 60) * 3600).toFixed(4)
          let res = d1 + '° ' + m1 + '\' ' + s1 + '" N, ' + d2 + '° ' + m2 + '\' ' + s2 + '" E'
          if (props.is3D) res += ', ' + d3 + ' m'
          output.value = res
        }
      }
    }
    const error = err => {
      emit('error-occurred', true, err)
      window.setTimeout(() => {
        emit('error-occurred', false)
      }, 5000)
    }
    const transform = () => {
      isLoading.value = true
      hasTransformed.value = true
      setTimeout(() => {
        isLoading.value = false
        if (props.is3D) {
          if (props.inputEPSG === outputEPSG.value) {
            outputCoords.value = props.inputCoords
            setOutput()
          }
          store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1] + ',' + props.inputCoords[2])
            .then(() => {
              outputCoords.value[0] = parseFloat(store.state.trans.data.v1)
              outputCoords.value[1] = parseFloat(store.state.trans.data.v2)
              outputCoords.value[2] = parseFloat(store.state.trans.data.v3)
              setOutput()
            }).catch(err => error(err))
        } else {
          store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1])
            .then(() => {
              outputCoords.value[0] = parseFloat(store.state.trans.data.v1)
              outputCoords.value[1] = parseFloat(store.state.trans.data.v2)
              setOutput()
            }).catch(err => error(err))
        }
      }, 500)
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
      output,
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
  margin: 0 0 0 0.5rem;
}
.info-text-container {
  position: relative;
  flex-grow: 1;
}
.info-text {
  position: absolute;
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
  width: 100%;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  padding-left: 1rem;
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
@media screen and (max-width: 904px) {
  .transformed-coordinates {
    height: 2.5rem;
  }
}
@media screen and (max-width: 828px) {
  .info-icon {
    display: none;
  }
}
@media screen and (max-width: 703px) {
  .info-icon {
    display: block;
  }
  .transformed-coordinates {
    height: 2rem;
  }
}
</style>
