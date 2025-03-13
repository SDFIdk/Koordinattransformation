<template>
  <div class="KT-output-wrapper">
    <button
      v-if="isMobile"
      class="KT-min quiet"
      title="minimize"
      @click="isMinimized= !isMinimized"
    >
      <svg v-if="!isMinimized"><use href="../../../assets/icons/icons.svg#minus" /></svg>
      <svg v-else><use href="../../../assets/icons/icons.svg#plus" /></svg>
    </button>
    <div class="KT-output-segment">
      <h2>Output</h2>
      <div v-show="!isMinimized">
        <select
          id="KT-crs-out-select"
          v-model="selectedOption"
          name="crs-out-select"
        >
          <option
            v-for="option in outputOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
        <KoorOutputField />
      </div>
    </div>
  </div>
</template>

<script setup>
import KoorOutputField from './KoorOutputField.vue'
import { ref, watch, onMounted, inject } from 'vue'
import { useKtStore } from '../../../store/store.js'
import { extractEPSGCode } from '../../../helperfunctions.js'

const KtStore = useKtStore()

const props = defineProps({
  coverArea: {
    type: String,
    default: 'DK',
  },
  outputOptions: {
    type: Array,
    default: () => [],
  },
})

const isMobile = inject('isMobile')
const selectedOption = ref(props.outputOptions[0] || '')
const isMinimized = ref(false)

watch(selectedOption, (to, from) => {
  KtStore.setCRSTo(extractEPSGCode(to))
  KtStore.setCoordinatesTo()
})
onMounted(() => {
  KtStore.setCRSTo(extractEPSGCode(selectedOption.value)) 
})

</script>

<style>
</style>