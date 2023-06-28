<template>
    <div class="crs-selection-wrapper">
        <select id='crs-select'
            :class="{ isSelected: outputSelected }" 
            v-model="currentlySelected"
            @change="emit('crsSelected', currentlySelected)">
    
            <!-- hvis indlejret i outputkortet, sæt ikke en default kode -->
            <option v-show="props.inOrOut == 'out'" class="crs-option"
                disabled value="default">
                Vælg Koordinatsystem
            </option>

            <option v-for="(code, index) in filteredCodes" :key="index" :value='code' >
                <!-- I feltet, vises både CRS'en og EPSG-koden -->
                {{ code.title_short }} ({{ code.srid }})
            </option>
        </select>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
const store = useStore()
const route = useRoute()
const allCodes = ref([])
const filteredCodes = ref([])
const currentlySelected = ref({})

// der er en liste over alle koder, som så deles i to. En for Danmark og en for Grønland
const filterCodes = async () => {
    if (route.name === 'Denmark' && allCodes.value.length !== 0) {
        filteredCodes.value = await getDenmarkCodes()
    } 
    else if (route.name === 'Greenland') {
        filteredCodes.value = await getGreenlandCodes()
    }
}

const getGreenlandCodes = async () => {
    const tempCodes = []
    for (let i = 0; i < allCodes.value.GL.length; ++i) {
        await store
        .dispatch('CRSInformation/get', allCodes.value.GL[i])
        .then(() => tempCodes.push(store.state.CRSInformation.data))
    }
    for (let i = 0; i < allCodes.value.Global.length; ++i) {
        await store
        .dispatch('CRSInformation/get', allCodes.value.Global[i])
        .then(() => tempCodes.push(store.state.CRSInformation.data))
    }
    return tempCodes
}

const getDenmarkCodes = async () => {
    const codes = []
    for (let i = 0; i < allCodes.value.DK.length; ++i) {
        await store
        .dispatch('CRSInformation/get', allCodes.value.DK[i])
        .then(() => {
            codes.push(store.state.CRSInformation.data)
        })
    }

    for (let i = 0; i < allCodes.value.Global.length; ++i) {
        await store
        .dispatch('CRSInformation/get', allCodes.value.Global[i])
        .then(() => {
            codes.push(store.state.CRSInformation.data)
        })
    }
    return codes
}

onMounted(() => {
    store.dispatch('CRS/clear') // Når siden loades, cleares alt data i Vuex
    store.dispatch('CRS/get', '') // GET alle koderne fra webproj
    .then(() => {
        allCodes.value = store.state.CRS.data // get codes from store
    })
    .then(() => {
        filterCodes()
        .then(() => {
            if (props.inOrOut == 'in') {
                currentlySelected.value = filteredCodes.value[0] // set default value
            }
            else {
                currentlySelected.value = 'default'
            }
        })
    })
})

const props = defineProps({
    inOrOut: String // bor dette instance i in- eller outputkortet
})

const emit = defineEmits([
    'crsSelected'
])
</script>

<style lang="scss">
#epsg-select {
    border-color: var(--dark-steel);
    padding-left: 20px;
    width: 100%;
    height: 2.5rem;
    border-radius: 30px;
    
    .crs-option {
        background-color: var(--hvid); color: var(--sort);
    }
}


.isSelected {
    background-color: var(--hvid);
}

.crs-selection-wrapper {
    margin-bottom: .4rem;
}
</style>