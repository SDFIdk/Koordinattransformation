<template>
  <section class="output-coordinate">
    <span>
      <h3>Output</h3>
    </span>
    <OutputSelection :isInput="false" @outputSelected="selectOutput" @inputOutputChanged="transform"/>
    <input type="text" class="transformed-coordinates">
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

export default {
  name: 'OutputCoordinates',
  components: {
    OutputSelection: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateSelection'))
  },
  methods: {
    selectOutput () {
      console.log('outputSelected', this.outputSelected)
    },
    transform () {
      console.log('transform called')
      if (this.outputSelected) {
        console.log('transfoorm')
      } else {
        console.log('no transfoorm')
      }
    }
  },
  setup () {
    const colors = inject('themeColors')
    const firstChecked = ref(true)
    const secondChecked = ref(false)
    const thirdChecked = ref(false)
    const outputSelected = ref(false)
    return {
      colors,
      firstChecked,
      secondChecked,
      thirdChecked,
      isMobile,
      outputSelected
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
span {
  display: inline-flex;
  align-items: flex-end;
  margin-bottom: 0.5rem;
}
.output-coordinate {
  padding: 1rem 3rem 1rem 3rem;
  background-color: var(--lightSteel);
}
.transformed-coordinates {
  margin-top: 1rem;
  background-color: var(--white);
  border: var(--darkSteel) solid 1px;
}
input:focus {
  outline: none;
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
