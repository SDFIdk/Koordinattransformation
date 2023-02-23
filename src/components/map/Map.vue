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
        <span
            id="pinned-marker"
            icon="MapMarker">
            <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                <g transform="scale(3.7795276)">
                <path class="ds-icon-background" d="m 3.1749986,7.834272 c 0,0 2.9104181,-2.7189942 2.9104181,-4.6592708 0,-1.607383 -1.3030353,-2.91041787 -2.9104181,-2.91041787 -1.6073767,0 -2.91041527,1.30303487 -2.91041527,2.91041787 0,1.9402766 2.91041527,4.6592708 2.91041527,4.6592708 z m -6.4e-6,-3.2040714 c 0.8036915,0 1.4552057,-0.6515142 1.4552057,-1.4552057 0,-0.8036916 -0.6515142,-1.455206 -1.4552057,-1.455206 -0.8036917,0 -1.4552061,0.6515144 -1.4552061,1.455206 0,0.8036915 0.6515144,1.4552057 1.4552061,1.4552057 z" fill="hsl(171,70%,40%)" fill-rule="evenodd" />
                <path d="m 3.1749984,8.041916 -0.092104,0.09856 0.092104,0.08608 0.09211,-0.08608 z M 6.0801586,3.1750283 c 0,0.4756129 -0.1792758,1.0106388 -0.4599448,1.5535172 C 5.3405434,5.2694943 4.9660911,5.8070837 4.5891159,6.2849297 4.2124847,6.7623372 3.835496,7.1774039 3.5525199,7.4732203 3.4111028,7.6210271 3.2933508,7.7388813 3.2111032,7.8196321 c -0.041124,0.040409 -0.073357,0.071508 -0.09522,0.092421 -0.01093,0.010456 -0.019267,0.018349 -0.024831,0.023611 -0.00278,0.00265 -0.00486,0.00459 -0.00623,0.00587 -6.88e-4,6.085e-4 -0.00119,0.00108 -0.00151,0.00143 -1.553e-4,1.349e-4 -2.646e-4,2.645e-4 -3.439e-4,3.439e-4 -3.36e-5,0 -4.71e-5,0 -6.72e-5,6.75e-5 -6.9e-6,0 0,0 0.092103,0.09856 0.09211,0.09856 0.092137,0.09856 0.092178,0.09856 2.73e-5,-6.75e-5 8.12e-5,-1.35e-4 1.352e-4,-1.35e-4 1.146e-4,-1.349e-4 2.646e-4,-2.646e-4 4.763e-4,-4.762e-4 4.233e-4,-3.969e-4 0.00101,-9.525e-4 0.0018,-0.00169 0.00156,-0.00148 0.00383,-0.00357 0.00681,-0.00641 0.00595,-0.0056 0.014674,-0.013896 0.026006,-0.02476 0.022667,-0.021654 0.055749,-0.053564 0.097757,-0.09485 C 3.4841672,7.9297326 3.603916,7.8098542 3.7475123,7.6597536 4.0345492,7.3596876 4.4175826,6.9380566 4.8009733,6.4520683 5.184013,5.9665317 5.569576,5.4140738 5.8599186,4.852475 6.1492649,4.292795 6.35,3.7127794 6.35,3.1750283 Z M 3.1749984,0.2698437 c 1.6044773,0 2.9051602,1.3006939 2.9051602,2.9051846 H 6.35 C 6.35,1.4215096 4.9285022,0 3.1749984,0 Z M 0.26984145,3.1750283 c 0,-1.6044907 1.30068635,-2.9051846 2.90515695,-2.9051846 V 0 C 1.4214944,0 0,1.4215096 0,3.1750283 Z M 3.1749984,8.041916 c 0.09211,-0.098561 0.09211,-0.098561 0.09211,-0.098561 -2.01e-5,-6.75e-5 -4.05e-5,-6.75e-5 -7.41e-5,-6.75e-5 -6.75e-5,-6.74e-5 -1.82e-4,-2.024e-4 -3.439e-4,-3.439e-4 -3.175e-4,-3.44e-4 -8.202e-4,-8.202e-4 -0.00151,-0.00143 -0.00138,-0.00127 -0.00346,-0.00324 -0.00623,-0.00587 -0.00556,-0.00527 -0.013899,-0.013155 -0.024831,-0.023612 -0.021863,-0.020913 -0.054095,-0.052012 -0.095219,-0.09242 C 3.0566458,7.7388813 2.9388938,7.6210271 2.7974832,7.4732203 2.5145007,7.1774039 2.1375186,6.7623372 1.7608874,6.2849297 1.3839122,5.8070837 1.0094532,5.2694943 0.72978349,4.7285455 0.4491187,4.1856671 0.26984145,3.6506412 0.26984145,3.1750283 H 0 C 0,3.7127794 0.20073236,4.292795 0.49008199,4.852471 0.78042532,5.4140698 1.1659883,5.9665277 1.549035,6.4520643 c 0.3833907,0.4859883 0.7664239,0.9076193 1.053461,1.2076854 0.1435893,0.1501005 0.263345,0.2699787 0.3473468,0.352416 0.042008,0.041286 0.07509,0.073195 0.097757,0.09485 0.011332,0.010861 0.020069,0.019158 0.026014,0.024757 0.00297,0.00283 0.00525,0.00492 0.0068,0.00641 7.673e-4,7.408e-4 0.00138,0.00127 0.0018,0.00169 2.09e-4,2.024e-4 3.704e-4,3.44e-4 4.762e-4,4.763e-4 6.09e-5,0 1.082e-4,6.74e-5 1.418e-4,1.349e-4 4.05e-5,0 6.75e-5,0 0.092171,-0.09856 z M 4.560108,3.1750214 c 0,0.7649866 -0.6201362,1.3851282 -1.3851165,1.3851282 v 0.2698438 c 0.9140069,0 1.6549579,-0.7409572 1.6549579,-1.654972 z M 3.1749915,1.7898935 c 0.7649803,0 1.3851165,0.6201413 1.3851165,1.3851279 h 0.2698414 c 0,-0.9140145 -0.740951,-1.6549715 -1.6549579,-1.6549715 z M 1.7898752,3.1750214 c 0,-0.7649866 0.6201361,-1.3851279 1.3851163,-1.3851279 V 1.5200499 c -0.9140068,0 -1.6549577,0.740957 -1.6549577,1.6549715 z m 1.3851163,1.3851282 c -0.7649802,0 -1.3851163,-0.6201416 -1.3851163,-1.3851282 H 1.5200338 c 0,0.9140148 0.7409509,1.654972 1.6549577,1.654972 z" fill="#ffffff" />
                </g>
            </svg>
        </span>
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
import { useStore } from 'vuex'

const CoordinateTransformation = defineAsyncComponent(() => import('@/components/coordinatetransformation/CoordinateTransformation.vue'))

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
const setCursor = () => {
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
}

const setMapOnClick = () => {
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
                const output3 = '0'
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

const instantiateMap = (options) => {
    return new OlMap({
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
}
///
const defaultOlView = new OlView({
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

// Vores eget kort (hvis Danmmark)
const fetchMap = async () => {
    const mapUrl = `https://api.dataforsyningen.dk/topo_skaermkort_daempet_DAF?service=WMTS&request=GetCapabilities&token=${import.meta.env.VITE_TOKEN}`

    const map = await fetch(mapUrl)
    const mapText = await map.text()
    const capabilities = new WMTSCapabilities().read(mapText)

    const options = optionsFromCapabilities(capabilities, {
        layer: 'topo_skaermkort_daempet',
        matrixSet: 'View1'
    })

    olMap.value = instantiateMap(options)

    setCursor()
    // Lyt efter brugerklik på kortet med kortmarkøren og foretag evt. transformation
    setMapOnClick()
}
provide('inputEPSG', inputEPSG.value)

onMounted(() => {
    mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(4),
        projection: mapProjection,
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position')
    })

    olView.value = defaultOlView

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
