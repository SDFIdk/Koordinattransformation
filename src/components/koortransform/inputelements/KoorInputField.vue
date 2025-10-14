<template>
  <!--
    Note: inputmode="numeric"-attribute on input-fields is required for correct formating of numbers 
    (with dot as seperator instead of)

    Each input field has a dynamically selected format with a specified amount of decimals it should have,
    which is selected from the formats-ref.
  -->
  <div
    v-if="isMeter"
    class="KT-input-meter"
  >
    <span 
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c1.dirIcon" />
      </svg>
      <input 
        id="c1"
        v-model="c1.cMeter"
        class="KT-input"
        type="text"
        title=""
        inputmode="numeric"
        :pattern="format.meterformat"
        aria-label="Input Coordinate One"
        @input="debounceUpdate"
      >
      <p
        id="c1Indicator"
        class="KT-idc"
      > {{ c1.dirIndicator }} </p>

      <p class="KT-tooltip-dir">
        {{ c1.dirText }}
      </p>
    </span>
    <span 
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c2.dirIcon" />
      </svg>
      <input 
        id="c2"
        v-model="c2.cMeter"
        class="KT-input"
        type="text"
        title=""
        inputmode="numeric"
        aria-label="Input Coordinate Two"
        @input="debounceUpdate"
      >
      <p
        id="c2Indicator"
        class="KT-idc"
      > {{ c2.dirIndicator }} </p>
      <p class="KT-tooltip-dir">
        {{ c2.dirText }}
      </p>
    </span>
    <span 
      v-if="c3.isHeight"
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c3.upIcon" />
      </svg>
      <input 
        id="c3"
        v-model="c3.cMeter"
        class="KT-input"
        type="text"
        title=""
        inputmode="numeric"
        aria-label="Input Coordinate Three"
        @input="debounceUpdate"
      >
      <p
        id="c3Indicator"
        class="KT-idc"
      > m </p>
      <p class="KT-tooltip-dir">
        {{ c3.dirText }}
      </p>
    </span>
  </div>

  <div
    v-else
    class="KT-input-column"
  >
    <span 
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c1.dirIcon" />
      </svg>
      <input 
        id="c1D"
        v-model="c1.cDegree"
        type="text"
        title=""
        inputmode="numeric"
        aria-label="Input Coordinate One D.D° or D°"
        @input="debounceUpdate"
      >
      <p
        id="c1degreeIdc"
        class="KT-p KT-push-right"
      >°</p>
      <input 
        v-if="degreeFormat==='DM' || degreeFormat === 'DMS'"
        id="c1Dm"
        v-model="c1.cMinute"
        type="text"
        title=""
        inputmode="numeric"
        aria-label="Input Coordinate Two M' or M.M'"
        @input="debounceUpdate"
      >
      <p
        v-if="degreeFormat==='DM' || degreeFormat === 'DMS'"
        id="c1minuteIdc"
        class="KT-p KT-push-right"
      >'</p>
      <input 
        v-if="degreeFormat === 'DMS'"
        id="c1Dms"
        v-model="c1.cSecond"
        type="text"
        title=""
        inputmode="numeric"
        aria-label="Input Coordinate Two S.S&quot;"
        @input="debounceUpdate"
      >
      <p
        v-if="degreeFormat==='DMS'"
        id="c1secondIdc"
        class="KT-p"
      >"</p>
      <p
        id="c1Indicator"
        class="KT-idc"
      > {{ c1.dirIndicator }} </p>
      <p class="KT-tooltip-dir">
        {{ c1.dirText }}
      </p>
    </span>
    <span 
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c2.dirIcon" />
      </svg>
      <input 
        id="c2D"
        v-model="c2.cDegree"
        class="KT-input"
        type="text"
        title=""
        inputmode="numeric"
        @input="debounceUpdate"
      >
      <p
        id="c2degreeIdc"
        class="KT-p KT-push-right"
      >°</p>
      <input 
        v-if="degreeFormat==='DM' || degreeFormat === 'DMS'"
        id="c2Dm"
        v-model="c2.cMinute"
        type="text"
        title=""
        inputmode="numeric"
        @input="debounceUpdate"
      >
      <p
        v-if="degreeFormat==='DM' || degreeFormat === 'DMS'"
        id="c2minuteIdc"
        class="KT-p KT-push-right"
      >'</p>
      <input 
        v-if="degreeFormat === 'DMS'"
        id="c2Dms"
        v-model="c2.cSecond"
        type="text"
        title=""
        inputmode="numeric"
        @input="debounceUpdate"
      >
      <p
        v-if="degreeFormat==='DMS'"
        id="c2secondIdc"
        class="KT-p"
      >"</p>
      <p
        id="c2Indicator"
        class="KT-idc"
      > {{ c2.dirIndicator }} </p>
      <p class="KT-tooltip-dir">
        {{ c2.dirText }}
      </p>
    </span>
    <span 
      v-if="c3.isHeight"
      class="KT-input-row"
    >
      <svg class="KT-idc">
        <use :href="c3.upIcon" />
      </svg>
      <input 
        id="c3"
        v-model="c3.cMeter"
        type="text"
        title=""
        inputmode="numeric"
        @input="debounceUpdate"
      >
      <p
        id="c3Indicator"
        class="KT-p"
      > m </p>
      <p class="KT-tooltip-dir">
        {{ c3.dirText }}
      </p>
    </span>
  </div>
  <span
    v-if="!isMeter"
    class="KT-radio-row"
  >
    <input
      id="D"
      v-model="degreeFormat"
      type="radio"
      name="format"
      value="D"
      checked="checked"
    >
    <label for="D">DD.DD°</label><br>
    <input
      id="DM"
      v-model="degreeFormat"
      type="radio"
      name="format"
      value="DM"
    >
    <label for="DM">DD° MM.MM'</label><br>
    <input
      id="DMS"
      v-model="degreeFormat"
      type="radio"
      name="format"
      value="DMS"
    >
    <label for="DMS">DD° MM' SS.SS"</label>
    <span
      class="KT-tooltip-icon bg-secondary border-soft"
      :class="{'KT-tooltip-visible' : isVisible}"
      @click="isVisible = !isVisible"
    >
      <svg style="height:0.9rem;"><use href="../../../assets/icons/icons.svg#info" /></svg>
      <p class="KT-tooltip">
        Repræsentationsformat for geografiske koordinater. Vælg mellem decimalgrader (DD.DD°), grader og minutter (DD° MM.MM') eller grader, minutter og sekunder (DD° MM' SS.SS").
      </p>
    </span>
  </span>
  <div
    v-if="route.fullPath==='/Denmark' || route.fullPath==='/'"
    class="KT-gsearch"
  >
    <label for="gSearch">
      <p class="KT-gsearch-el">Søg koordinat via adresse eller stednavn</p>
    </label>
    <g-search
      id="gSearch"
      class="KT-gsearch-el"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useKtStore } from '../../../store/store.js'
import { getGSearchCenterPoint } from '../../../helperfunctions.js'
import { format } from 'ol/coordinate.js'

const KtStore = useKtStore()
const route = useRoute()

const formats = {
  meterformat:/^-?\d+\.\d{1,4}$/,
  degreeformat: /^-?\d+\.\d{1,8}$/,
  minutesformat:/^-?\d+\.\d{1,6}$/,
  secondsformat: /^-?\d+\.\d{1,4}$/,
  noDecimal: /^-?\d+$/
}


const coorFrom = computed(() => KtStore.getCoordinatesFrom)
const CRSInfo = computed(() => KtStore.getCRSFromDisplayInfo)

const svgPath = import.meta.env.VITE_NODE_ENV === 'production' || import.meta.env.VITE_NODE_ENV === 'test' ?  KtStore.getURL + '/icons.svg#' : '/src/assets/icons/icons.svg#' 
const debounceTimeout = ref(null)

const baseCoords  = ref({
  v1: 0.0,
  v2: 0.0,
  v3: 0.0,
  v4: 0.0,
})

const c1 = ref({
  cMeter: 0.0,
  cDegree: 0.0,
  cMinute: 0.0,
  cSecond: 0.0,
  dirIcon: '',
  dirIndicator: '',
  dirText: ''
})
const c2 = ref({
  cMeter: 0.0,
  cDegree: 0.0,
  cMinute: 0.0,
  cSecond: 0.0,
  dirIcon: '',
  dirIndicator: '',
  dirText: ''
})
const c3 = ref({
  cMeter: 0.0,
  isHeight: false,
  upIcon: svgPath + 'arrow-up',
  dirText: ''
})

const isVisible = ref(false)
const isMeter = ref(true)
const degreeFormat = ref('D')

const toFixedCoord = (str, maxDecimal) => {
  const dotIndex = String(str).indexOf('.')
  if(dotIndex === -1) return str
  return parseFloat(String(str).substring(0, dotIndex + maxDecimal + 1))
}

const toRepresentation = () => {

  c3.value.cMeter = baseCoords.value.v3.toFixed(4)

  let d1, d2, m1, m2, s1, s2

  if (isMeter.value) {
    c1.value.cMeter = toFixedCoord(baseCoords.value.v1, 4)
    c2.value.cMeter = toFixedCoord(baseCoords.value.v2, 4)
  } else {
    switch (degreeFormat.value) {
    case 'D': 
      c1.value.cDegree = toFixedCoord(baseCoords.value.v1, 8)
      c2.value.cDegree = toFixedCoord(baseCoords.value.v2, 8)
      break
    case 'DM':
      d1 = Math.floor(baseCoords.value.v1)
      d2 = Math.floor(baseCoords.value.v2)
    
      m1 = toFixedCoord(((baseCoords.value.v1 - d1) * 60).toString(), 6)
      m2 = toFixedCoord((((baseCoords.value.v2 - d2) * 60)).toString(), 6)

      c1.value.cDegree = d1
      c1.value.cMinute = m1

      c2.value.cDegree = d2
      c2.value.cMinute = m2
      break
    case 'DMS':
      d1 = Math.floor(baseCoords.value.v1)
      d2 = Math.floor(baseCoords.value.v2)

      m1 = Math.floor((baseCoords.value.v1 - d1) * 60)
      m2 = Math.floor((baseCoords.value.v2 - d2) * 60)

      s1 = toFixedCoord(((baseCoords.value.v1 - d1 - m1 / 60) * 3600).toString(), 4)
      s2 = toFixedCoord(((baseCoords.value.v2 - d2 - m2 / 60) * 3600).toString(), 4)

      c1.value.cDegree = d1
      c1.value.cMinute = m1
      c1.value.cSecond = s1

      c2.value.cDegree = d2
      c2.value.cMinute = m2
      c2.value.cSecond = s2
      break
    }
  }
}

const fromRepresentation = () => {
  
  if (isMeter.value) {
    baseCoords.value.v1 = parseFloat(c1.value.cMeter)
    baseCoords.value.v2 = parseFloat(c2.value.cMeter)
    baseCoords.value.v3 = parseFloat(c3.value.cMeter)
  } else {
    switch (degreeFormat.value) {
    case 'D': 
      baseCoords.value.v1 = parseFloat(c1.value.cDegree).toFixed(8)
      baseCoords.value.v2 = parseFloat(c2.value.cDegree).toFixed(8)
      baseCoords.value.v3 = parseFloat(c3.value.cMeter)
      break
    case 'DM':
      baseCoords.value.v1 = parseFloat(c1.value.cDegree + c1.value.cMinute / 60).toFixed(8)
      baseCoords.value.v2 = parseFloat(c2.value.cDegree + c2.value.cMinute / 60).toFixed(8)
      baseCoords.value.v3 = parseFloat(c3.value.cMeter)
      break
    case 'DMS':
      baseCoords.value.v1 = parseFloat(c1.value.cDegree + c1.value.cMinute / 60 + c1.value.cSecond / 3600).toFixed(8)
      baseCoords.value.v2 = parseFloat(c2.value.cDegree + c2.value.cMinute / 60 + c2.value.cSecond / 3600).toFixed(8)
      baseCoords.value.v3 = parseFloat(c3.value.cMeter)
      break
    }
  }
}


const formatInputCoor = () => {
  isMeter.value = (CRSInfo.value?.v1_unit ?? '') === 'metre' && (CRSInfo.value?.v2_unit ?? '') === 'metre'
  //if m is missing, something is wrong
  if(isMeter.value){
    c1.value.dirIndicator = 'm'
    c2.value.dirIndicator = 'm'
  }

  switch(CRSInfo.value.v1){
  case 'Easting':
    c1.value.dirIcon = svgPath + 'direction-east'
    break
  case 'Westing':
    c1.value.dirIcon = svgPath + 'direction-west'
    break
  case 'Breddegrad':
    c1.value.dirIcon= svgPath + 'direction-north'
    c1.value.dirIndicator = 'N'
  }

  switch(CRSInfo.value.v2){
  case 'Northing':
    c2.value.dirIcon = svgPath + 'direction-north'
    break
  case 'Længdegrad':
    c2.value.dirIcon = svgPath + 'direction-east'
    c2.value.dirIndicator = 'E'
  }
  switch(CRSInfo.value.v3){
  case 'Kote' : 
    c3.value.isHeight = true
    break
  case 'Ellipsoidehøjde' :
    c3.value.isHeight = true
    break
  default:
    c3.value.isHeight = false
  }

  c1.value.dirText = CRSInfo.value.v1
  c2.value.dirText = CRSInfo.value.v2
  c3.value.dirText = CRSInfo.value.v3
}

const validateCoordinate = (pattern = '', coordinate) => {
  let result
  switch(pattern) {
  case 'meterformat' :
    result = formats.meterformat.test(coordinate)
    break
  case 'degreeformat': 
    result = formats.degreeformat.test(coordinate)
    break
  case 'minutesformat':
    result = formats.minutesformat.test(coordinate)
    break
  case 'secondsformat' :
    result = formats.secondsformat.test(coordinate)
    break
  case 'noDecimal' :
    result = formats.noDecimal.test(coordinate)
    break
  default :
    result = false
    break
  }
  
  if (!result) {
    console.log(`Validation failed - Pattern: ${pattern}, Coordinate: ${coordinate}`)
  }
  
  return result
}

/**
 * 
 * @param pattern 
 */
const validateInput = () => {
  
  //first, we set up our cases
  let match = true

  if(isMeter.value) {
    match = match ? validateCoordinate('meterformat',c1.value.cMeter) && validateCoordinate('meterformat', c1.value.cMeter) : match  
  }
  else {
    switch (degreeFormat.value) {
    case 'D': 
      match = match ? validateCoordinate('degreeformat', c1.value.cDegree) && validateCoordinate('degreeformat', c2.value.cMeter) : match
      break
    case 'DM':
      match = match ? validateCoordinate('nodecimal', c1.value.cDegree) && validateformat('minutesformat', c1.value.cMinute) && validateCoordinate('nodecimal', c2.value.cDegree) && validateformat('minutesformat', c2.value.cMinute) : match
      break
    case 'DMS':
      match = match ? validateCoordinate('nodecimal', c1.value.cDegree) && validateformat('nodecimal', c1.value.cMinute) && validateCoordinate('secondsformat', c1.value.cSecond) && validateCoordinate('nodecimal', c2.value.cDegree) && validateformat('nodecimal', c2.value.cMinute) && validateformat('secondsformat', c2.value.cSecond) : match      
      break
    }

  }
  if(c3.value.isHeight.value) {
    match = match ? validateCoordinate('meterformat', c3.value.cMeter) : match
  }
  return match

}

const debounceUpdate = () => {

  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  if(!validateInput()) {
    console.log('format not accepted')
    return
  }
  //basically, we only update coordinates in store if coordinate is valid input format
  debounceTimeout.value = setTimeout(() => {
    console.log('timeout function called')
    fromRepresentation()
    KtStore.setCoordinatesFrom({
      crs: KtStore.CRSFrom,
      coordinates: baseCoords.value,
    })
  }, 700)
}

watch(CRSInfo, () => {
  formatInputCoor()
})

watch(coorFrom, (to) => {


  baseCoords.value = {
    v1: coorFrom.value.v1 || 0.0,
    v2: coorFrom.value.v2 || 0.0,
    v3: coorFrom.value.v3 || 0.0,
    v4: coorFrom.value.v4 || 0.0,
  }
  toRepresentation()
})

watch(degreeFormat, () => {
  toRepresentation()
})

onMounted(async() => {
  await CRSInfo.value
  baseCoords.value = {
    v1: coorFrom.value.v1 || 0.0,
    v2: coorFrom.value.v2 || 0.0,
    v3: coorFrom.value.v3 || 0.0,
    v4: coorFrom.value.v4 || 0.0,
  }
  formatInputCoor()
  toRepresentation()


  const gSearch = document.querySelector('g-search')
  if (gSearch) {
    gSearch.setAttribute('data-token', import.meta.env.VITE_TOKEN)
    document.querySelector('g-search').addEventListener('gsearch:select', (event) => {
      KtStore.setCoordinatesFrom({
        crs: 'EPSG:25832',
        coordinates: getGSearchCenterPoint(event.detail.geometry)
      })
    })
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const activeItem = document.querySelector('.gs-result-list')
      activeItem.childNodes.forEach((elem) => {
        if(elem.className.includes('active')) {
          elem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      })
    }
  })

})

</script>

<style>

</style>