<template>
  <!-- <div id="map" class="olmap" ref="map"> -->
  <div id="map" class="olmap" ref="map" @mousemove="onMouseMove" @mouseup="endDrag" >
    <section class="transform-container">
      <CoordinateTransformation :inputCoords=inputCoords id="coordinate-transform" />
      <div id="mouse-position"></div>
    </section>
    <Icon @mousedown="startDrag"
      id="map-marker"
      icon="MapMarker"
      :class="{dragging: dragging}"
    />
    <Icon
      id="pinned-marker"
      icon="MapMarker"
    />
  </div>
</template>

<script>
import 'ol/ol.css'
import { onMounted, ref, defineAsyncComponent, provide, computed } from 'vue'
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
// import Overlay from 'ol/Overlay'
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
  setup () {
    const olView = ref({})
    const olMap = ref({})
    let mousePositionControl = ref({})
    const inputCoords = ref(['0', '0'])
    // const pinnedMarker = ref({})
    const mapMarker = computed(() => { return document.getElementById('map-marker') || {} })
    provide('inputCoords', inputCoords)
    onMounted(() => {
      // pinnedMarker.value = document.getElementById('pinned-marker')
      mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position')
      })
      olView.value = new OlView({
        center: [1295112.66, 7606748.02],
        zoom: 7.5,
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
      // olMap.value.on('click', function (e) {
      //   console.log('coordinate', e.map)
      //   console.log('coordinate', e.map.pixelToCoordinateTransform)
      //   const pinnedMarker = document.getElementById('pinned-marker')
      //   const overlay = new Overlay({
      //     element: pinned-marker,
      //     positioning: 'center-center'
      //   })
      //   overlay.setPosition([e.coordinate[0] + 0, e.coordinate[1] - 105])
      //   olMap.value.addOverlay(overlay)
      // })
    })

    const isPinned = ref(false)
    const dragging = ref(false)

    const startDrag = () => {
      dragging.value = true
    }

    const endDrag = (e) => {
      console.log(e)
      console.log(olMap.value)
      // const pinnedMarker = document.getElementById('pinned-marker')
      // const overlay = new Overlay({
      //   element: pinnedMarker,
      //   positioning: 'center-center'
      // })
      // overlay.setPosition(e.coordinate)
      // olMap.value.addOverlay(overlay)

      dragging.value = false
      let mpos = document.getElementById('mouse-position')
      if (mpos !== undefined) {
        mpos = mpos.textContent.split(', ')
        if (mpos.length > 1) {
          inputCoords.value = mpos
        }
      }
    }
    const onMouseMove = (event) => {
      if (dragging.value) {
        mapMarker.value.style.cssText = 'left: ' + (event.pageX - 23) + 'px; top: ' + (event.pageY - 105) + 'px;'
      }
    }
    return {
      // olMap, mousePositionControl, inputCoords
      olMap, dragging, startDrag, endDrag, onMouseMove, mousePositionControl, inputCoords, isPinned
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
}
#map-marker {
  position: absolute;
  z-index: 1;
  top: 50%;
  right: 50%;
  cursor: move;
}
#map-marker.dragged {
  display: block;
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
svg:hover {
  transform: scale3d(1.2,1.2,1.2)
}
</style>
