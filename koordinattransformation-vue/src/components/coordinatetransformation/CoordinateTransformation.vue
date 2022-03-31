<template>
  <article class="coordinate-transformation-box">
    <InputCoordinates class="input" @epsg-code-changed="inputChanged"/>
    <OutputCoordinates class="output"/>
  </article>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  name: 'CoordinateTransformation',
  components: {
    InputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/InputCoordinates')),
    OutputCoordinates: defineAsyncComponent(() => import('@/components/coordinatetransformation/OutputCoordinates'))
  },
  methods: {
    inputChanged () {
      console.log('input changed')
    }
  },
  props: {
    // Check if the selection is input or output selection
    transformRes: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup () {
    const inputCoords = ref('')
    const colors = inject('themeColors')
    return {
      inputCoords,
      colors,
      isMobile
    }
  }
}
</script>

<style scoped>
.coordinate-transformation-box {
  display: grid;
  width: 100%;
  border: 2px solid var(-darkSteel);
  outline: 4px solid rgba(191, 223, 227, 0.7);
  border-radius: 25px;
  overflow: visible;
  z-index: 1;
}
.input {
  border-radius: 25px 25px 0 0;
  position: relative;
  background: var(--white);
  padding: 1rem 3rem 1rem 3rem;
  border-bottom: var(--action) solid 2px;
  border-right: none;
}
.output {
  border-radius: 0 0 25px 25px;
  border-top: none;
}
.input:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  border-style: solid;
  border-width: 14px 10px 0;
  border-color: var(--white) transparent;
  display: block;
  width: 0;
  z-index: 3;
  transform: translateY(100%);
}
.input:before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  border-style: solid;
  border-width: 18px 13px 0;
  border-color: var(--action) transparent;
  display: block;
  width: 0;
  z-index: 2;
  transform: translateY(100%) translateX(-3px);
}
@media screen and (min-width: 37.5rem) {
  .coordinate-transformation-box {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "input output"
  }
  .input {
    border-radius: 25px 0 0 25px;
    border-right: var(--action) solid 2px;
    border-bottom: none;
  }
  .input:after {
    content: "";
    position: absolute;
    bottom: 50%;
    left: 100%;
    border-style: solid;
    border-width: 10px 0 10px 14px;
    border-color: transparent var(--white);
    display: block;
    width: 0;
    z-index: 3;
    transform: translateY(50%);
  }
  .input:before {
    content: "";
    position: absolute;
    bottom: 50%;
    left: 100%;
    border-style: solid;
    border-width: 12px 0 12px 17px;
    border-color: transparent var(--action);
    display: block;
    width: 0;
    z-index: 2;
    transform: translateY(50%);
  }
  .output {
    border-radius: 0 25px 25px 0;
  }
}
</style>
