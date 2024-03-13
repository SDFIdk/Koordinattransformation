<template>
    <section class="output-card">
        <h3 class="OutputTitle">Output</h3>
        <CrsSelector :inOrOut="'out'" @crsSelected="onCrsSelect"/>
        
        <div class="transformed-coordinates"  :class="{ hasTransformed: hasTransformed }">
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
            <div class="radio-and-info-group" v-show="radiosVisible">
                <!-- formater outputtet med grader, grader+minutter, grader+minutter+sekunder -->
                <div class="radiogroup">
                    <input type="radio" v-model="format" value="degrees">
                    <label class="radio-label" for="degrees"> DD </label>
                    <input type="radio" v-model="format" value="minutes">
                    <label class="radio-label" for="minutes"> min. </label>
                    <input type="radio" v-model="format" value="seconds">
                    <label class="radio-label" for="seconds"> min. sek. </label>
                </div>
                <InfoIcon 
                    @mouseenter="hover = true"
                    @mouseleave="hover = false"/>

                    <div class="info-popup">
                        <Transition>
                            <p
                                class="popup-text" 
                                v-if="hover">
                                Repræsentation af geografiske koordinater, vælg mellem decimalgrader, grader og decimalminutter eller grader, minutter og sekunder.
                            </p>
                        </Transition>
                    </div>
                </div>
            <button class="copy-btn" 
                @click="copyCoordinates" 
                :class="{hasTransformed: hasTransformed && !isLoading}">
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
import { inject, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Formatter from './Formatting'
import InfoIcon from '../shared/icons/InfoIcon.vue'
import CopyIcon from '../shared/icons/CopyIcon.vue'
import Loader from '../shared/icons/Loader.vue'
import CrsSelector from './CrsSelector.vue'
const store = useStore()
const outputCRS = ref('')

const format = ref('')
const outputSelected = ref(false)
const outputCoords = ref([0, 0, null])
const output1 = ref('')
const output2 = ref('')
const output3 = ref('')
const hasTransformed = ref(false)
const isLoading = ref(false)
const hover = ref(false)
const radiosVisible = ref(false)
const outputIs3D = ref(false)


const props = defineProps({
    inputCRS: { type: String, default () { return '' }},
    inputIs3D: { type: Boolean, default () { return true }},
    inputCoords: { type: Array, default () { return inject('mapMarkerInputCoords').value }}
})

const emit = defineEmits([
    'coordinates-copied',
    'error-occurred'
])

// En output-EPSG er valgt: Der skal foretages transformation,
// og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
const onCrsSelect = (code) => {

    // check units
    if (code.v1_unit === 'metre') {
        radiosVisible.value = false
        format.value = 'meters'
    } else {
        radiosVisible.value = true
        format.value = 'degrees'
    }

    // check if 3D or not
    if (code.v3 == null) {
        outputIs3D.value = false
    } else {
        outputIs3D.value = true
    }

    outputCRS.value = code.srid
    outputSelected.value = true
    transform()
    hasTransformed.value = true
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

// fylder output feltet med de givne koordinater
const updateOutputField = (_coords) => {
    isLoading.value = true // viser et animeret loader ikon.
    setTimeout(() => {
        isLoading.value = false
        output1.value = _coords[0]
        output2.value = _coords[1]
        output3.value = _coords[2]
    }, 200)
}

const error = err => {
    emit('error-occurred', true, err)
    setTimeout(() => {
        emit('error-occurred', false)
    }, 4000)
}

const setOutput3D = async () => {
    store.dispatch('trans/get', props.inputCRS + '/' + outputCRS.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1] + ',' + props.inputCoords[2])
    .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
            error(output.message)
            return
        }
        outputCoords.value[0] = parseFloat(output.v1)
        outputCoords.value[1] = parseFloat(output.v2)
        outputCoords.value[2] = parseFloat(output.v3)
        updateOutputField(Formatter.formatCoordinates(outputCoords.value, format.value, props.inputIs3D))
    })
}

const setOutput2D = async () => {
    store.dispatch('trans/get', props.inputCRS + '/' + outputCRS.value + '/' + props.inputCoords[0] + ',' + props.inputCoords[1])
    .then(() => {
        const output = store.state.trans.data
        if (output.message !== undefined) {
            error(output.message)
            return
        }
        outputCoords.value[0] = parseFloat(output.v1)
        outputCoords.value[1] = parseFloat(output.v2)
        outputCoords.value[2] = null
        updateOutputField(Formatter.formatCoordinates(outputCoords.value, format.value, props.inputIs3D))
    })
}

const transform = () => {
    if (props.inputCRS === outputCRS.value) {
        setOutputDirect()
    }
    if (props.inputIs3D && outputIs3D.value) {
        setOutput3D()
    } else {
        setOutput2D()
    }
}

const setOutputDirect = () => {
    outputCoords.value[0] = props.inputCoords[0]
    outputCoords.value[1] = props.inputCoords[1]
    if (props.inputIs3D && outputIs3D.value) {
        outputCoords.value[2] = props.inputCoords[2]
    } else {
        outputCoords.value[2] = null
    }
    updateOutputField(Formatter.formatCoordinates(outputCoords.value, format.value, props.inputIs3D))
}

// Holder øje med inputkoordinaterne og transformerer kun,
// hvis der også er valgt en EPSG-kode for outputtet.
// Når først det er valgt én gang, transformerer den derefter frit.
watch(() => props.inputCoords, () => {
    if (outputSelected.value) {
        transform()
    }
})
watch(format, () => {
    updateOutputField(Formatter.formatCoordinates(outputCoords.value, format.value, props.inputIs3D))
})
</script>

<style lang="scss">
.info-icon {
    border: var(--dark-steel) solid 1px;
    border-radius: 25px;
    background: var(--hvid);
    margin-left: 0.5rem;
}

.output-card {
    border-radius: 0 0 0 0;
    border-top: none;
}

.info-popup {
    position: relative;
    flex-grow: 1;
    
    .popup-text {
        background-color: var(--hvid);
        border: 1px solid var(--dark-steel);
        position: absolute;
        width: 20vw;
        padding: 10px;
        border-radius: 10px;
        margin: 0 2rem 0 0.5rem;
    }
}
.output-card {
    background-color: var(--lys-steel);
    border-radius: 0px, 25px, 25px, 0px;
    padding: 1rem 1.5rem;
}
.transformed-coordinates {
    background-color: var(--hvid);
    padding-left: 0.5rem;
    width: 98.75%;
    height: 2rem;
    display: flex;
    align-items: center;
    border: var(--dark-steel) solid 1px;
}

.transformed-coordinates.hasTransformed {
    background-color: var(--aktion);
    color: var(--white);
}
.transformed-coordinates::selection {
    background: var(--highlight);
}
.output-coordinates {
    display: inline-flex;
    margin-right: 0.25rem;
}
.copy-btn {
    background-color: var(--lys-steel); 
    color: var(--dark-steel); 
    border: var(--dark-steel) solid 1px; 
    border-radius: 25px;
    float: right;
    padding: 0.3rem 1rem;
    display: inline-flex;
    align-items: center;
}
.copy-btn.hasTransformed {
    background-color: var(--aktion);
    color: var(--hvid);
}

.radio-label {
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
.OutputTitle{
    color: var(--sort)
}
.radiogroup {
    display: inline-flex;
    flex-wrap: nowrap;
}
</style>
