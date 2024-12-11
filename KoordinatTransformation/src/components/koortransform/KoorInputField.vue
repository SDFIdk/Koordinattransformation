<template>
<!-- Map shows only x and y -->
<span class="KT-input-segment">
    <input 
        type="number"
        step="0.0001"
        v-model="inputCoor.v1"
        @input="debounceUpdate"
    >
</span>

<span class="KT-input-segment">
    <input
        type="number"
        step="0.0001"
        v-model="inputCoor.v2"
        @input="debounceUpdate"
    >
</span>

<!--Map shows x y and z-->



<!--Map shows degrees in Meters, degrees or degrees + minutes-->
<div v-if="coordinateFormat==='meter'"></div>
<div v-else-if="coordinateFormat==='grader'"></div>
<div v-else-if="coordinateFormat='grader+minutter'"></div>
<div v-else></div>


</template>

<script setup>
 //koordinater kan være i meter, grader, grader+minutter, grader+minutter+sekunder
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
//implement direct 
const store = useStore()

const inputCoor = ref({v1: 0.00, v2: 0.00, v3: 0.00, v4: 0.00})

const debounceTimeout = ref(null)

const coorFrom = computed(() => store.getters['getCoordinatesFrom'])

const props = defineProps({
    coordinateFormat: {
        type: String,
        default: 'meter'
    }
})
const toRepresentation = (coordinates, repr) => {
    let res = {v1: null, v2: null, v3: null, v4: null}
    if(repr === 'direct'){
        res.v1 = coordinates.v1
        res.v2 = coordinates.v2
        res.v3 = coordinates.v3
        res.v4 = coordinates.v4
        console.log(res)
        return res
    }
    return {v1: 0.0, v2: 0.0, v3: 0.0, v4: 0.0}
}
const reverseRepresentation = (coordinates, repr) => {
    if(repr === 'direct'){
        return coordinates
    }
    return {v1: 0.0, v2: 0.0, v3: 0.0, v4: 0.0}
}

const debounceUpdate = (input) => {
    if(debounceTimeout.value){
        clearTimeout(debounceTimeout.value)
    }
    debounceTimeout.value = setTimeout(() => {
        const storeRepresentation = reverseRepresentation(inputCoor.value, "direct")
        console.log(storeRepresentation)
        store.dispatch('setCoordinatesFrom', {crs: store.getters['getCRSFrom'], coordinates: storeRepresentation
        })
        console.log(store.getters['getCoordinatesFrom'])
    }, 500)
}

watch((coorFrom), (to, from) => {
    inputCoor.value = toRepresentation(to, "direct")
    store.dispatch('setCoordinatesTo')
})

</script>

<style scoped>


</style>