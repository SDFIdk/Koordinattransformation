<template>
  <div id="map" class="olmap" ref="map">
    <section class="transform-container">
      <CoordinateTransformation @input-epsg-changed="inputEPSGChanged" @input-coords-changed="inputCoordsChanged" :inputCoords=inputCoords id="coordinate-transform" />
      <div id="mouse-position"></div>
    </section>
    <Icon
      id="pinned-marker"
      icon="MapMarker"
    />
  </div>
</template>

<script>
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
      this.store.dispatch('trans/get', this.inputEPSG + '/' + this.mapProjection + '/' + coords[0] + ',' + coords[1]).then(() => {
        const output = this.store.state.trans.data
        const pinnedMarker = document.getElementById('pinned-marker')
        const overlay = new Overlay({
          element: pinnedMarker,
          positioning: 'center-center'
        })
        overlay.setPosition([output.v1, output.v2])
        this.olMap.addOverlay(overlay)
      })
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
    const center = props.isDenmark ? [1313559.7686000003, 7448691.317399999] : [-5758833.2009, 9393681.2087]
    const inputCoords = ref(props.isDenmark ? [677093.7465413888, 6147863.846297142] : [1611279.4886776865, 7323246.570397905])
    const colors = inject('themeColors')
    const mapProjection = 'EPSG:3857'
    const inputEPSG = ref(props.isDenmark ? 'EPSG:25832' : 'EPSG:3178')
    const timeout = 100
    provide('inputCoords', inputCoords)
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
        showFullExtent: true,
        projection: mapProjection
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
        layers: [
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
      olMap.value.on('click', function (e) {
        let mpos = document.getElementById('mouse-position')
        mpos = mpos.textContent.split(', ')
        store.dispatch('trans/get', mapProjection + '/' + inputEPSG.value + '/' + mpos[0] + ',' + mpos[1]).then(() => {
          const output = store.state.trans.data
          inputCoords.value = [output.v1, output.v2]
        })
        const pinnedMarker = document.getElementById('pinned-marker')
        const overlay = new Overlay({
          element: pinnedMarker,
          positioning: 'center-center'
        })
        overlay.setPosition([mpos[0], mpos[1]])
        olMap.value.addOverlay(overlay)
      })
    })
    return {
      olMap, mousePositionControl, inputCoords, colors, store, mapProjection, timeout, inputEPSG
    }
  }
}
</script>

<style scoped>
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
