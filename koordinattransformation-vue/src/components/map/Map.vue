<template>
  <div id="map" class="olmap" ref="map">
    <section class="transform-container">
      <CoordinateTransformation id="coordinate-transform" />
    </section>
  </div>
  <div id="mouse-position" />
</template>

<script>
import 'ol/ol.css'
import { onMounted, ref, defineAsyncComponent } from 'vue'
import OlMap from 'ol/Map'
import OlView from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
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
    let olView = ref({})
    let olMap = ref({})
    let mousePositionControl = ref({})
    onMounted(() => {
      mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: 'EPSG:3857',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position')
      })
      olView = new OlView({
        center: [1295112.66, 7606748.02],
        zoom: 7.5,
        minZoom: 4,
        maxZoom: 20,
        showFullExtent: true,
        projection: 'EPSG:3857'
      })
      olMap = new OlMap({
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
        view: olView,
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ]
      })
    })
    return {
      olMap
    }
  }
}
</script>

<style scoped>
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
