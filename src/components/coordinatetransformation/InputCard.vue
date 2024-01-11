<template >
    <div class="input-card">
        <section>
            <h3>Input</h3>

            <CrsSelector :inOrOut="'in'" @crs-selected="inputCrsChanged"/>
            
            <div class="coordinate-fields">
                <!-- input til første koordinat (kan indeholde 3 separate felter) -->
                <CoordinateInputField
                @coords-changed="emit('input-coords-changed', inputCoords)"
                :unit="northDegreeUnit"
                :epsgIsDegrees="crsIsDegrees"
                :degrees="degrees"
                :minutes="minutes"
                :seconds="seconds"
                :element="0"
                :format="format"
                />
                
                <!-- input til andet koordinat (kan indeholde 3 separate felter) -->
                <CoordinateInputField
                    @coords-changed="emit('input-coords-changed', inputCoords)"
                    :unit="eastDegreeUnit"
                    :epsgIsDegrees="crsIsDegrees"
                    :degrees="degrees"
                    :minutes="minutes"
                    :seconds="seconds"
                    :element="1"
                    :format="format"
                />
                
                <!-- Input til højdekote, vises kun, hvis CRS er 3D -->
                <span 
                    :class="{
                        isDegreesInput: crsIsDegrees,
                        isMetresInput: !crsIsDegrees
                    }"
                    v-show = "is3D">
                    <ArrowIcon :direction="'angle'"/>
                    <span class="height-field">
                        <input
                            :class="{degreesInput: false}"
                            v-model=heightInMeters
                            step="0.0001"
                        />
                        m
                    </span>
                </span>
            </div>
            
            <div class="footer">
                <!-- DAWA -->
                <div class="searchbar">
                    <input class="searchbar-input" id="dawa-autocomplete-input" name="dawa-autocomplete-input"/>
                    <SearchIcon/>
                </div>
                <!-- DMS selector, bør komme i sin egen komponent -->
                <div class="radiogroup" v-show="crsIsDegrees">
                    <input class="dms-radio" type="radio" 
                        v-model="format" 
                        value="degrees">
                    <label for="degrees" class="radioLabel"> DD </label>
    
                    <input class="dms-radio" type="radio"
                        v-model="format" 
                        value="minutes">
                    <label for="minutes" class="radioLabel"> min. </label>
                    
                    <input class="dms-radio" type="radio" 
                        v-model="format" 
                        value="seconds">
                    <label for="seconds" class="radioLabel"> min. sek. </label>
                    
                    <!-- TODO: fix this -->
                    <InfoIcon 
                        @mouseenter="hover = true"
                        @mouseleave="hover = false"/>
    
                    <div class="info-text-container">
                        <Transition>
                            <p class="info-text" v-if="hover">Repræsentation af geografiske koordinater, vælg mellem decimalgrader, grader og decimalminutter eller grader, minutter og sekunder.</p>
                        </Transition>
                    </div>
                </div>
            </div>
        </section>
    </div>
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

import { dawaAutocomplete } from 'dawa-autocomplete2'
import CrsSelector from './CrsSelector.vue'
import CoordinateInputField from './CoordinateInputField.vue'

import ArrowIcon from '../shared/icons/ArrowIcon.vue'
import SearchIcon from '../shared/icons/SearchIcon.vue'
import InfoIcon from '../shared/icons/InfoIcon.vue'

const mapMarkerInputCoords = inject('mapMarkerInputCoords')
const inputCoords = ref(mapMarkerInputCoords.value)
const inputCRS = ref('')
const store = useStore()

const northDegreeUnit = "°N"
const eastDegreeUnit = "°E"

const format = ref('meters') // koordinater kan være i meter, grader, grader+minutter, grader+minutter+sekunder

// DMS
const degrees = ref([0, 0])
const minutes = ref([0, 0])
const seconds = ref([0, 0])
const heightInMeters = ref(0)

const is3D = ref(true)
const crsIsDegrees = ref(false)
const addressSelected = ref('')

const emit = defineEmits([
    'input-epsg-changed',
    'error-occurred',
    'input-coords-changed',
    'is-3d-changed',
    'toggled-dropdown'
])

/**
 * Tranformation af inputkoordinaterne, når brugeren vælger ny CRS
 */
const inputCrsChanged = (code) => {
    updateUnits(code)
    // 3D eller 2D?
    is3D.value = code.v3 !== null
    if (is3D.value) {
        store.dispatch('trans/get', inputCRS.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1])
        .then(() => {
            const output = store.state.trans.data
            if (output.message !== undefined) {
                error(output.message)
                return
            }
            inputCRS.value = code.srid
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
        store.dispatch('trans/get', inputCRS.value + '/' + code.srid + '/' + inputCoords.value[0] + ',' + inputCoords.value[1])
        .then(() => {
            const output = store.state.trans.data
            if (output.message !== undefined) {
                error(output.message)
                return
            }
            inputCRS.value = code.srid
            inputCoords.value[0] = output.v1.toString().replace(',', '.')
            inputCoords.value[1] = output.v2.toString().replace(',', '.')
            emit('input-epsg-changed', code)
            setInput()
        })
    }
}

// opdater enheder, når der vælges en crs.
const updateUnits = (code) => {
    if (code.v1_unit === 'degree') {
        crsIsDegrees.value = true
        format.value = 'degrees'
    } else {
        crsIsDegrees.value = false
        format.value = 'meters'
    }
}

// Smuksering af inputkoordinaterne i de tre til syv tastefelter
const setInput = () => {
    if (!crsIsDegrees.value) {
        const deg0 = parseFloat(inputCoords.value[0]).toFixed(4)
        const deg1 = parseFloat(inputCoords.value[1]).toFixed(4)

        degrees.value[0] = deg0
        degrees.value[1] = deg1
    }
    else if (!crsIsDegrees.value || format.value == 'degrees') {
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
 * Henter koordinaterne for en given adresse igennem DAWA
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
            store.dispatch('trans/get', 'EPSG:4258/' + inputCRS.value + '/' + coords[1] + ',' + coords[0] + ',' + heightInMeters.value)
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
            store.dispatch('trans/get', 'EPSG:4258/' + inputCRS.value + '/' + coords[1] + ',' + coords[0])
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
    inputCRS.value = inject('inputEPSG')
    const inputElm = document.getElementById('dawa-autocomplete-input')

    dawaAutocomplete(inputElm, {
        select: (selected) => {
            addressSelected.value = selected.tekst
            // Tranformation efter valgt addresse
            getCoordsFromAdress(addressSelected.value)
        }
    })
    setInput()
})

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

<style lang="scss">
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.input-card {
    background-color: var(--hvid);
    border-bottom: var(--aktion) solid 2px;
    border-radius: 25px 25px 0 0;
    position: relative;
    background: var(--hvid);
    padding: 1rem 1.5rem;
    border-right: none;
}


.height-field {
    display: inline-flex;
    border: none;
    border-bottom: 1px solid var(--aktion);
    flex: 1;
    width: 10%;
    margin-bottom: -.3rem;
    margin-right: 0.5rem;
    
    input {
        border: none;
    }
}

.searchbar-input {
    -moz-appearance: textfield;
    appearance: textfield;
    border: none;
    width: 100%;
}

input:focus {
    outline: none;
}

.searchbar {
    border: 1px solid var(--dark-steel);
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 0.5rem;
    border-radius: 16px;
    flex-grow: 1;
    padding: 0rem 0.75rem 0.1rem 1rem;
}

.radiogroup {
    display: inline-flex;
    flex-wrap: nowrap;
    
    .radioLabel {
        display: inline-flex;
        white-space: nowrap;
    }
    input[type="radio"] {
        transform: scale(.8);
        display: inline-flex;
    }
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
