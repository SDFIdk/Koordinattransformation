<template>
  <section class="output-coordinate">
    <span class="title-bar">
      <h3>Output</h3>
    </span>
    <CoordinateSelection :isOutput="true" :outputNotSelected="outputNotSelected" @output-selected="outputSelectedMethod"/>
    <!-- <input v-if="!loading"
      type="text"
      class="transformed-coordinates"
      :class="{ hasTransformed: hasTransformed}"
      v-model="outputCoords"
    > -->
    <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
      <span v-if="loading">
        <Loader size="1.5" :isLoading="true"></Loader>
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
        <Icon v-show="!isMobile"
          icon="InfoIcon"
          :width="1.3"
          :height="1.3"
          :color="colors.black"
          class="info-icon"
        />
      </div>
      <article class="copy-btn">
        Kopiér
        <Icon
          icon="CopyIcon"
          :width="1.5"
          :height="1.5"
          :color="colors.black"
          class="copy-icon"
        />
      </article>
    </article>
  </section>
</template>

<script>
import { isMobile } from 'mobile-device-detect'
import { defineAsyncComponent, inject, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'OutputCoordinates',
  props: {
    inputEPSG: {
      type: Object,
      default () {
        return null
      }
    },
    inputCoords: {
      type: Array,
      default () {
        return [0, 0]
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
    const firstChecked = ref(true)
    const secondChecked = ref(false)
    const thirdChecked = ref(false)
    const outputNotSelected = ref(true)
    const outputCoords = ref('')
    const outputEPSG = ref(Object)
    const hasTransformed = ref(false)
    const transform = async () => {
      const token = '?token=82153d2e2105603af96321adfdff1ba3'
      const transURL = 'https://api.dataforsyningen.dk/rest/webproj/v1.0/trans/'
      // const transURL = 'http://load201.kmsext.dk/rest/webproj/v1.1/trans/'
      console.log('Input', props.inputEPSG.srid)
      console.log('Output', outputEPSG.value.srid)
      const sridIn = props.inputEPSG.srid === 'undefined' ? props.inputEPSG.srid : 'EPSG:25832'
      const sridOut = outputEPSG.value.srid
      console.log('props: ', props)
      const v1 = props.inputCoords[0]
      const v2 = props.inputCoords[1]
      console.log('OutputCoordinates transform, v1: ', v1, ' v2: ', v2)
      const response = await fetch(transURL + sridIn + '/' + sridOut + '/' + v1 + ',' + v2 + token)
      const data = await response.json()
      console.log(data)
      outputCoords.value = '\t' + data.v1 + ' °N,\t' + data.v2 + ' °E'
      hasTransformed.value = true
    }
    return {
      store,
      colors,
      firstChecked,
      secondChecked,
      thirdChecked,
      isMobile,
      outputNotSelected,
      outputCoords,
      outputEPSG,
      transform,
      hasTransformed
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
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
  padding: 1rem 3rem 1rem 3rem;
  background-color: var(--lightSteel);
}
.transformed-coordinates {
  margin-top: 1rem;
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
.title-bar {
  margin-bottom: 1rem;
}
.copy-btn {
  background-color: var(--lightSteel);
  color: var(--darkSteel);
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  float: right;
  padding: 0.3rem 1rem;
  display: inline-flex;
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
  margin-top: 1rem;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.radiogroup {
  display: inline-flex;
}
.copy-icon {
  margin-left: 0.75rem;
}
</style>
