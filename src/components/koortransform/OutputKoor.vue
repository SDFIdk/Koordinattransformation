<template>
<div class="KT-output-segment">
    <h2>Output</h2>
    <select name="epsg-select" id="epsg-select" v-model="selectedOption">
        <option v-for="option in outputOptions" :key="option" :value="option">
            {{ option }}
        </option>
    </select>
    <KoorOutputField />
</div>
</template>

<script setup>
import KoorOutputField from '@/components/koortransform/KoorOutputField.vue'
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { extractEPSGCode } from '@/helperfunctions';

const store = useStore()

const props = defineProps({
    coverArea: {
        type: String,
        default: 'DK'
    },
    outputOptions: {
        type: Array,
        default: () => []
    }
})

const selectedOption = ref(props.outputOptions[0] || '');

watch(selectedOption, (to, from) => {
    store.dispatch('setCRSTo', extractEPSGCode(to))
    store.dispatch('setCoordinatesTo')
    console.log(store.getters['getCRS'])
})
onMounted(() => {
    store.dispatch('setCRSTo', extractEPSGCode(selectedOption.value))  
})

</script>

<style scoped>
.KT-output-segment {
    width: 50%;
}
</style>