<template>
  <section class="output-coordinate">
    <h3>Output</h3>
    <section class="coordinate-selection-wrapper">
      <CoordinateSelection
        :isOutput="true"
        :outputNotSelected="outputNotSelected"
        @output-selected="outputSelectedMethod"/>
    </section>
    <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
      <span v-if="isLoading">
        <Loader size="1.5" :isLoading=isLoading />
      </span>
      <span v-else>
        {{ outputCoords }}
      </span>
    </div>
    <article class="footer">
      <div class="radiogroup">
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
        <Icon
          icon="InfoIcon"
          :width="1.3"
          :height="1.3"
          :color="colors.black"
          class="info-icon"
        />
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
    inputCoords: {
      type: Array,
      default () {
        return ['0', '0']
      }
    },
    inputEPSG: {
      type: String,
      default () {
        return ''
      }
    }
  },
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection')),
    Loader: defineAsyncComponent(() => import('@/components/shared/Loader'))
  },
  methods: {
    outputSelectedMethod (code) {
      this.outputNotSelected = false
      this.outputEPSG = code
      this.transform()
    },
    copyCoordinates () {
      if (!this.outputNotSelected && !this.isLoading) {
        navigator.clipboard.writeText(this.outputCoords)
        this.$emit('coordinates-copied', true)
        window.setTimeout(() => {
          this.$emit('coordinates-copied', false)
        }, 3000)
      }
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
    inputCoords () {
      if (!this.outputNotSelected) {
        this.transform()
      }
    }
  },
  setup (props) {
    const store = useStore()
    const colors = inject('themeColors')
    let inputEPSG = inject('inputEPSG')
    const inputCoords = inject('inputCoords')
    const degreesChecked = ref(true)
    const minutesChecked = ref(false)
    const secondsChecked = ref(false)
    const outputNotSelected = ref(true)
    const outputCoords = ref('')
    const outputEPSG = ref(Object)
    const hasTransformed = ref(false)
    const isLoading = ref(false)
    const setOutput = () => {
      if (degreesChecked.value) {
        outputCoords.value = store.state.trans.data.v1 + '°N, ' + store.state.trans.data.v2 + '°E'
      } else if (minutesChecked.value) {
        const d1 = Math.floor(store.state.trans.data.v1)
        const d2 = Math.floor(store.state.trans.data.v2)
        const m1 = (store.state.trans.data.v1 - d1) * 60
        const m2 = (store.state.trans.data.v2 - d2) * 60
        outputCoords.value = d1 + '°N ' + m1 + '\', ' + d2 + '°E ' + m2 + '\''
      } else {
        const d1 = Math.floor(store.state.trans.data.v1)
        const d2 = Math.floor(store.state.trans.data.v2)
        const m1 = Math.floor((store.state.trans.data.v1 - d1) * 60)
        const m2 = Math.floor((store.state.trans.data.v2 - d2) * 60)
        const s1 = (store.state.trans.data.v1 - d1 - m1 / 60) * 3600
        const s2 = (store.state.trans.data.v2 - d2 - m2 / 60) * 3600
        outputCoords.value = d1 + '°N ' + m1 + '\' ' + s1 + '", ' + d2 + '°E ' + m2 + '\' ' + s2 + '"'
      }
    }
    const transform = async () => {
      inputEPSG = props.inputEPSG
      isLoading.value = true
      hasTransformed.value = true
      setTimeout(() => {
        isLoading.value = false
        store.dispatch('trans/get', inputEPSG + '/' + outputEPSG.value.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1]).then(() => {
          setOutput()
        })
      }, 300)
    }
    return {
      store,
      colors,
      degreesChecked,
      minutesChecked,
      secondsChecked,
      outputNotSelected,
      outputCoords,
      outputEPSG,
      hasTransformed,
      isLoading,
      transform,
      setOutput
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
.info-icon {
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  background: var(--white);
  margin: 0 0 0 0.5rem;
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
.footer {
  margin-top: 1.25rem;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
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
