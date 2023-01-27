<script setup>
// TODO: finish this and implement in inputCard.vue
import { inject, defineProps } from 'vue'

const colors = inject('themeColors')
const props = defineProps({
  units: String
})
</script>

<template>
<div class='input'>
  <span class='first-input' :class='{isDegreesInput: isDegrees, isMetersInput: !isDegrees}'>
    <!-- Ombyt ikoner ved decimalgrader -->
    <Icon v-if='isDegrees'
      icon='ArrowIcon'
      :width='2'
      :height='2'
      :color='colors.turquoise'
      :stroke-width='0'
      class='arrow-icon'
    />
    <Icon v-else
      icon='ArrowIcon'
      :width='2'
      :height='2'
      :color='colors.turquoise'
      :stroke-width='0'
      class='arrow-icon arrow-icon-x-coordinate'
    />
    <span class='chosen-coordinates' :class='{degreesInput: isDegrees}'>
      <input
        class='coordinates'
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        type='number'
        step='0.0001'
        v-model=degrees[0]
      />
      <span class='unit' v-show='isDegrees'> {{ props.units }} </span>
      <span class='unit' v-show='!isDegrees'> {{ props.units }} </span>
    </span>
    <span class='chosen-coordinates' :class='{degreesInput: isDegrees}' v-show='isDegrees && (minutesChecked || secondsChecked)'>
      <input
        class='coordinates'
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        v-model=minutes[0]
        type='number'
        step='0.0001'
      />
      <span class='degrees'>'</span>
    </span>
    <span class='chosen-coordinates' :class='{degreesInput: isDegrees}' v-show='isDegrees && secondsChecked'>
      <input
        class='coordinates'
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        v-model=seconds[0]
        type='number'
        step='0.0001'
      />
      <span class='degrees'>'</span>
    </span>
  </span>
  <span class='second-input' :class='{isDegreesInput: isDegrees, isMetersInput: !isDegrees}'>
    <!-- Ombyt ikoner ved decimalgrader -->
    <Icon v-if='isDegrees'
      icon='ArrowIcon'
      :width='2'
      :height='2'
      :color='colors.turquoise'
      :stroke-width='0'
      class='arrow-icon arrow-icon-x-coordinate'
    />
    <Icon v-else
      icon='ArrowIcon'
      :width='2'
      :height='2'
      :color='colors.turquoise'
      :stroke-width='0'
      class='arrow-icon'
    />
    <span class='chosen-coordinates'>
      <input
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        v-model=degrees[1]
        type='number'
        step='0.0001'
      />
      <span class='degrees' v-show='isDegrees'>°E</span>
    <span class='degrees' v-show='!isDegrees'>m</span>
    </span>
    <span class='chosen-coordinates' v-show='isDegrees && (minutesChecked || secondsChecked)'>
      <input
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        v-model=minutes[1]
        type='number'
        step='0.0001'
      />
      <span class='degrees'>'</span>
    </span>
    <span class='chosen-coordinates' v-show='isDegrees && secondsChecked'>
      <input
        :class='{degreesInput: degreesChecked, metersInput: minutesChecked, secondsInput: secondsChecked}'
        v-model=seconds[1]
        type='number'
        step='0.0001'
      />
      <span class='degrees'>'</span>
    </span>
  </span>
  <span class='third-input' :class='{isDegreesInput: isDegrees, isMetersInput: !isDegrees}' v-show = 'is3D'>
    <Icon
      icon='ArrowIcon'
      :width='2'
      :height='2'
      :color='colors.turquoise'
      :stroke-width='0'
      class='arrow-icon-z-coordinate'
    />
    <span class='chosen-coordinates'>
    <input
      :class='{degreesInput: true}'
      v-model=meters
      type='number'
      step='0.0001'
    />
    <span class='degrees'>m</span>
    </span>
  </span>
</div>
</template>
