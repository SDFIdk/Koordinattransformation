# Overview

This file contains relevant context for upcoming migrations to be performed before the end of June 2026.
The migrations deal with the following services:

daf: forwarded services from api.dataforsyningen to services.datafordeler will be shut down
ser: authentication using username and password attributes in URL/Header will be deprecated
dawa: the danish address web api will be shut down along with all services dependent on it.

## Overview of Application

KoordinatTransformation consists of a vue SPA served by an nginx proxy. 
All code runs on the client and consists of vue-components that update/react to state in
a shared pinia store. 

The store broadly manages state of the components and provides helper functions for querying webproj 
given an application state.

The Documentation for this page is limited, but `/uml/Component_Diagram.png` provides an overview

### Pinia Store documentation
In simple terms, the pinia store manages the following state:
```js
  this.CRSFrom = ''
  this.CRSTo = ''
  this.CoordinatesFrom = {}
  this.CoordinatesTo = {}
```
Given these values, the store allows for setting and getting new values through methods such as.

```js
    setCRSTo(payload) {
      this.CRSTo = payload
    }
    /** some js */

    async setCoordinatesTo() {
      if(this.CRSFrom === '' ){
        console.error('[CoordinatesTo] Illegal State: CRSFrom is undefined')
      }
      else if(this.CRSFrom === this.CRSTo) {
        this.CoordinatesTo = this.CoordinatesFrom
      }
      else {
        try {
          const coordinateResponse = await fetch(
            /* logic for generating webproj get request from coordinatesfrom, CRSFrom and CRSTo */
          )
          const coordinatesData = await coordinateResponse.json()
          this.CoordinatesTo = coordinatesData
        } catch (error) {
          console.error('[CoordinatesTo] Fetch Error: failed fetching coordinatesTo, update aborted', error)
        }
      }
    },
```

Each component consits of reactive references and watchers on these references, that trigger the correct store functions
that they are responsible for.

For example, crsTo is managed in `OutputKoor.vue` in the following way.
```js
import { useKtStore } from '../../../store/store.js'
import { extractEPSGCode } from '../../../helperfunctions.js'
import { ref, watch } from 'vue'

const KtStore = useKtStore()

const props = defineProps({
  /* other props */
  outputOptions: {
    type: Array,
    default: () => [],
  },
})

const selectedOption = ref(props.outputOptions[0] || '')

watch(selectedOption, (to, from) => {
  KtStore.setCRSTo(extractEPSGCode(to))
  KtStore.setCoordinatesTo()
})
```
Such that changing the output crs also changes the output coordinates.

The overall flow is modelled in the `/uml/reactiveFlow.png` 

### Migration 1: Session-Based Authentication for Datafordeler

#### Current State

`KoorMap.vue` uses .env variables to construct get requests to `services.datafordeler` using username+password arguments

#### Target State

`Koormap.vue` uses session based authentication for `services.datafordeler` hooked up to the applications lifecycle (vue lifecycle hooks)

#### Implementation Process

Currently, the environment variables in the dotenv files provide the following:
```sh
VITE_DAF_TOKEN_A = [someusername]
VITE_DAF_TOKEN_B = [somepassword]
```

These are used to construct the `mapURL` attribute in the reactive map layer configuration in `KoorMap.vue`
```js
  'DK' : {
    title: 'Skærmkortet',
    attributionText: 'Klimadatastyrelsen',
    attributionLink: 'https://www.klimadatastyrelsen.dk/',
    mapURL: `https://services.datafordeler.dk/DKskaermkort/topo_skaermkort_daempet/1.0.0/wmts?username=${import.meta.env.VITE_DAF_TOKEN_A}&password=${import.meta.env.VITE_DAF_TOKEN_B}&service=WMTS&request=GetCapabilities`,
    source: null,
    view: null,
    center: [587135, 6140617 + 80000],
    extent: [120000, 5900000, 1000000, 6500000],
    projection: 'EPSG:25832',
    zoom: 8.6,
    minZoom: 8.5,
    maxZoom: 20,
  },
```

To refactor this setup, a session based setup can be introduced, where a session is initialized 
before the reactive content is mounted to the dom, and the application starts rendering.
This could be done by the following code convention in the affected component `KoorMap.vue`.

```js
import { onBeforeMount } from 'vue'

const sessionToken = ref('')
onBeforeMount(async() => {
  sessionToken.value = initSession()
})
```

#### Procedure
- [ ] Update configuration of dotenv-files
- [ ] introduce reactive reference and session initialization in KoorMap
- [ ] Run application locally and test that maps load (/Denmark and /Greenland)
- [ ] Run e2e test
- [ ] Merge to main and build+deploy to test (test10.dataforsyningen.dk)
- [ ] Create new release tag on github and build+deploy to prod (koordinattransformation.dk)

## Testing Procedure

## Deployment Process
There are two jenkins jobs for build+deploy. One for test and one for production.

The Test pipeline runs from the current version of main or a specified release tag, 
while the production pipeline must run from a specified release tag.

- [KoordinatTransformation Test]
- [KoordinatTransformation Prod]
## Important Files Reference

| File | Purpose | Key Migrations |
|------|---------|----------------|
| `src/components/map/KoorMap.vue` | Map component with authentication | Migration 1 |
| `src/store/store.js` | Example Pinia store pattern | Migration 1 |

---

## Testing Procedure

HKPN can be tested manually and testing out the specific components refactored by running the following commands
from the hkpn-vue folder.
```sh
npm i 
npm run dev
```
It often helps to open the console terminal and search for html elements from that component, such as `id="map"`
for the KDSMapContainer component.

Furthermore, there is a playwright e2e testing setup implemented, which can be run using 
```sh
npx playwright install
npm run test
```

Before deploying to production, merge changes into the develop branch and deploy to test5.dataforsyningen.dk to ensure
that no integration concerns exist. (with changes to endpoints, there is always a risk of cors-issues)


## Docs

- **Dataforsyningen Docs**: https://docs.dataforsyningen.dk/ 
- **Datafordeler Docs**: https://confluence.sdfi.dk/display/DML/Datafordelerens+dokumentation
- **WebProj Docs**: https://github.com/SDFIdk/WEBPROJ

