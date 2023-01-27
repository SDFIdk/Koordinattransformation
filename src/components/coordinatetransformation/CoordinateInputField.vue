<template>
  <span class="coordinate-input first-input" :class="{isDegreesInput: epsgIsDegrees, isMetersInput: !epsgIsDegrees}">
    <ArrowIcon v-if="epsgIsDegrees"
      style="width: 30px; height: 30px;" :color="colors.turquoise" :stroke-width="0" class="arrow-icon" />
    <ArrowIcon v-else
      style="transform: rotate(90deg); width: 30px; height: 30px;" :color="colors.turquoise" :stroke-width="0" class="arrow-icon" />

    <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}">
      <input
        class="coordinates"
        :class="{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}"
        step="0.0001"
        v-model=degrees[0]
      />
      <span class="unit" v-show="epsgIsDegrees">°N</span>
      <span class="unit" v-show="!epsgIsDegrees">m</span>
    </span>
    <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}" v-show="epsgIsDegrees && (minutesChecked || secondsChecked)">
      <input
        class="coordinates"
        :class="{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}"
        v-model=minutes[0]
        step="0.0001"
      />
      <span class="degrees">'</span>
    </span>
    <span class="chosen-coordinates" :class="{degreesInput: epsgIsDegrees}" v-show="epsgIsDegrees && secondsChecked">
      <input
        class="coordinates"
        :class="{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}"
        v-model=seconds[0]
        step="0.0001"
      />
      <span class="degrees">"</span>
    </span>
  </span>
</template>

<script setup>
import ArrowIcon from '../shared/icons/ArrowIcon.vue';

const props = defineProps({
  epsgIsDegrees: {
    type: Boolean,
    default () { return false }
  },
  value: {
    type: String,
    default () { return 'nothing here.'}
  }
})

</script>

<style scoped>
* {
  border: solid 1px red;
}
input {
  appearance: textfield;
  -moz-appearance: textfield;
  border: none;
  width: 100%;
}

.isMetersInput {
  width: 33%;
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
}

/* TODO: implement these */
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}
.arrow-icon-z-coordinate {
  transform: rotate(45deg);
}
.arrow-icon-x-coordinate {
  transform: rotate(90deg);
}

.chosen-coordinates {
  border-bottom: var(--action) solid 1px;
  display: inline-flex;
  flex: 1;
  width: 10%;
  margin-right: 0.5rem;
  padding-bottom: 0.25rem;
}
</style>