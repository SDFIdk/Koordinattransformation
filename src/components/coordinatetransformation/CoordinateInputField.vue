<template>
    <span
        class="coordinate-fields"
        :class="{
            isDegreesInput: props.epsgIsDegrees,
            isMetresInput: !props.epsgIsDegrees
        }">
        <ArrowIcon :direction="arrowDirection()"/>
        
        <span class="input-field"
            :class="{degreesInput: epsgIsDegrees}">
            <form action=""></form>
            <input id="degreesInput"
                class="coordinates"
                :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
                step="0.0001"
                v-model=props.degrees[element]
                @input="validateDegrees"
            />
            <span class="unit" v-show="props.epsgIsDegrees"> {{ props.direction }} </span>
            <span class="unit" v-show="!props.epsgIsDegrees">m</span>
        </span>

        <span class="input-field"
            :class="{degreesInput: epsgIsDegrees}"
            v-show="props.epsgIsDegrees && (props.minutesChecked || props.secondsChecked)">
            <input id="minutesInput"
                class="coordinates"
                :class="{degreesInput: degreesChecked, metresInput: minutesChecked, secondsInput: secondsChecked}"
                v-model=props.minutes[element]
                step="0.0001"
                @input="validateMinutes"
            />
            <span class="degrees">'</span>
        </span>

        <span class="input-field" :class="{degreesInput: props.epsgIsDegrees}" v-show="props.epsgIsDegrees && secondsChecked">
            <input id="secondsInput"
                class="coordinates"
                :class="{degreesInput: props.degreesChecked, metresInput: props.minutesChecked, secondsInput: props.secondsChecked}"
                v-model=props.seconds[element]
                step="0.0001"
                @input="validateSeconds"
            />
            <span class="degrees">"</span>
        </span>
    </span>
</template>

<script setup>
import { onUpdated, ref } from 'vue';
import ArrowIcon from '../shared/icons/ArrowIcon.vue';


const props = defineProps({
    unit: String,
    epsgIsDegrees: Boolean,
    degrees: [],
    minutes: [],
    seconds: [],
    element: Number,
    degreesChecked: Boolean,
    minutesChecked: Boolean,
    secondsChecked: Boolean
})

const emit = defineEmits([
    'coords-changed'
])

const arrowDirection = () => {
    let direction = ''

    if      (props.epsgIsDegrees && props.element == 0)     { direction = 'right' }
    else if (props.epsgIsDegrees && props.element == 1)     { direction = 'up' }    
    else if (!props.epsgIsDegrees && props.element == 0)    { direction = 'up' }
    else if (!props.epsgIsDegrees && props.element == 1)    { direction = 'right' }
    return direction
}

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

<style scoped>
.input-field {
    border-bottom: var(--action) solid 1px;
    display: inline-flex;
    flex: 1;
    width: 10%;
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
.arrow-icon-x-coordinate {
    transform: rotate(90deg);
}
.arrow-icon-z-coordinate {
    transform: rotate(45deg);
}
.arrow-icon-y-coordinate {
    transform: rotate(90deg);
}
</style>