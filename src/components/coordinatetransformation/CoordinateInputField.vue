<template>
    <span
        class="coordinate-fields"
        :class="{
            isDegreesInput: props.CrsIsDegrees,
            isMetresInput: !props.CrsIsDegrees
        }">
        <ArrowIcon :direction="getArrowDirection()"/>
        
        <span 
            class="input-segment" 
            :class="{degreesInput: CrsIsDegrees}">
            
            <input name="degrees-input"
                aria-label="degrees-input"
                class="coordinate-input"
                :class="{degreesInput: format == 'degrees', metresInput: format == 'minutes', secondsInput: format == 'seconds'}"
                step="0.0001"
                v-model=props.degrees[element]
                @input="validateDegrees"
            />
            
            <span class="unit" v-show="props.CrsIsDegrees"> {{ props.direction }} </span>
            <span class="unit" v-show="!props.CrsIsDegrees">m</span>
        </span>

        <span class="input-segment"
            :class="{degreesInput: CrsIsDegrees}"
            v-show="props.CrsIsDegrees && (format == 'minutes' || format == 'seconds')">
            <input id="minutesInput"
                class="coordinate-input"
                :class="{degreesInput: format == 'degrees', metresInput: format == 'minutes', secondsInput: format == 'seconds'}"
                v-model=props.minutes[element]
                step="0.0001"
                @input="validateMinutes"
            />
            <span class="degrees">'</span>
        </span>

        <span class="input-segment" :class="{degreesInput: props.CrsIsDegrees}" v-show="props.CrsIsDegrees && format == 'seconds'">
            <input id="secondsInput"
                class="coordinate-input"
                :class="{degreesInput: format == 'degrees', metresInput: format == 'minutes', secondsInput: format == 'seconds'}"
                v-model=props.seconds[element]
                step="0.0001"
                @input="validateSeconds"
            />
            <span class="degrees">"</span>
        </span>
    </span>
</template>

<script setup>
/** 
 * En komponent, der indeholder 1 til tre inputs afhængig af, om inputtet er meter, grader, grader+minutter, grader+minutter+sekunder: 
 * meter: 1 input
 * grader: 1 input
 * grader og minutter: 2 inputs
 * grader, minutter og sekunder: 3 inputs.
 */
import { onUpdated, computed } from 'vue';
import ArrowIcon from '../shared/icons/ArrowIcon.vue';


const props = defineProps({
    unit: String,
    CrsIsDegrees: Boolean,
    degrees: [],
    minutes: [],
    seconds: [],
    element: Number, // bruges til at afgøre hvilket inputfelt en given værdi skal ind i.
    format: '' // hvorvidt inputtet er m, d, dm, dms
})
let format = computed(() => props.format)
const emit = defineEmits([
    'coords-changed'
])

const getArrowDirection = () => {
    let direction = ''
    if      (props.CrsIsDegrees && props.element == 0)     { direction = 'right' }
    else if (props.CrsIsDegrees && props.element == 1)     { direction = 'up' }    
    else if (!props.CrsIsDegrees && props.element == 0)    { direction = 'up' }
    else if (!props.CrsIsDegrees && props.element == 1)    { direction = 'right' }
    return direction
}

/**
 * Api'en tager kun punktummer pga. det er sådan koordinater noteres i international tradition.
 * På dansk skriver vi dog gerne kommaer, der hvor international notation ville sætte punktummer.
 * Det skal valideres, hver gang brugeren indtaster en værdi.
 */
const validateDegrees = () => {
    if (props.degrees[0].includes(','))
        props.degrees[0] = props.degrees[0].replace(',', '.')
    if (props.degrees[1].includes(','))
        props.degrees[1] = props.degrees[1].replace(',', '.')
}

const validateMinutes = () => {
    if (props.minutes[0].includes(','))
        props.minutes[0] = props.minutes[0].replace(',', '.')
    if (props.minutes[1].includes(','))
        props.minutes[1] = props.minutes[1].replace(',', '.')
}

const validateSeconds = () => {
    if (props.seconds[0].includes(','))
        props.seconds[0] = props.seconds[0].replace(',', '.')
    if (props.seconds[1].includes(','))
        props.seconds[1] = props.seconds[1].replace(',', '.')
}
onUpdated(() => {
    emit('coords-changed')
})
</script>

<style lang="scss">
.input-segment {
    display: inline-flex;
    flex: 1;
    width: 10%;
    margin-right: 0.5rem;
    padding-bottom: 0.25rem;
    border-bottom: var(--aktion) solid 1px;
    
    .coordinate-input {
        -moz-appearance: textfield;
        appearance: textfield;
        border: none;
        width: 100%;
    }
}
</style>