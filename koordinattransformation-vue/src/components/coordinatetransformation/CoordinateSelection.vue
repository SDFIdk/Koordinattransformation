<template>
  <article class="coordinate-selection">
    <section
      @click="inputActive = !inputActive"
      class="selected-input"
      :class="[{ inputActive: inputActive }, { isInput: isInput }]"
    >
      <span class="input-crs">
        {{ chosenInput }}
      </span>
      <Icon
        icon="ExpandIcon"
        :width="2"
        :height="2"
        :color="colors.turquoise"
        :strokeWidth="0.75"
        class="arrow-icon"
      />
    </section>
    <section v-show="inputActive" class="crs-selection">
      <article class="selection-list">
        <ul v-for="CRS in filteredCRS" :key="CRS">
          <li
            @click="
              chosenInput = CRS.title;
              inputActive = false;
              if (!isInput)
                outputSelected(CRS);
              epsgChanged(CRS);
            "
          >
            {{ CRS.title }}
          </li>
        </ul>
      </article>
    </section>
  </article>
</template>

<script>
import { onMounted, ref, inject } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
// import { compose } from 'ol/transform'

export default {
  name: 'CoordinateSelectionComponent',
  props: {
    // Check if the selection is input or output selection
    isInput: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    outputSelected (code) {
      console.log('outputSelected')
      this.$emit('output-selected', code)
    },
    epsgChanged (code) {
      console.log('epsgChanged')
      this.$emit('epsg-changed', code)
    }
  },
  setup (props) {
    const colors = inject('themeColors')
    const crs = ref([])
    const store = useStore()
    const route = useRoute()
    const chosenInput = ref('')
    const filteredCRS = ref([])
    const inputActive = ref(false)
    onMounted(() => {
      store.dispatch('CRS/clear')
      store.dispatch('CRS/get', '').then(() => {
        crs.value = store.state.CRS.data
        makeCRSList()
      })
    })
    const makeCRSList = async () => {
      const tempCRS = []
      if (route.name === 'Denmark' && crs.value.length !== 0) {
        for (let i = 0, iEnd = crs.value.DK.length; i < iEnd; ++i) {
          await store
            .dispatch('CRSInformation/get', crs.value.DK[i])
            .then(() => {
              tempCRS.push(store.state.CRSInformation.data)
            })
        }
        for (let i = 0, iEnd = crs.value.Global.length; i < iEnd; ++i) {
          await store
            .dispatch('CRSInformation/get', crs.value.Global[i])
            .then(() => {
              tempCRS.push(store.state.CRSInformation.data)
            })
        }
        filteredCRS.value = tempCRS
        chosenInput.value = props.isInput
          ? filteredCRS.value[0].title
          : 'Vælg koordinatsystem'
      } else if (route.name === 'Greenland') {
        for (let i = 0, iEnd = crs.value.DK.length; i < iEnd; ++i) {
          await store
            .dispatch('CRSInformation/get', crs.value.DK[i])
            .then(() => {
              tempCRS.push(store.state.CRSInformation.data)
            })
        }
        for (let i = 0, iEnd = crs.value.Global.length; i < iEnd; ++i) {
          await store
            .dispatch('CRSInformation/get', crs.value.Global[i])
            .then(() => {
              tempCRS.push(store.state.CRSInformation.data)
            })
        }
        filteredCRS.value = tempCRS
        chosenInput.value = props.isInput
          ? filteredCRS.value[0].title
          : 'Vælg koordinatsystem'
      }
    }
    return {
      colors,
      filteredCRS,
      chosenInput,
      inputActive
    }
  }
}
</script>

<style scoped>
.coordinate-selection {
  overflow: visible;
  width: 100%;
  align-self: center;
}
.selected-input {
  width: 100%;
  padding: 0 0.5rem;
  display: inline-flex;
  border: var(--darkSteel) solid 1px;
  border-radius: 25px;
  background: var(--action);
  color: var(--white);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.selected-input.isInput {
  background: var(--white);
  color: var(--black);
}
.selected-input.inputActive {
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  background: var(--white);
  color: var(--black);
  width: 100%;
}
.input-crs {
  width: 100%;
  padding: 0.5rem 0 0 0.5rem;
  align-items: center;
  display: inline-flex;
  margin-bottom: 0.5rem;
}
.arrow-icon {
  margin: 0 0 0 auto;
  transform: rotate(90deg);
}
.crs-selection {
  width: 100%;
  position: relative;
}
.selection-list {
  width: 100%;
  position: absolute;
  border: var(--darkSteel) solid 1px;
  border-radius: 0 0 25px 25px;
  z-index: 4;
  background: var(--white);
}
li {
  list-style-type: none;
  padding: 0.5rem;
  margin: 0;
  border-bottom: var(--action) solid 1px;
}
li:hover {
  background-color: var(--action);
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
