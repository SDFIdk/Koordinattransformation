<template>
  <div id="map" class="olmap" ref="map">
    <section class="transform-container">
      <CoordinateTransformation
        @input-epsg-changed="inputEPSGChanged"
        @input-coords-changed="inputCoordsChanged"
        :inputCoords=inputCoords
        id="coordinate-transform"
        :mapError="error"
        :mapErrorVisible="errorVisible"
      />
      <div id="mouse-position"></div>
    </section>
    <Icon
      id="pinned-marker"
      icon="MapMarker"
    />
  </div>
</template>

<script setup>
/**
 * Map.vue er kortet
 * Det står for at holde øje med brugerklik på kortet med kortmarkøren
 * og for at opdatere markørens placering, hvis inputkoordinaterne er ændret ved manuel indtastning eller via DAWA
 */
// WMNTS-ting
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { epsg25832proj } from 'skraafoto-saul'
// OpenLayers-ting
import 'ol/ol.css'
import { defineProps, onMounted, ref, defineAsyncComponent, provide } from 'vue'
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Overlay from 'ol/Overlay'
import Zoom from 'ol/control/Zoom'
import { createStringXY } from 'ol/coordinate'
import {
  defaults as defaultControls,
  MousePosition,
  FullScreen
} from 'ol/control'
import { useStore } from 'vuex'

const CoordinateTransformation = defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateTransformation'))

const props = defineProps({
  isDenmark: {
    type: Boolean,
    default () { return true }
  }
})

// Hvis inputkoordinaterne ændres, skal markøren også flyttes
const inputCoordsChanged = (coords) => {
  if (inputEPSG.value !== mapProjection) {
    store.dispatch('trans/get', inputEPSG.value + '/' + mapProjection + '/' + coords[0] + ',' + coords[1])
      .then(() => {
        const output = store.state.trans.data
        const pinnedMarker = document.getElementById('pinned-marker')
        const overlay = new Overlay({
          element: pinnedMarker,
          positioning: 'center-center'
        })
        overlay.setPosition([output.v1, output.v2])
        olMap.value.addOverlay(overlay)
      })
  } else {
    const pinnedMarker = document.getElementById('pinned-marker')
    const overlay = new Overlay({
      element: pinnedMarker,
      positioning: 'center-center'
    })

    overlay.setPosition([coords[0], coords[1]])
    olMap.value.addOverlay(overlay)
  }
}

const setPinMarker = (mpos) => {
  const pinnedMarker = document.getElementById('pinned-marker')
  const overlay = new Overlay({
    element: pinnedMarker,
    positioning: 'center-center'
  })
  overlay.setPosition([parseFloat(mpos[0]), parseFloat(mpos[1])])
  olMap.value.addOverlay(overlay)
}

// Holder øje med hvilken input EPSG-kode vi bruger i øjeblikket
const inputEPSGChanged = (epsg) => {
  inputEPSG.value = epsg
}

const store = useStore()
const olView = ref({})
const olMap = ref({})
let mousePositionControl = ref({})
const center = props.isDenmark ? [587135, 6140617] : [-5758833.2009, 9393681.2087]
const inputCoords = ref([center[0], center[1], 0])
provide('mapMarkerInputCoords', inputCoords)
epsg25832proj(proj4)
register(proj4)
const mapProjection = props.isDenmark ? 'EPSG:25832' : 'EPSG:3857'
const inputEPSG = ref(props.isDenmark ? 'EPSG:25832' : 'EPSG:3178')
const timeout = 500
const error = ref('')
const errorVisible = ref(false)
const defaultZoom = new Zoom({
  duration: 700,
  className: 'custom-zoom',
  zoomInClassName: '-in',
  zoomOutClassName: '-out',
  zoomInLabel: 'Zoom ind2',
  zoomOutLabel: 'Zoom ud2',
  zoomInTipLabel: 'Zoom2',
  zoomOutTipLabel: 'Zoom2'
})

// Vores eget kort (hvis Danmmark)
const fetchMap = async () => {
  const mapUrl = `https://api.dataforsyningen.dk/topo_skaermkort_daempet_DAF?service=WMTS&request=GetCapabilities&token=${process.env.VUE_APP_TOKEN}`
  const map = await fetch(mapUrl)
  const mapText = await map.text()
  console.log(mapText)
  const res = new WMTSCapabilities().read(mapText)
  console.log(res)
  const options = optionsFromCapabilities(res, {
    layer: 'topo_skaermkort_daempet',
    matrixSet: 'View1'
  })

  olMap.value = new OlMap({
    target: 'map',
    controls: defaultControls({
      zoom: false,
      attribution: false,
      rotate: false
    }).extend([mousePositionControl, new FullScreen()]),
    zoom: defaultZoom,
    view: olView.value,

    layers: props.isDenmark
      ? [new TileLayer({
          opacity: 1,
          source: new WMTS(options)
        })]
      : [new TileLayer({
          source: new OSM()
        })]
  })
  // Kortmarkøren skal sættes, når applikationen første gang er loadet
  setTimeout(() => {
    const pinnedMarker = document.getElementById('pinned-marker')
    const overlay = new Overlay({
      element: pinnedMarker,
      positioning: 'center-center'
    })

    overlay.setPosition([center[0], center[1]])

    olMap.value.addOverlay(overlay)
  }, timeout)

  // Lyt efter brugerklik på kortet med kortmarkøren og foretag evt. transformation
  olMap.value.on('click', e => {
    // clear the address input field
    document.getElementById('dawa-autocomplete-input').value = ''
    // TODO: this should trigger transform in outputCard.vue
    const mpos = olMap.value.getEventCoordinate(e.originalEvent)
    // Transformér kun hvis EPSG-koderne er forskellige
    if (mapProjection !== inputEPSG.value) {
      store.dispatch('trans/get', mapProjection + '/' + inputEPSG.value + '/' + mpos[0] + ',' + mpos[1])
        .then(() => {
          const output = store.state.trans.data
          // Abort hvis fejl
          if (output.message !== undefined) {
            error.value = output.message
            errorVisible.value = true
            window.setTimeout(() => {
              errorVisible.value = false
            }, 4000)
            return
          }
          // Vi lader korttransformationer med markøren være udelukkende 2D-transformationer.
          // Brugeren må selv indstaste en højdemeter manuelt, hvis de vil have det.
          const output1 = output.v1.toString().replace(',', '.')
          const output2 = output.v2.toString().replace(',', '.')
          const output3 = inputCoords.value[2].toString().replace(',', '.')
          inputCoords.value = [output1, output2, output3]
        })
    // Ellers er koordinaterne ens
    } else {
      const output = [parseFloat(mpos[0]), parseFloat(mpos[1]), inputCoords.value[2]]
      const output1 = output[0].toString().replace(',', '.')
      const output2 = output[1].toString().replace(',', '.')
      const output3 = output[2].toString().replace(',', '.')
      inputCoords.value = [output1, output2, output3]
      // inputCoords.value = output
    }
    setPinMarker(mpos)
  })
}
provide('inputEPSG', inputEPSG.value)

onMounted(() => {
  mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: mapProjection,
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position')
  })

  olView.value = new OlView({
    center: center,
    zoom: 9,
    minZoom: 4,
    maxZoom: 100,
    extent: props.isDenmark
      ? [200_000, 5_900_000, 1_005_000, 6_620_000]
      : [-11_000_000, 7_000_000, 1_000_000, 21_000_000],
    showFullExtent: false,
    projection: mapProjection
  })

  fetchMap()
})
</script>

<style scoped>
#mouse-position {
  display: none;
}
#pinned-marker {
  position: absolute;
  z-index: 1;
  transform: translateX(-50%) translateY(-100%);
}
#map-marker {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 50%;
  cursor: move;
  display: none;
}
expand-icon {
  position: absolute;
}
.olmap {
  width: 100%;
  height: 93.5vh;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 0;
}
#coordinate-transform {
  width: 100%;
}
.transform-container {
  width: 100%;
  padding: 3.5vh 5vw;
  position: absolute;
  z-index: 1;
}

</style>
