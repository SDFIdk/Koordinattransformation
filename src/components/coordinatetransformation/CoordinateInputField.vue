<template>
  <div class="coordinate-input first-input" :class="{isDegreesInput: epsgIsDegrees, isMetresInput: !epsgIsDegrees}">
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
  </div>
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