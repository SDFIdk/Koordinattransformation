<template>
    <section class="output-coordinate">
        <h3>Output</h3>
        <section class="coordinate-selection-wrapper">
            <select :class="{ isSelected: outputSelected }" id='epsg-output-select' @change="onEpsgSelect">
                <option value="0" disabled selected>Vælg Koordinatsystem</option>
                <option v-for="(code, index) in filteredOutputCodes" :key="index" :value='code' >
                    {{ code.title_short }} ({{ code.srid }})
                </option>
            </select>
        </section>
        <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
            <div v-if="isLoading">
                <Loader :isLoading=isLoading />
            </div>
            <div v-else>
                <div class="output-coordinates">{{ output1 }}</div>
                <div class="output-coordinates">{{ output2 }} </div>
                <div class="output-coordinates">{{ output3 }}</div>
            </div>
        </div>
        <article class="footer" :class="{isMetres: format == 'meters'}">
            <div class="radio-and-info-group" v-show="format!='meters'">
                <div class="radiogroup" :class="{radioGroupDisabled: format == 'meters'}">
                    <label class="radio" for="degrees">
                        <input type="radio" v-model="format" value="degrees" name="date-format">
                        DD
                    </label>
                    <label class="radio" for="minutes">
                        <input type="radio" v-model="format" value="minutes" name="date-format">
                        min.
                    </label>
                    <label class="radio" for="seconds">
                        <input type="radio" v-model="format" value="seconds" name="date-format">
                    min. sek.
                    </label>
                </div>
                <InfoIcon 
                    @mouseenter="hover = true"
                    @mouseleave="hover = false"/>

                    <div class="info-text-container">
                        <Transition>
                            <p class="info-text" v-if="hover">Repræsentation af geografiske koordinater, vælg mellem decimalgrader, grader og decimalminutter eller grader, minutter og sekunder.</p>
                        </Transition>
                    </div>
                </div>
            <button class="copy-btn" @click="copyCoordinates" :class="{hasTransformed: hasTransformed && !isLoading}">
                Kopiér
                <CopyIcon/>
            </button>
        </article>
    </section>
</template>

<script setup>
/**
 * Ouput foretager den reelle transformation - den er vi er interesseret i
 */
import { inject, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Formatter from './Formatting'
import InfoIcon from '../shared/icons/InfoIcon.vue'
import CopyIcon from '../shared/icons/CopyIcon.vue'
const store = useStore()
const outputEPSG = ref('')
import Loader from '../shared/Loader.vue'

const format = ref('')
const outputSelected = ref(false)
const outputCoords = ref([0, 0, 0])
const output1 = ref('')
const output2 = ref('')
const output3 = ref('')
const hasTransformed = ref(false)
const isLoading = ref(false)
const hover = ref(false)
const crs = ref([])
const filteredOutputCodes = ref([])
const route = useRoute()


const props = defineProps({
    inputEPSG: { type: String, default () { return '' }},
    is3D: { type: Boolean, default () { return true }},
    inputCoords: { type: Array, default () { return inject('mapMarkerInputCoords').value }}
})

const emit = defineEmits([
    'coordinates-copied',
    'error-occurred'
])

// En output-EPSG er valgt: Der skal foretages transformation,
// og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
const onEpsgSelect = (event) => {
    const code = event.target.selectedOptions[0]._value

    if (code.v1_unit === 'metre') {
        format.value = 'meters'
    } else {
        format.value = 'degrees'
    }

    outputSelected.value = true
    outputEPSG.value = code.srid
    hasTransformed.value = true
    transform()
}

// Mulighed for at kopiere outputtet efter transformation
const copyCoordinates = () => {
    if (outputSelected.value && !isLoading.value) {
        navigator.clipboard.writeText(output1.value + output2.value + output3.value)
        emit('coordinates-copied', true)
        window.setTimeout(() => {
            emit('coordinates-copied', false)
        }, 1000)
    }
}

const formatCoordinates = (_coords) => {
    let formattedCoordinates = []

    if (format.value == 'meters') {
        formattedCoordinates = Formatter.toMetres(_coords)
    } else {
        if (format.value == 'degrees') {
            formattedCoordinates = Formatter.toDegrees(_coords)
        } else if (format.value == 'minutes') {
            formattedCoordinates = Formatter.toDegreesAndMinutes(_coords)
        } else {
            formattedCoordinates = Formatter.toDegreesMinutesAndSeconds(_coords)
        }
    }
    if (props.is3D) {
        Formatter.appendThirdParameter(formattedCoordinates, _coords[2].toFixed(4))
    } else {
        formattedCoordinates.push('')
    }
    return formattedCoordinates
}

// fylder output feltet med de givne koordinater
const updateOutputField = (_coords) => {
    isLoading.value = true // viser et animeret loader ikon.
    setTimeout(() => {
        isLoading.value = false
        output1.value = _coords[0]
        output2.value = _coords[1]
        output3.value = _coords[2]
    }, 500)
}

const getGreenlandCodes = async () => {
    const tempCodes = []
    for (let i = 0; i < crs.value.GL.length; ++i) {
        await store
        .dispatch('CRSInformation/get', crs.value.GL[i])
        .then(() => {
            tempCodes.push(store.state.CRSInformation.data)
        })
    }
    for (let i = 0; i < crs.value.Global.length; ++i) {
        await store
        .dispatch('CRSInformation/get', crs.value.Global[i])
        .then(() => {
            tempCodes.push(store.state.CRSInformation.data)
        })
    }
    return tempCodes
}

const getDenmarkCodes = async () => {
    const codes = []
    for (let i = 0; i < crs.value.DK.length; ++i) {
        await store
        .dispatch('CRSInformation/get', crs.value.DK[i])
        .then(() => {
            codes.push(store.state.CRSInformation.data)
        })
    }

    for (let i = 0; i < crs.value.Global.length; ++i) {
        await store
        .dispatch('CRSInformation/get', crs.value.Global[i])
        .then(() => {
            codes.push(store.state.CRSInformation.data)
        })
    }
    return codes
}

const updateFilteredCodes = async () => {
    // Der er forskellige lister for Danmark og Grøndland
    if (route.name === 'Denmark' && crs.value.length !== 0) {
        filteredOutputCodes.value = await getDenmarkCodes()
    } else if (route.name === 'Greenland') {
        filteredOutputCodes.value = await getGreenlandCodes()
    }
}

const error = err => {
    emit('error-occurred', true, err)
    setTimeout(() => {
        emit('error-occurred', false)
    }, 4000)
}

const setOutput3D = async () => {
    store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1] + ',' + props.inputCoords[2])
    .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
            error(output.message)
            return
        }
        outputCoords.value[0] = parseFloat(output.v1)
        outputCoords.value[1] = parseFloat(output.v2)
        outputCoords.value[2] = parseFloat(output.v3)
        updateOutputField(formatCoordinates(outputCoords.value))
    })
}

const setOutput2D = async () => {
    store.dispatch('trans/get', props.inputEPSG + '/' + outputEPSG.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1])
    .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
            error(output.message)
            return
        }
        outputCoords.value[0] = parseFloat(output.v1)
        outputCoords.value[1] = parseFloat(output.v2)
        updateOutputField(formatCoordinates(outputCoords.value))
    })
}

const setOutputDirect = () => {
    outputCoords.value[0] = props.inputCoords[0]
    outputCoords.value[1] = props.inputCoords[1]
    outputCoords.value[2] = props.inputCoords[2]
    updateOutputField(formatCoordinates(outputCoords.value))
}

const transform = () => {
    if (!hasTransformed.value) {
        return
    }
    if (props.inputEPSG === outputEPSG.value) {
        setOutputDirect()
        return
    }
    if (props.is3D) {
        setOutput3D()
    } else {
        setOutput2D()
    }
}

onMounted(() => {
    store.dispatch('CRS/clear')
    store.dispatch('CRS/get', '')
    .then(() => {
        crs.value = store.state.CRS.data
        updateFilteredCodes()
    })
})

// Holder øje med inputkoordinaterne og transformerer kun,
// hvis der også er valgt en EPSG-kode for outputtet.
// Når først det er valgt én gang, transformerer den derefter frit.
watch(() => props.inputCoords, () => {
    if (outputSelected.value) {
        transform()
    }
})
watch(format, () => {
    updateOutputField(formatCoordinates(outputCoords.value))
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

option {
    background: white;
    color: black;
}

#epsg-output-select {
    padding-left: 20px;
    width: 100%;
    height: 2.5rem;
    border-radius: 30px;
    border-color: var(--darkSteel);
}

.isSelected {
    background: white;
}

.coordinate-selection-wrapper {
    margin-top: 1.4rem;
}
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
.info-icon {
    border: var(--darkSteel) solid 1px;
    border-radius: 25px;
    background: var(--white);
    margin-left: 0.5rem;
}
.info-text-container {
    position: relative;
    flex-grow: 1;
}
.info-text {
    position: absolute;
    width: 20vw;
    padding: 10px;
    border: 1px solid var(--darkSteel);
    border-radius: 10px;
    background-color: var(--white);
    margin: 0 2rem 0 0.5rem;
}
label {
    display: inline-flex;
}
.output-coordinate {
    padding: 1rem 1.5rem;
    background-color: var(--lightSteel);
}
.transformed-coordinates {
    margin: 1rem 0 1rem 0.25rem;
    padding-left: 0.5rem;
    width: 98.75%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    background-color: var(--white);
    border: var(--darkSteel) solid 1px;
}
.transformed-coordinates.hasTransformed {
    background-color: var(--action);
    color: var(--white);
}
.transformed-coordinates::selection {
    background: var(--highlight2);
}
.output-coordinates {
    display: inline-flex;
    margin-right: 0.25rem;
}
.copy-btn {
    background-color: var(--lightSteel);
    color: var(--darkSteel);
    border: var(--darkSteel) solid 1px;
    border-radius: 25px;
    float: right;
    padding: 0.3rem 1rem;
    display: inline-flex;
    align-items: center;
}
.copy-btn.hasTransformed {
    background-color: var(--action);
    color: var(--white);
}

.radio {
    display: inline-flex;
    white-space: nowrap;
}

input[type='radio'] {
    transform: scale(.45);
    display: inline-flex;
}

.radioGroupDisabled {
    pointer-events: none;
}
.footer {
    align-items: center;
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: nowrap;
}
.isMetres {
    justify-content: end;
}
.radio-and-info-group {
    display: inline-flex;
    flex-grow: 1;
}
.radiogroup {
    display: inline-flex;
    flex-wrap: nowrap;
}
</style>
