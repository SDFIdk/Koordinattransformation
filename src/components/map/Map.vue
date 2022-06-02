<template>
  <div id="map" class="olmap" ref="map">
  <!-- <div id="map" class="olmap" ref="map" @mousemove="onMouseMove" @mouseup="endDrag" > -->
    <section class="transform-container">
      <CoordinateTransformation :inputCoords=inputCoords id="coordinate-transform" />
      <div id="mouse-position"></div>
    </section>
    <!-- <Icon @mousedown="startDrag"
      id="map-marker"
      icon="MapMarker"
    /> -->
    <Icon
      id="pinned-marker"
      icon="MapMarker"
    />
  </div>
</template>

<script>
import 'ol/ol.css'
import { onMounted, ref, defineAsyncComponent, provide } from 'vue'
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

export default {
  name: 'MapComponent',
  components: {
    CoordinateTransformation: defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateTransformation'))
  },
  props: {
    // Check if the selection is input or output selection
    isDenmark: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  setup (props) {
    const olView = ref({})
    const olMap = ref({})
    let mousePositionControl = ref({})
    const center = props.isDenmark ? [1344085.3822, 7487513.4163] : [-5759445.7863, 9392886.5116]
    const inputCoords = ref(['' + center[0], '' + center[1]])
    provide('inputCoords', inputCoords)
    onMounted(() => {
      mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position')
      })
      olView.value = new OlView({
        center: center,
        zoom: 10,
        minZoom: 4,
        maxZoom: 20,
        showFullExtent: true,
        projection: 'EPSG:3857'
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
      olMap.value.on('click', function (e) {
        let mpos = document.getElementById('mouse-position')
        mpos = mpos.textContent.split(', ')
        inputCoords.value = mpos
        const pinnedMarker = document.getElementById('pinned-marker')
        const overlay = new Overlay({
          element: pinnedMarker,
          positioning: 'center-center'
        })
        overlay.setPosition([e.coordinate[0], e.coordinate[1]])
        olMap.value.addOverlay(overlay)
      })
      olMap.value.on('postrender', function () {
        inputCoords.value = ['' + center[0], '' + center[1]]
      })
    })
    return {
      olMap, mousePositionControl, inputCoords
    }
  }
}
</script>

<style scoped>
#pinned-marker {
  position: absolute;
  z-index: 1;
  /* top: 50%;
  right: 50%; */
  transform: translateX(-50%) translateY(-85%);
}
#map-marker {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 50%;
  cursor: move;
  display: none;
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
