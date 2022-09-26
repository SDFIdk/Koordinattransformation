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

<script>
// WMNTS
import WMTS, { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
// import { get as getProjection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'
import { epsg25832proj } from 'skraafoto-saul'
// OL
import 'ol/ol.css'
import { onMounted, ref, defineAsyncComponent, inject, provide } from 'vue'
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

export default {
  name: 'MapComponent',
  components: {
    CoordinateTransformation: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateTransformation'))
  },
  props: {
    isDenmark: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  methods: {
    inputCoordsChanged (coords) {
      if (this.inputEPSG !== this.mapProjection) {
        this.store.dispatch('trans/get', this.inputEPSG + '/' + this.mapProjection + '/' + coords[0] + ',' + coords[1])
          .then(() => {
            const output = this.store.state.trans.data
            const pinnedMarker = document.getElementById('pinned-marker')
            const overlay = new Overlay({
              element: pinnedMarker,
              positioning: 'center-center'
            })
            overlay.setPosition([output.v1, output.v2])
            this.olMap.addOverlay(overlay)
          })
      } else {
        const pinnedMarker = document.getElementById('pinned-marker')
        const overlay = new Overlay({
          element: pinnedMarker,
          positioning: 'center-center'
        })
        overlay.setPosition([coords[0], coords[1]])
        this.olMap.addOverlay(overlay)
      }
    },
    inputEPSGChanged (epsg) {
      this.inputEPSG = epsg
    }
  },
  setup (props) {
    const store = useStore()
    const olView = ref({})
    const olMap = ref({})
    let mousePositionControl = ref({})
    const center = props.isDenmark ? [677_555, 61_481_00] : [-5758833.2009, 9393681.2087]
    const inputCoords = ref([center[0], center[1], 0])
    provide('mapMarkerInputCoords', inputCoords)
    const colors = inject('themeColors')
    epsg25832proj(proj4)
    register(proj4)
    const mapProjection = props.isDenmark ? 'EPSG:25832' : 'EPSG:3857'
    const inputEPSG = ref(props.isDenmark ? 'EPSG:25832' : 'EPSG:3178')
    const timeout = 500
    const error = ref('')
    const errorVisible = ref(false)
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
        maxZoom: 20,
        extent: props.isDenmark
          ? [
              120_000, 5_900_000, 1_000_000, 6_600_000
            ]
          : [
              -8_500_000, 8_200_000, 1_100_000, 20_000_000
            ],
        showFullExtent: false,
        projection: mapProjection
      })
      fetch(`https://api.dataforsyningen.dk/topo_skaermkort_daempet_DAF?service=WMTS&request=GetCapabilities&token=${process.env.VUE_APP_TOKEN}`)
        .then(res => res.text())
        .then(xml => {
          const res = new WMTSCapabilities().read(xml)
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
            zoom: new Zoom({
              duration: 700,
              className: 'custom-zoom',
              zoomInClassName: '-in',
              zoomOutClassName: '-out',
              zoomInLabel: 'Zoom ind2',
              zoomOutLabel: 'Zoom ud2',
              zoomInTipLabel: 'Zoom2',
              zoomOutTipLabel: 'Zoom2'
            }),
            view: olView.value,
            layers: props.isDenmark
              ? [
                  new TileLayer({
                    opacity: 1,
                    source: new WMTS(options)
                  })]
              : [
                  new TileLayer({
                    source: new OSM()
                  })
                ]
          })
          // set inital map marker
          setTimeout(() => {
            const pinnedMarker = document.getElementById('pinned-marker')
            const overlay = new Overlay({
              element: pinnedMarker,
              positioning: 'center-center'
            })
            overlay.setPosition([center[0], center[1]])
            olMap.value.addOverlay(overlay)
          }, timeout)
          // on click listener
          olMap.value.on('click', () => {
            let mpos = document.getElementById('mouse-position')
            mpos = mpos.textContent.split(', ')
            if (mapProjection !== inputEPSG.value) {
              store.dispatch('trans/get', mapProjection + '/' + inputEPSG.value + '/' + mpos[0] + ',' + mpos[1])
                .then(() => {
                  const output = store.state.trans.data
                  if (output.message !== undefined) {
                    error.value = output.message
                    errorVisible.value = true
                    window.setTimeout(() => {
                      errorVisible.value = false
                    }, 5000)
                    return
                  }
                  const height = output.v3 || inputCoords.value[2]
                  inputCoords.value = [output.v1, output.v2, height]
                })
            } else {
              const output = [parseFloat(mpos[0]), parseFloat(mpos[1]), inputCoords.value[2]]
              inputCoords.value = output
            }
            const pinnedMarker = document.getElementById('pinned-marker')
            const overlay = new Overlay({
              element: pinnedMarker,
              positioning: 'center-center'
            })
            overlay.setPosition([parseFloat(mpos[0]), parseFloat(mpos[1])])
            olMap.value.addOverlay(overlay)
          })
        })
    })
    return {
      olMap,
      mousePositionControl,
      inputCoords,
      colors,
      store,
      mapProjection,
      timeout,
      error,
      errorVisible,
      inputEPSG
    }
  }
}
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
  height: 90vh;
  position: sticky;
  top: 0;
  z-index: 0;
  overflow-y: scroll;
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
