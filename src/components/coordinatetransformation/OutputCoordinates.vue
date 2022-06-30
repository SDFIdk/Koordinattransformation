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
        <label class="radio" @click="firstChecked = true; secondChecked = false; thirdChecked = false">
          <input type="radio" name="date-format">
          <Icon v-show="firstChecked"
            icon="RadioOnIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.turquoise"
          />
          <Icon v-show="!firstChecked"
            icon="RadioIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.darkSteel"
          />
          DD
        </label>
        <label class="radio" @click="firstChecked = false; secondChecked = true; thirdChecked = false">
          <input type="radio" name="date-format">
          <Icon v-show="secondChecked"
            icon="RadioOnIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.turquoise"
          />
          <Icon v-show="!secondChecked"
            icon="RadioIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.darkSteel"
          />
          min.
        </label>
        <label class="radio" @click="firstChecked = false; secondChecked = false; thirdChecked = true">
          <input type="radio" name="date-format">
          <Icon v-show="thirdChecked"
            icon="RadioOnIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.turquoise"
          />
          <Icon  v-show="!thirdChecked"
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
      type: Function,
      default () {
        return null
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
    }
  },
  watch: {
    inputEPSG () {
      if (!this.outputNotSelected) {
        this.transform()
      }
    },
    inputCoords () {
      if (!this.outputNotSelected) {
        this.transform()
      }
    }
  },
  setup (props) {
    const store = useStore()
    const colors = inject('themeColors')
    const inputEPSG = inject('inputEPSG')
    const inputCoords = inject('inputCoords')
    const firstChecked = ref(true)
    const secondChecked = ref(false)
    const thirdChecked = ref(false)
    const outputNotSelected = ref(true)
    const outputCoords = ref('')
    const outputEPSG = ref(Object)
    const hasTransformed = ref(false)
    const isLoading = ref(false)
    const transform = async () => {
      isLoading.value = true
      hasTransformed.value = true
      setTimeout(() => {
        isLoading.value = false
        store.dispatch('trans/get', inputEPSG + '/' + outputEPSG.value.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1]).then(() => {
          outputCoords.value = store.state.trans.data.v1 + ' °N, ' + store.state.trans.data.v2 + ' °E'
        })
      }, 500)
    }
    return {
      store,
      colors,
      firstChecked,
      secondChecked,
      thirdChecked,
      outputNotSelected,
      outputCoords,
      outputEPSG,
      hasTransformed,
      isLoading,
      transform
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
