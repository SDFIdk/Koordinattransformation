<template>
<!-- Map shows only x and y in the 'direct' format -->
    <div class="KT-input-container">
        <span class="KT-input-segment">
        <input 
            type="number"
            step="0.0001"
            v-model="inputCoor.v1"
            @input="debounceUpdate"
        />
        </span>
        <span class="KT-input-segment">
        <input
            type="number"
            step="0.0001"
            v-model="inputCoor.v2"
            @input="debounceUpdate"
        />
        </span>
    </div>
</template>


<script setup>
import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const inputCoor = ref({ v1: 0.00, v2: 0.00, v3: 0.00, v4: 0.00 })
const debounceTimeout = ref(null)

const coorFrom = computed(() => store.getters['getCoordinatesFrom'])

const props = defineProps({
    coordinateFormat: {
        type: String,
        default: 'direct'
    }
})

// Convert coordinates to 'direct' format representation
const toRepresentation = (coordinates, repr) => {
    if (repr === 'direct') {
        return {
        v1: coordinates.v1,
        v2: coordinates.v2,
        v3: coordinates.v3,
        v4: coordinates.v4
        }
    }
    return { v1: 0.0, v2: 0.0, v3: 0.0, v4: 0.0 }
}

// Convert input to store format (reverse representation)
const reverseRepresentation = (coordinates, repr) => {
    if (repr === 'direct') {
        return coordinates
    }
    return { v1: 0.0, v2: 0.0, v3: 0.0, v4: 0.0 }
}


const debounceUpdate = () => {
    if (debounceTimeout.value) {
        clearTimeout(debounceTimeout.value)
    }
    debounceTimeout.value = setTimeout(() => {
        const storeRepresentation = reverseRepresentation(inputCoor.value, 'direct')
        store.dispatch('setCoordinatesFrom', {
        crs: store.getters['getCRSFrom'],
        coordinates: storeRepresentation
        })
    }, 500)
}

// Watch for changes from the store and update the input fields
watch(coorFrom, (to) => {
    inputCoor.value = toRepresentation(to, 'direct')
})
</script>


<style scoped>
.KT-input-container {
    display: flex;
    gap: 0.5rem;
}

.KT-input-segment {
    display: flex;
    flex-direction: column;
}
</style>
  