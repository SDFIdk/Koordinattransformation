<template>
  <div class="KT-input-segment">
    <button
      v-if="isMobile"
      class="KT-min quiet"
      title="minimize"
      @click="isMinimized= !isMinimized"
    >
      <svg v-if="!isMinimized"><use href="../../../assets/icons/icons.svg#minus" /></svg>
      <svg v-else><use href="../../../assets/icons/icons.svg#plus" /></svg>
    </button>
    <h2>Input</h2>
    <div v-show="!isMinimized">
      <select
        id="epsg-select"
        v-model="selectedOption"
        name="epsg-select"
      >
        <option
          v-for="option in inputOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <KoorInputField />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useKtStore } from '../../../store/store.js'
import { extractEPSGCode } from '../../../helperfunctions.js'
import KoorInputField from './KoorInputField.vue'

const KtStore = useKtStore()

const props = defineProps({
  coverArea: {
    type: String,
    default: 'DK',
  },
  inputOptions: {
    type: Array,
    default: () => [],
  },
})
const selectedOption = ref(props.inputOptions[0] || '')
const isMobile = inject('isMobile')
const isMinimized = ref(false)

watch(selectedOption, (to, from) => {
  KtStore.setCRSFrom(extractEPSGCode(to))
  //not needed for reactive use, thus we don't use getter here
  KtStore.setCoordinatesFrom({crs: extractEPSGCode(from), coordinates: KtStore.CoordinatesFrom})
})
onMounted(() => {
  KtStore.setCRSFrom(extractEPSGCode(selectedOption.value))
})
</script>

<style scoped>
.KT-input-segment {
    width: 46%;
    margin: var(--space);
}
@media only screen and (max-width: 66rem) {
  .KT-input-segment {
      width: 90%;
      height:50%;
      margin: var(--space);
  }
  .KT-min{
    position: absolute;
    right: 1rem;
    top: 0.1rem;
  }
}
</style>
