<template>
    <div class="KT-input-segment">
        <h2>Input</h2>
        <select name="epsg-select" id="epsg-select" v-model="selectedOption">
            <option v-for="option in inputOptions" :key="option" :value="option">
                {{ option }}
            </option>
        </select>
        <KoorInputField />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { extractEPSGCode } from '@/helperfunctions.js';
import KoorInputField from '@/components/koortransform/KoorInputField.vue'

const store = useStore()

const props = defineProps({
    coverArea: {
        type: String,
        default: 'DK'
    },
    inputOptions: {
        type: Array,
        default: () => []
    }
})
const selectedOption = ref(props.inputOptions[0] || '')

watch(selectedOption, (to, from) => {
    const crsOld = from.split(' ').at(-1).slice(1, -1)
    const crsNew = to.split(' ').at(-1).slice(1, -1)
    store.dispatch('setCRSFrom', extractEPSGCode(to))
    store.dispatch('setCoordinatesFrom', {crs: extractEPSGCode(from), coordinates: store.getters['getCoordinatesFrom']})
    console.log(store.getters['getCRS'])
})
onMounted(() => {
    store.dispatch('setCRSFrom', selectedOption.value.split(' ').at(-1).slice(1, -1)) 
})
</script>

<style scoped>
.KT-input-segment {
    width: 50%;
}
</style>
