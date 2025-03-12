<template>
  <div class="KT-output-column">
    <span class="KT-output-coord">
      <p
        id="KT-output"
        class="KT-p"
      >{{ outputCoor || ' ' }}</p>
      <button
        v-if="outputCoor"
        class="KT-cpy"
        title="copy to clipboard"
        @click="ktcopy()"
      >
        <svg><use href="../../../assets/icons/icons.svg#copy" /></svg>
      </button>
    </span>
    <span
      v-if="!isMeter"
      class="KT-radio-row"
    >
      <input
        id="D"
        v-model="degreeFormat"
        type="radio"
        name="outformat"
        value="D"
        checked="checked"
      >
      <label for="D">D</label><br>
      <input
        id="D.min"
        v-model="degreeFormat"
        type="radio"
        name="outformat"
        value="D.min"
      >
      <label for="D.min">D.min </label><br>
      <input
        id="D.min.sec"
        v-model="degreeFormat"
        type="radio"
        name="outformat"
        value="D.min.sec"
      >
      <label for="D.min.sec">D.min.sec</label>
    </span>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useKtStore } from '../../../store/store.js'

const KtStore = useKtStore()

// Get the coordinates from the store
const coorTo = computed(() => KtStore.getCoordinatesTo)
const coorFrom = computed(() => KtStore.getCoordinatesFrom)
const CRSToInfo = computed(() => KtStore.getCRSToDisplayInfo)
const CRSFromInfo = computed(() => KtStore.getCRSFromDisplayInfo)

const isMeter = ref(true)
const degreeFormat = ref('D')
const c1 = ref({
  cMeter: 0.0,
  cDegree: 0.0,
  cMinute: 0.0,
  cSecond: 0.0,
  dirIndicator: '',
})
const c2 = ref({
  cMeter: 0.0,
  cDegree: 0.0,
  cMinute: 0.0,
  cSecond: 0.0,
  dirIndicator: '',
})
const c3 = ref({
  cMeter: 0.0,
  isHeight: false,
})

const outputCoor = ref('')
const ktcopy = () => {
  navigator.clipboard.writeText(outputCoor.value)
}

const formatOutputCoor = () => {
  isMeter.value = (CRSToInfo.value?.v1_unit ?? '') === 'metre' && (CRSToInfo.value?.v2_unit ?? '') === 'metre'

  c1.value.dirIndicator = (CRSToInfo.value.v1 ?? '') === 'Breddegrad' ? 'N' : 'm'
  c2.value.dirIndicator = (CRSToInfo.value.v2 ?? '') === 'Længdegrad' ? 'E' : 'm'
  //only add height if both have height attribute
  c3.value.isHeight = Boolean(CRSToInfo.value.v3) && Boolean(CRSFromInfo.value.v3)
}

const toRepresentation = () => {
  let d1, d2, m1, m2, s1, s2
  if(isMeter.value){
    c1.value.cMeter = parseFloat(coorTo.value.v1).toFixed(4)
    c2.value.cMeter = parseFloat(coorTo.value.v2).toFixed(4)
  }
  else{
    switch (degreeFormat.value) {
    case 'D': 
      c1.value.cDegree = parseFloat(coorTo.value.v1).toFixed(8)
      c2.value.cDegree = parseFloat(coorTo.value.v2).toFixed(8)
      break
    case 'D.min':
      d1 = Math.floor(coorTo.value.v1)
      d2 = Math.floor(coorTo.value.v2)

      m1 = parseFloat(((coorTo.value.v1 - d1) * 60)).toFixed(6)
      m2 = parseFloat(((coorTo.value.v2 - d2) * 60)).toFixed(6)

      c1.value.cDegree = d1
      c1.value.cMinute = m1

      c2.value.cDegree = d2
      c2.value.cMinute = m2
      break
    case 'D.min.sec':
      d1 = Math.floor(coorTo.value.v1)
      d2 = Math.floor(coorTo.value.v2)

      m1 = Math.floor((coorTo.value.v1 - d1) * 60)
      m2 = Math.floor((coorTo.value.v2 - d2) * 60)

      s1 = ((coorTo.value.v1 - d1 - m1 / 60) * 3600).toFixed(4)
      s2 = ((coorTo.value.v2 - d2 - m2 / 60) * 3600).toFixed(4)

      c1.value.cDegree = d1
      c1.value.cMinute = m1
      c1.value.cSecond = s1

      c2.value.cDegree = d2
      c2.value.cMinute = m2
      c2.value.cSecond = s2
      break
    }
  }

  c3.value.cMeter = c3.value.isHeight && coorTo.value.v3 ? parseFloat(coorTo.value.v3).toFixed(4) : 0.0
}

const toStringRepr = () => {
  let coord1, coord2, height
  if (isMeter.value) {
    coord1 = `${c1.value.cMeter}${c1.value.dirIndicator}`
    coord2 = `${c2.value.cMeter}${c2.value.dirIndicator}`
    
  }
  else{
    switch(degreeFormat.value) {
    case 'D' :
      coord1 = `${c1.value.cDegree}${c1.value.dirIndicator}`
      coord2 = `${c2.value.cDegree}${c2.value.dirIndicator}`
      break
    case 'D.min':
      coord1 = `${c1.value.cDegree}° ${c1.value.cMeter} \'${c1.value.dirIndicator}`
      coord2 = `${c2.value.cDegree}° ${c2.value.cMeter} \'${c2.value.dirIndicator}`
      break
    case 'D.min.sec' :
      coord1 = `${c1.value.cDegree}° ${c1.value.cMeter}\' ${c1.value.cSecond}\'\'${c1.value.dirIndicator}`
      coord2 = `${c2.value.cDegree}° ${c2.value.cMeter}\' ${c2.value.cSecond}\'\'${c2.value.dirIndicator}`
      break
    }
  }
  height = c3.value.isHeight ? `, ${c3.value.cMeter} m` : ''
  outputCoor.value = `${coord1}, ${coord2}${height}`
}
// Watchers for changes in input/output coordinates
watch(CRSToInfo, () => {
  formatOutputCoor()
})
watch(CRSFromInfo, () => {
  formatOutputCoor()
})
watch(coorFrom, () => {
  KtStore.setCoordinatesTo()
})
watch(coorTo, () => {
  toRepresentation()
  toStringRepr()
})
watch(degreeFormat, () => {
  toRepresentation()
  toStringRepr()
})
</script>

<style scoped>
.KT-output-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.KT-output-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1rem;
  max-width: 100%;
  max-height: 2.5rem;
  margin-top: 0.5rem;
  justify-content: flex-start;
}
.KT-radio-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 0.5rem;
  justify-content: flex-end;
}
.KT-output-coord,
.KT-cpy, 
.KT-p {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-bottom: 0;
  padding-bottom: 0;
  padding-top: 0;
}

.KT-output-coord {
  background-color: var(--c7);
  color: var(--grey1);
  border-radius: 1.2rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
}

.KT-p {
  color: white;
  margin-left: var(--space);
}

</style>
