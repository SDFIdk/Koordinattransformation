<template>
  <section class="input-coordinate">
    <div class="title-bar">
      <h3>Input</h3>
    </div>
    <section class="coordinate-selection-wrapper">
      <CoordinateSelection :isOutput="false" @epsg-changed="inputEPSGChanged"/>
    </section>
    <div class="input">
      <span class="first-input">
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
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[0][0]
            step="any"
          />
          <span class="degrees">°</span>
        </span>
        <span class="chosen-coordinates" v-show="isMinutes || isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[0][1]
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[0][2]
            step="any"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span class="first-input">
        <Icon
          icon="ArrowIcon"
          :width="2"
          :height="2"
          :color="colors.turquoise"
          :stroke-width="0"
        />
        <span class="chosen-coordinates">
        <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
          v-model=input[1][0]
          step="any"
        />
        <span class="degrees">°</span>
        </span>
        <span class="chosen-coordinates" v-show="isMinutes || isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[1][1]
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[1][2]
            step="any"
          />
          <span class="degrees">"</span>
        </span>
      </span>
      <span class="third-input">
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
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
          v-model=input[2][0]
          step="any"
        />
        <span class="degrees">°</span>
        </span>
        <span class="chosen-coordinates" v-show="isMinutes || isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[2][1]
            step="any"
          />
          <span class="degrees">'</span>
        </span>
        <span class="chosen-coordinates" v-show="isSeconds">
          <input
            :class="{degreesInput: isDegrees, metresInput: isMinutes, secondsInput: isSeconds}"
            v-model=input[2][2]
            step="any"
          />
         <span class="degrees">"</span>
        </span>
      </span>
    </div>
    <div class="footer">
      <div class="searchbar">
        <input class="searchbar-input"/>
        <Icon
          icon="SearchIcon"
          class="searchbar-icon"
          :color="colors.turquoise"
          :width="1.8"
          :height="1.8"
          :stroke-width="0.75"
        />
      </div>
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
          <Icon v-show="!thirdChecked"
            icon="RadioIcon"
            :width="1.3"
            :height="1.3"
            :strokeWidth="1"
            :color="colors.darkSteel"
          />
        min. sek.
        </label>
      </div>
    </div>
  </section>
</template>

<script>

import { defineAsyncComponent, ref, inject, onUpdated, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'InputCoordinates',
  components: {
    CoordinateSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    inputEPSGChanged (code) {
      this.$emit('input-epsg-changed', code)
      this.store.dispatch('trans/get', this.inputEPSG + '/' + code.srid + '/' + this.inputCoords[0] + ',' + this.inputCoords[1]).then(() => {
        const output = this.store.state.trans.data
        this.inputEPSG = code.srid
        this.inputCoords[0] = output.v1
        this.inputCoords[1] = output.v2
        this.setInput()
      })
    }
  },
  setup (props, context) {
    const store = useStore()
    const mapMarkerInputCoords = inject('inputCoords')
    const inputEPSG = inject('inputEPSG')
    const inputCoords = ref(mapMarkerInputCoords.value)
    const colors = inject('themeColors')
    const firstChecked = ref(true)
    const secondChecked = ref(false)
    const thirdChecked = ref(false)
    const isDegrees = ref(false)
    const isMinutes = ref(false)
    const isSeconds = ref(true)
    const input = ref([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
    const setInput = () => {
      if (isDegrees.value) {
        input.value[0][0] = inputCoords.value[0].toFixed(4)
        input.value[1][0] = inputCoords.value[1].toFixed(4)
      } else if (isMinutes.value) {
        const deg0 = Math.floor(inputCoords.value[0])
        const deg1 = Math.floor(inputCoords.value[1])
        const min0 = ((inputCoords.value[0] - deg0) * 60).toFixed(4)
        const min1 = ((inputCoords.value[1] - deg1) * 60).toFixed(4)
        input.value[0][0] = deg0
        input.value[0][1] = min0
        input.value[1][0] = deg1
        input.value[1][1] = min1
      } else {
        const deg0 = Math.floor(inputCoords.value[0])
        const deg1 = Math.floor(inputCoords.value[1])
        const min0 = Math.floor((inputCoords.value[0] - deg0) * 60)
        const min1 = Math.floor((inputCoords.value[1] - deg1) * 60)
        const sec0 = ((inputCoords.value[0] - deg0 - min0 / 60) * 3600).toFixed(4)
        const sec1 = ((inputCoords.value[1] - deg1 - min1 / 60) * 3600).toFixed(4)
        input.value[0][0] = deg0
        input.value[0][1] = min0
        input.value[0][2] = sec0
        input.value[1][0] = deg1
        input.value[1][1] = min1
        input.value[1][2] = sec1
      }
    }
    setInput()
    watch(mapMarkerInputCoords, () => {
      inputCoords.value = mapMarkerInputCoords.value
    })
    onUpdated(() => {
      if (inputCoords.value[0] !== '' && inputCoords.value[1] !== '') {
        context.emit('input-coords-changed', [inputCoords.value[0], inputCoords.value[1]])
      }
    })
    return {
      inputCoords,
      colors,
      store,
      inputEPSG,
      isMinutes,
      isSeconds,
      isDegrees,
      firstChecked,
      secondChecked,
      thirdChecked,
      setInput,
      input
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
.degreesInput {
  width: 20%;
}
.metresInput {
  width: 10%;
}
.secondsInput {
  width: 7.5%;
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
  align-items: center;
  margin-top: 1.25rem;
  width: 75%;
  border: var(--darkSteel) solid 1px;
  border-radius: 16px;
  /* height: 2rem; */
}
.searchbar-input {
  margin: 0 0 0 1rem;
  width: 92%;
}
.searchbar-icon {
  margin: 0 0.5rem 0 0;
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
.radiogroup {
  margin-top: 1rem;
  display: inline-flex;
  flex-wrap: nowrap;
}
.footer {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-wrap: nowrap;
}

@media screen and (max-width: 1180px) {
  .degreesInput {
    width: 80%;
  }
  .metresInput {
    width: 40%;
  }
  .secondsInput {
    width: 25%;
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
