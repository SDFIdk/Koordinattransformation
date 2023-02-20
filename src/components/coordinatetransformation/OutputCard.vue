<template>
    <section class="output-coordinate">
        <h3>Output</h3>
        <section class="coordinate-selection-wrapper">
            <select :class="{ isSelected: this.outputSelected }" id='epsg-output-select' @change="onEpsgSelect">
                <option value="0" disabled selected>Vælg Koordinatsystem</option>
                <option v-for="(code, index) in filteredOutputCodes" :key="index" :value='code' >
                    {{ code.title_short }} ({{ code.srid }})
                </option>
            </select>
        </section>
        <div class="transformed-coordinates" :class="{ hasTransformed: hasTransformed}">
            <div v-if="isLoading">
                <Loader size="1.5" :isLoading=isLoading />
            </div>
            <div v-else>
                <div class="output-coordinates">{{ output1 }}</div>
                <div class="output-coordinates">{{ output2 }} </div>
                <div class="output-coordinates">{{ output3 }}</div>
            </div>
        </div>
        <article class="footer" :class="{isMetres: isMetres}">
            <div class="radio-and-info-group" v-show="!isMetres">
                <div class="radiogroup" :class="{radioGroupDisabled: isMetres}">
                    <label class="radio" @click="checkDegrees">
                        <input type="radio" name="date-format">
                        DD
                    </label>
                    <label class="radio" @click="checkMinutes">
                        <input type="radio" name="date-format">
                        min.
                    </label>
                    <label class="radio" @click="checkSeconds">
                        <input type="radio" name="date-format">
                    min. sek.
                    </label>
                </div>
                <Icon
                    icon="InfoIcon"
                    :width="1.3"
                    :height="1.3"
                    :color="colors.black"
                    class="info-icon"
                    @mouseenter="hover = true"
                    @mouseleave="hover = false"
                />
                <div class="info-text-container">
                    <Transition>
                        <p class="info-text" v-if="hover">Repræsentation af geografiske koordinater, vælg mellem decimalgrader, grader og decimalminutter eller grader, minutter og sekunder.</p>
                    </Transition>
                </div>
            </div>
            <button class="copy-btn" @click="copyCoordinates" :class="{hasTransformed: hasTransformed && !this.isLoading}">
                Kopiér
                <span v-show="!hasTransformed || isLoading">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.30769 15H6.53846C6.13044 15 5.73912 14.8379 5.4506 14.5494C5.16209 14.2609 5 13.8696 5 13.4615V6.53846C5 6.13044 5.16209 5.73912 5.4506 5.4506C5.73912 5.16209 6.13044 5 6.53846 5H13.4615C13.8696 5 14.2609 5.16209 14.5494 5.4506C14.8379 5.73912 15 6.13044 15 6.53846V7.30769M10.5385 9.00001H17.4615C18.3112 9.00001 19 9.6888 19 10.5385V17.4615C19 18.3112 18.3112 19 17.4615 19H10.5385C9.68879 19 9 18.3112 9 17.4615V10.5385C9 9.6888 9.68879 9.00001 10.5385 9.00001Z" stroke="hsla(186,25%,64%,0.6)" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>

                <span v-show="hasTransformed && !isLoading">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.30769 15H6.53846C6.13044 15 5.73912 14.8379 5.4506 14.5494C5.16209 14.2609 5 13.8696 5 13.4615V6.53846C5 6.13044 5.16209 5.73912 5.4506 5.4506C5.73912 5.16209 6.13044 5 6.53846 5H13.4615C13.8696 5 14.2609 5.16209 14.5494 5.4506C14.8379 5.73912 15 6.13044 15 6.53846V7.30769M10.5385 9.00001H17.4615C18.3112 9.00001 19 9.6888 19 10.5385V17.4615C19 18.3112 18.3112 19 17.4615 19H10.5385C9.68879 19 9 18.3112 9 17.4615V10.5385C9 9.6888 9.68879 9.00001 10.5385 9.00001Z" stroke="hsl(171,70%,55%)" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </button>
        </article>
    </section>
</template>

<script>
/**
 * Ouput foretager den reelle transformation - den er vi er interesseret i
 */
import { defineAsyncComponent, inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Formatter from './Formatting'

export default {
    name: 'OutputCoordinates',

    props: {
        inputEPSG: {
        type: String,
            default () { return '' }
        },

        is3D: {
            type: Boolean, default () { return true }
        },

        inputCoords: {
            type: Array, default () { return inject('mapMarkerInputCoords').value }
        }
    },

    components: {
        Loader: defineAsyncComponent(() => import('@/components/shared/Loader.vue'))
    },

    methods: {
        // En output-EPSG er valgt: Der skal foretages transformation,
        // og brugergrænsefladen opdateres ift. om output EPSG-koden er i meter eller DMS og 2D eller 3D
        onEpsgSelect (event) {
            const code = event.target.selectedOptions[0]._value

            if (code.v1_unit === 'metre') {
                this.isMetres = true
                // TODO: this should hide the radio buttons entirely
                this.disableRadioButtons()
            } else {
                this.isMetres = false
                this.degreesChecked = true
            }

            this.outputSelected = true
            this.outputEPSG = code.srid
            this.hasTransformed = true
            this.transform()
        },

        disableRadioButtons () {
            this.degreesChecked = false
            this.minutesChecked = false
            this.secondsChecked = false
        },

        checkDegrees () {
            if (!this.degreesChecked) {
                this.degreesChecked = true
                this.minutesChecked = false
                this.secondsChecked = false
                this.setTransformInput()
            }
        },

        checkMinutes () {
            if (!this.minutesChecked) {
                this.degreesChecked = false
                this.minutesChecked = true
                this.secondsChecked = false
                this.setTransformInput()
            }
        },

        checkSeconds () {
            if (!this.secondsChecked) {
                this.degreesChecked = false
                this.minutesChecked = false
                this.secondsChecked = true
                this.setTransformInput()
            }
        },

        setTransformInput () {
            if (!this.epsgIsDegrees || this.degreesChecked.value) {
                const deg0 = parseFloat(this.inputCoords[0]).toFixed(4)
                const deg1 = parseFloat(this.inputCoords[1]).toFixed(4)

                this.degrees[0] = deg0
                this.degrees[1] = deg1
            } else if (this.minutesChecked.value) {
                const deg0 = Math.floor(this.inputCoords[0])
                const deg1 = Math.floor(this.inputCoords[1])

                const min0 = parseFloat(((this.inputCoords.value[0] - deg0) * 60).toFixed(4))
                const min1 = parseFloat(((this.inputCoords.value[1] - deg1) * 60).toFixed(4))

                this.degrees.value[0] = deg0
                this.degrees.value[1] = deg1
                this.minutes.value[0] = min0
                this.minutes.value[1] = min1
            } else {
                const deg0 = Math.floor(this.inputCoords.value[0])
                const deg1 = Math.floor(this.inputCoords.value[1])

                const min0 = Math.floor((this.inputCoords.value[0] - deg0) * 60)
                const min1 = Math.floor((this.inputCoords.value[1] - deg1) * 60)

                const sec0 = parseFloat(((this.inputCoords.value[0] - deg0 - min0 / 60) * 3600).toFixed(4))
                const sec1 = parseFloat(((this.inputCoords.value[1] - deg1 - min1 / 60) * 3600).toFixed(4))

                this.degrees.value[0] = deg0
                this.degrees.value[1] = deg1
                this.minutes.value[0] = min0
                this.minutes.value[1] = min1
                this.seconds.value[0] = sec0
                this.seconds.value[1] = sec1
            }
        },

        // Mulighed for at kopiere outputtet efter transformation
        copyCoordinates () {
            if (this.outputSelected && !this.isLoading) {
                navigator.clipboard.writeText(this.output1 + this.output2 + this.output3)
                this.$emit('coordinates-copied', true)
                window.setTimeout(() => {
                    this.$emit('coordinates-copied', false)
                }, 3333)
            }
        }
    },

    watch: {
        // Holder øje med inputkoordinaterne og transformerer kun,
        // hvis der også er valgt en EPSG-kode for outputtet.
        // Når først det er valgt én gang, transformerer den derefter frit.
        inputCoords () {
            if (this.outputSelected) {
                this.transform()
            }
        },

        minutesChecked () {
            this.updateOutputField(this.formatCoordinates(this.outputCoords))
        },
        secondsChecked () {
            this.updateOutputField(this.formatCoordinates(this.outputCoords))
        },
        degreesChecked () {
            this.updateOutputField(this.formatCoordinates(this.outputCoords))
        }
    },

    setup (props, { emit }) {
        const store = useStore()
        const colors = inject('themeColors')
        const outputEPSG = ref('')

        const degreesChecked = ref(false)
        const minutesChecked = ref(false)
        const secondsChecked = ref(false)

        const degrees = ref([0, 0])
        const outputSelected = ref(false)
        const outputCoords = ref([0, 0, 0])
        const output1 = ref('')
        const output2 = ref('')
        const output3 = ref('')
        const hasTransformed = ref(false)
        const isLoading = ref(false)
        const isMetres = ref(true)
        const hover = ref(false)
        const crs = ref([])
        // const EpsgCodes = ref([])
        const filteredOutputCodes = ref([])
        const route = useRoute()

        /** formaterer de givne koordinater på en pæn måde */
        const formatCoordinates = (_coords) => {
            let formattedCoordinates = []

            if (isMetres.value) {
                formattedCoordinates = Formatter.toMetres(_coords)
            } else {
                if (degreesChecked.value) {
                    formattedCoordinates = Formatter.toDegrees(_coords)
                } else if (minutesChecked.value) {
                    formattedCoordinates = Formatter.toDegreesAndMinutes(_coords)
                } else {
                    formattedCoordinates = Formatter.toDegreesMinutesAndSeconds(_coords)
                }
            }
            if (props.is3D) {
                Formatter.appendThirdParameter(formattedCoordinates, _coords[2])
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

        return {
            updateOutputField,
            degrees,
            filteredOutputCodes,
            updateFilteredCodes,
            store,
            colors,
            degreesChecked,
            minutesChecked,
            secondsChecked,
            outputSelected,
            outputCoords,
            outputEPSG,
            hasTransformed,
            isLoading,
            transform,
            formatCoordinates,
            output1,
            output2,
            output3,
            hover,
            isMetres
        }
    }
}
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
input[type="radio"] {
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 50%;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
}

input[type="radio"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em hsl(171,70%,55%);
}

input[type="radio"]:checked::before {
  transform: scale(1);
}
input[type=radio]:checked {
    outline: var(--darkSteel) solid 1px;
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
.copy-icon {
    margin-left: 0.75rem;
}
@media screen and (max-width: 828px) {
    .info-icon {
        display: none;
    }
}
@media screen and (max-width: 703px) {
    .info-icon {
        display: inline;
    }
}
@media screen and (max-width: 410px) {
    .info-icon {
        display: none;
    }
}
</style>
