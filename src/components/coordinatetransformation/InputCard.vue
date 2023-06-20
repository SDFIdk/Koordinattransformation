<template>
    <section class="input-coordinate">
        <div class="title-bar">
            <h3>Input</h3>
        </div>
        <section class="coordinate-selection-wrapper">
            <select id="epsg-select" @change="inputEPSGChanged">
                <option class="epsg-option" v-for="(code, index) in filteredCRS" :key="index" :value='code' >
                    {{ code.title_short }} ({{ code.srid }})
                </option>
            </select>
        </section>
        <div class="input">
            <CoordinateInputField
                @coords-changed="emit('input-coords-changed', inputCoords)"
                :unit="northDegreeUnit"
                :epsgIsDegrees="epsgIsDegrees"
                :degrees="degrees"
                :minutes="minutes"
                :seconds="seconds"
                :element="0"
                :format="format"
            />

            <CoordinateInputField
                @coords-changed="emit('input-coords-changed', inputCoords)"
                :unit="eastDegreeUnit"
                :epsgIsDegrees="epsgIsDegrees"
                :degrees="degrees"
                :minutes="minutes"
                :seconds="seconds"
                :element="1"
                :format="format"
            />
            
            <span
                class="third-input"
                :class="{
                    isDegreesInput: epsgIsDegrees,
                    isMetresInput: !epsgIsDegrees
                }"
                v-show = "is3D">
                <ArrowIcon :direction="'angle'"/>
                <span class="input-field">
                    <input
                    :class="{degreesInput: true}"
                    v-model=heightInMeters
                    step="0.0001"
                    />
                    <span class="degrees">m</span>
                </span>
            </span>
        </div>

        <div class="footer">
            <div class="searchbar">
                <input class="searchbar-input" id="dawa-autocomplete-input"/>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 19.5L16.5 16.5M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z" stroke="hsl(171,70%,40%)" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="radiogroup" v-show="epsgIsDegrees" :class="{radioGroupDisabled: !epsgIsDegrees}">
                <input v-model="format" value="degrees"
                    type="radio" name="date-format">
                <label for="degrees" class="radio">
                    DD
                </label>

                <input 
                    v-model="format" value="minutes" type="radio" name="date-format">
                <label for="minutes" class="radio">
                    min.
                </label>
                <input v-model="format" value="seconds" 
                    type="radio" name="date-format">
                <label for="seconds" class="radio">
                    min. sek.
                </label>
            </div>
        </div>
    </section>
</template>

<script setup>
/**
 * InputCard er selvsagt komponentet, hvor brugeren vælger en input EPSG-kode og inputkoordinater.
 * Koordinaterne kan tastes manuelt, eller ved at indtaste en addresse i søgefeltet.
 * De kan også nedarves fra Map.vue (og kaldes her 'mapMarkerInputCoords') via inject
 * Det skal emitte til sin forældre CoordinateTransformation, hvis koordinaterne eller EPSG-koden ændres,
 * eller hvis der er sket en transformationsfejl (f.eks. out-of-bounds)
 */
import { ref, inject, onUpdated, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { dawaAutocomplete } from 'dawa-autocomplete2'
import CoordinateInputField from './CoordinateInputField.vue'
import ArrowIcon from '../shared/icons/ArrowIcon.vue'

const mapMarkerInputCoords = inject('mapMarkerInputCoords')
const inputCoords = ref(mapMarkerInputCoords.value)
const inputEPSG = ref('')
const store = useStore()
const route = useRoute()

const northDegreeUnit = "°N"
const eastDegreeUnit = "°E"

const format = ref('meters')

// DMS
const degrees = ref([0, 0])
const minutes = ref([0, 0])
const seconds = ref([0, 0])
const heightInMeters = ref(0)
const is3D = ref(true)
const epsgIsDegrees = ref(false)
const crs = ref([])
const filteredCRS = ref([])
const addressSelected = ref('')

const emit = defineEmits([
    'input-epsg-changed',
    'error-occurred',
    'input-coords-changed',
    'is-3d-changed',
    'toggled-dropdown'
])

const getEpsgCodes = async () => {
    const tempCRS = []
    // Der er forskellige lister for Danmark og Grønland
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
        document.getElementById('epsg-select').value = filteredCRS.value[0].title
    } else if (route.name === 'Greenland') {
        for (let i = 0, iEnd = crs.value.GL.length; i < iEnd; ++i) {
            await store
            .dispatch('CRSInformation/get', crs.value.GL[i])
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
        document.getElementById('epsg-select').value = filteredCRS.value[0].title
    }
}

/**
 * UTranformation af inputkoordinaterne, når brugeren vælger ny EPSG
 * @param code
 */
const inputEPSGChanged = (event) => {
    const code = event.target.selectedOptions[0]._value
    // check units. Er de grader eller meter
    if (code.v1_unit === 'degree') {
        epsgIsDegrees.value = true
        format.value = 'degrees'
    } else {
        epsgIsDegrees.value = false
        format.value = 'meters'
    }
    // 3D eller 2D?
    is3D.value = code.v3 !== null
    if (is3D.value) {
        store.dispatch('trans/get', inputEPSG.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1])
        .then(() => {
            const output = store.state.trans.data
            if (output.message !== undefined) {
                error(output.message)
                return
            }
            inputEPSG.value = code.srid
            inputCoords.value[0] = output.v1
            inputCoords.value[1] = output.v2
            inputCoords.value[2] = output.v3
            // Vi formaterer inputtet, så det ser pænt ud,
            // og gør CoordinateTransformation opmærksom på ændringen
            // så den kan fortælle Map samt Output om den nye EPSG-kode.
            setInput()
            emit('input-epsg-changed', code)
        })
    } else {
        store.dispatch('trans/get', inputEPSG.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1])
        .then(() => {
            const output = store.state.trans.data
            if (output.message !== undefined) {
                error(output.message)
                return
            }
            inputEPSG.value = code.srid
            inputCoords.value[0] = output.v1.toString().replace(',', '.')
            inputCoords.value[1] = output.v2.toString().replace(',', '.')
            emit('input-epsg-changed', code)
            setInput()
        })
    }
}

// Smuksering af inputkoordinaterne i de tre til syv tastefelter
const setInput = () => {
    if (!epsgIsDegrees.value) {
        const deg0 = parseFloat(inputCoords.value[0]).toFixed(4)
        const deg1 = parseFloat(inputCoords.value[1]).toFixed(4)

        degrees.value[0] = deg0
        degrees.value[1] = deg1
    }
    else if (!epsgIsDegrees.value || format.value == 'degrees') {
        const deg0 = parseFloat(inputCoords.value[0]).toFixed(8)
        const deg1 = parseFloat(inputCoords.value[1]).toFixed(8)

        degrees.value[0] = deg0
        degrees.value[1] = deg1
    } else if (format.value == 'minutes') {
        const deg0 = Math.floor(inputCoords.value[0])
        const deg1 = Math.floor(inputCoords.value[1])

        const min0 = parseFloat(((inputCoords.value[0] - deg0) * 60)).toFixed(6)
        const min1 = parseFloat(((inputCoords.value[1] - deg1) * 60)).toFixed(6)

        degrees.value[0] = deg0
        degrees.value[1] = deg1
        minutes.value[0] = min0
        minutes.value[1] = min1
    } else if (format.value == 'seconds') {
        const deg0 = Math.floor(inputCoords.value[0])
        const deg1 = Math.floor(inputCoords.value[1])

        const min0 = Math.floor((inputCoords.value[0] - deg0) * 60)
        const min1 = Math.floor((inputCoords.value[1] - deg1) * 60)

        const sec0 = parseFloat(((inputCoords.value[0] - deg0 - min0 / 60) * 3600)).toFixed(4)
        const sec1 = parseFloat(((inputCoords.value[1] - deg1 - min1 / 60) * 3600)).toFixed(4)

        degrees.value[0] = deg0
        degrees.value[1] = deg1
        minutes.value[0] = min0
        minutes.value[1] = min1
        seconds.value[0] = sec0
        seconds.value[1] = sec1
    }
}

// Beder CoordinateTransformation om at vise en fejlmeddelselse
// med beskeden 'err' i tre sekunder.
const error = err => {
    emit('error-occurred', true, err)
    setTimeout(() => {
        emit('error-occurred', false)
    }, 3000)
}

/**
 * Henter koordinaterne for en given adresse,
 * sætter nålen på kortet
 * og foretager en transformation
 * @param url
 */
const getCoordsFromAdress = async (location) => {
    return fetch('https://api.dataforsyningen.dk/adresser?q=' + location)
    .then(res => res.json())
    .then(data => data[0].adgangsadresse.vejpunkt.koordinater)
    .then(coords => {
        if (is3D.value) {
            store.dispatch('trans/get', 'EPSG:4258/' + inputEPSG.value + '/' + coords[1] + ',' + coords[0] + ',' + heightInMeters.value)
            .then(() => {
                const output = store.state.trans.data
                // Abort hvis fejl
                if (output.message !== undefined) {
                    error(output.message)
                    return
                }
                inputCoords.value[0] = output.v1
                inputCoords.value[1] = output.v2
                inputCoords.value[2] = output.v3
                setInput()
                emit('input-coords-changed', [inputCoords.value[0].toString().replace(',', '.'), inputCoords.value[1].toString().replace(',', '.'), inputCoords.value[2].toString().replace(',', '.')])
            })
        } else {
            store.dispatch('trans/get', 'EPSG:4258/' + inputEPSG.value + '/' + coords[1] + ',' + coords[0])
            .then(() => {
                const output = store.state.trans.data
                if (output.message !== undefined) {
                    error(output.message)
                    return
                }
                inputCoords.value[0] = output.v1
                inputCoords.value[1] = output.v2
                setInput()
                emit('input-coords-changed', [inputCoords.value[0].toString().replace(',', '.'), inputCoords.value[1].toString().replace(',', '.'), inputCoords.value[2]].toString().replace(',', '.'))
            })
        }
    })
}

onMounted(() => {
    // Søgefeltet til indtastning af addresser (DAWA)
    inputEPSG.value = inject('inputEPSG')
    const inputElm = document.getElementById('dawa-autocomplete-input')

    dawaAutocomplete(inputElm, {
        select: (selected) => {
            addressSelected.value = selected.tekst
            // Tranformation efter valgt addresse
            getCoordsFromAdress(addressSelected.value)
        }
    })
    store.dispatch('CRS/clear')
    store.dispatch('CRS/get', '')
    .then(() => {
        crs.value = store.state.CRS.data
        getEpsgCodes()
    })
})
setInput()

// Hold øje med kortmarkørens placering,
// så inputkoordinaterne kan opdateres.
watch(mapMarkerInputCoords, () => {
    inputCoords.value = mapMarkerInputCoords.value
    setInput()
})

// Hold øje med de tastefelterne til inputkoordinater,
// skulle brugeren vælge at indtaste koordinaterne manuelt.
watch([degrees.value, minutes.value, seconds.value], () => {
    // Sørg for at lade koordinaterne være tal og aldrig bogstaver
    let v1 = degrees.value[0]
    let v2 = degrees.value[1]
    if (format.value == 'minutes' || format.value == 'seconds') {
        v1 += minutes.value[0] / 60
        v2 += minutes.value[1] / 60
    }
    if (format.value == 'seconds') {
        v1 += seconds.value[0] / 3600
        v2 += seconds.value[1] / 3600
    }
    inputCoords.value = [v1, v2, heightInMeters.value]
})

// Højdeparameteren til 3D-projektering er særskildt.
watch(heightInMeters, () => {
    inputCoords.value = [inputCoords.value[0], inputCoords.value[1], heightInMeters.value]
})

// Gør CoordinateTransformation opmærksom på ændringer i inputkoordinaterne,
// og om hvorvidt input EPGS-koden er i 3D eller 2D.
onUpdated(() => {
    emit('is-3d-changed', is3D.value)
    emit('input-coords-changed', inputCoords.value)
})
</script>

<style scoped lang="scss">
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.input-field {
    border-bottom: var(--action) solid 1px;
    display: inline-flex;
    flex: 1;
    width: 10%;
    margin-bottom: -.5rem;
    margin-right: 0.5rem;
    padding-bottom: 0.25rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input {
    -moz-appearance: textfield;
    appearance: textfield;
    border: none;
    width: 100%;
}

#epsg-select {
    padding-left: 20px;
    width: 100%;
    height: 2.5rem;
    border-radius: 30px;
    border-color: var(--darkSteel);
}

.coordinate-selection-wrapper {
    margin: 1rem 0;
}
.title-bar {
    display: inline-flex;
    align-items: center;
    margin-bottom: 0.5rem;
    width: 100%;
}
input:focus {
    outline: none;
}
.hide {
    margin: 0 0 0 auto;
}
.info-icon {
    border: var(--darkSteel) solid 1px;
    border-radius: 25px;
    margin: 0 0 0 auto;
    transform: rotate(90deg);
}
li {
    list-style-type: none;
    margin: 0;
    border-bottom: var(--action) solid 1px;
}
li:hover {
    background-color: var(--action);
}
ul {
    list-style-type: none;
}

.searchbar {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 0.5rem;
    border: var(--darkSteel) solid 1px;
    border-radius: 16px;
    flex-grow: 1;
    padding: 0rem 0.75rem 0.1rem 1rem;
}

.radio {
    display: inline-flex;
    white-space: nowrap;
}
input[type="radio"] {
    transform: scale(.8);
    display: inline-flex;
}

.radiogroup {
    display: inline-flex;
    flex-wrap: nowrap;
}
.radioGroupDisabled {
    pointer-events: none;
}
.footer {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
}
.isDegreesInput {
    margin-top: 0.25rem;
    display: inline-flex;
    align-items: center;
    width: 100%;
}
.isMetresInput {
    width: 33%;
}
.isMetresInput {
    margin-top: 0.25rem;
    display: inline-flex;
    align-items: center;
}
@media screen and (max-width: 1180px) {
    .footer {
        display: inline-flex;
        margin-bottom: 0.5rem;
    }
    .searchbar {
        flex: 1;
    }
}
</style>
