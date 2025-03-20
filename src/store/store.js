import { defineStore } from 'pinia'
import { mapCoorToList } from '../helperfunctions'

export const useKtStore = defineStore('KtStore', {
  state: () => ({
    // Base URL and path for the web project, derived from environment variables
    webproj: `${import.meta.env.VITE_API_BASE_URL || ''}${import.meta.env.VITE_API_BASE_PATH || ''}`,
    
    // Authentication token, default to null if not provided
    token: import.meta.env.VITE_TOKEN || null,

    //baseUrl to find statically copied members
    baseUrl: new URL(import.meta.url).origin || null,

    // Coordinate Reference System options, loaded from localStorage or defaulting to an empty object
    CRSOptions: JSON.parse(localStorage.getItem('KoordinatTranformationCRSOptions')) || {},

    CoverArea: '',
    
    // Selected CRS for transformation: From and To
    CRSFrom: '',
    CRSTo: '',
    
    // Coordinates for transformation: Input and Output
    CoordinatesFrom: {'v1': 0, 'v2': 0, 'v3': 0, 'v4': 0}, // Use a consistent structure for coordinate data, e.g., { v1: 0, v2: 0, v3: 0, v4: 0 }
    CoordinatesTo: {'v1': 0, 'v2': 0, 'v3': 0, 'v4': 0},
  }),
  getters: {
    getWebProj: (state) => state.webproj,
    getToken: (state) => state.token,

    getCoverArea: (state) => state.CoverArea,
    
    getCRS: (state) => ({
      CRSFrom: state.CRSFrom,
      CRSTo: state.CRSTo,
    }),
    
    getCRSTo: (state) => state.CRSTo,
    getCRSFrom: (state) => state.CRSFrom,
    getCRSOptions: (state) => state.CRSOptions,
    
    getCRSDisplayOptionsDK: (state) => {
      if (state.CRSOptions) {
        const Options = []
        Object.values(state.CRSOptions.DK || {}).forEach((crs) => {
          Options.push(`${crs.title_short} (${crs.srid})`)
        })
        Object.values(state.CRSOptions.Global || {}).forEach((crs) => {
          Options.push(`${crs.title_short} (${crs.srid})`)
        })
        return Options
      }
      return []
    },
    
    getCRSDisplayOptionsGL: (state) => {
      if (state.CRSOptions) {
        const Options = []
        Object.values(state.CRSOptions.GL || {}).forEach((crs) => {
          Options.push(`${crs.title_short} (${crs.srid})`)
        })
        Object.values(state.CRSOptions.Global || {}).forEach((crs) => {
          Options.push(`${crs.title_short} (${crs.srid})`)
        })
        return Options
      }
      return []
    },
    
    getCoordinatesFrom: (state) => state.CoordinatesFrom,
    getCoordinatesTo: (state) => state.CoordinatesTo,

    getCRSFromDisplayInfo: (state) => {
      return state.CRSOptions?.[state.CoverArea]?.[state.CRSFrom]
        ?? state.CRSOptions?.Global?.[state.CRSFrom]
        ?? {}
    },
    getCRSToDisplayInfo: (state) => {
      return state.CRSOptions?.[state.CoverArea]?.[state.CRSTo]
        ?? state.CRSOptions?.Global?.[state.CRSTo]
        ?? {}
    },
    getURL: (state) => {
      return state.baseUrl
    } 
  },
  actions: {
    setCoverArea(area) {
      this.CoverArea = area
    },
    async fetchCRSOptions() {
      try {
        const response = await fetch(`https://api.dataforsyningen.dk/rest/webproj/v1.2/crs/?token=${this.token}`)
        if (!response.ok) {
          throw new Error(`Error fetching CRS-Options! status: ${response.status}`)
        }
          
        const data = await response.json()
        //first, we preseed the CRSOptions to ensure the ordering
        const updatedCRSOptions = {}

        // Define cover areas
        const coverAreas = ['DK', 'GL', 'Global']
    
        // Iterate over each cover area
        coverAreas.forEach(coverArea => {
          if (data[coverArea]) {
            // Initialize the cover area in updatedCRSOptions
            updatedCRSOptions[coverArea] = {}
    
            // Iterate over each EPSG value in the cover area
            data[coverArea].forEach(epsgValue => {
              // Set the EPSG value as a key with null as its value
              updatedCRSOptions[coverArea][epsgValue] = null
            })
          }
        })

        for (const coverArea of coverAreas) {
          
          const crsOptions = data[coverArea] || []

          const fetchDetailsPromises = crsOptions.map(async (crsOption) => {
            //copy over values if they already exist (important to have optional tags as each could possible have been added)
            if(this.CRSOptions?.[coverArea]?.[crsOption]){
              updatedCRSOptions[coverArea][crsOption] = this.CRSOptions[coverArea][crsOption]
            }
            else {
              try {
                const detailsResponse = await fetch(`https://api.dataforsyningen.dk/rest/webproj/v1.2/crs/${crsOption}?token=${this.token}`)
                if (!detailsResponse.ok) {
                  throw new Error(`Error fetching details for ${crsOption}`)
                }
                const crsDetails = await detailsResponse.json()
                updatedCRSOptions[coverArea][crsOption] = crsDetails
              } catch (detailsError) {
                console.error(`Error fetching CRS details for: ${crsOption}`, detailsError)
              }
            }
          })
          
          await Promise.all(fetchDetailsPromises)
        }
        
        this.CRSOptions = updatedCRSOptions
        localStorage.setItem('KoordinatTranformationCRSOptions', JSON.stringify(updatedCRSOptions))
      } catch (error) {
        console.error('Error fetching CRS Options: ', error)
      }
    },
    setCRSTo(payload) {
      this.CRSTo = payload
    },
    setCRSFrom(payload) {
      let v3 = null
      if (Object.keys(this.CRSOptions[this.CoverArea]).includes(payload)) {
        v3 = this.CRSOptions[this.CoverArea][payload].v3
      } else if (Object.keys(this.CRSOptions.Global).includes(payload)) {
        v3 = this.CRSOptions.Global[payload]
      }
      this.CRSFrom = payload
      if(v3 == null){
        this.CoordinatesFrom.v3 = null
      }
    },
    
    async setCoordinatesFrom({ crs, coordinates }) {
      if(this.CRSFrom === '' ){
        console.error('We should not set coordinate before CRS')
        throw new Exception()
      }
      else if(crs === this.CRSFrom) {
        this.CoordinatesFrom = coordinates
      }
      else{
        try {
          const coordinateResponse = await fetch(
            `${this.webproj}${crs}/${this.CRSFrom}/${mapCoorToList(coordinates)}?token=${this.token}`,
          )
          if(!coordinateResponse.ok){
            throw new Error(`Error Fetching coordinatesFrom: ${coordinateResponse.statusText}`)
          }
          const coordinatesData = await coordinateResponse.json()
          this.CoordinatesFrom = coordinatesData
        } catch (error) {
          console.error('Failed to fetch and update coordinateFrom', error)
        }
      }
    },
    async setCoordinatesFrom_v3({ crs, coordinates }){
      const v3 = this.CoordinatesFrom.v3 || 0
      if(this.CRSFrom === '' ){
        console.log('this should not happen')
        throw new Error()
      }
      else if(crs === this.CRSFrom) {
        coordinates.v3 = v3
        this.CoordinatesFrom = coordinates
      }
      else{
        try {
          const coordinateResponse = await fetch(
            `${this.webproj}${crs}/${this.CRSFrom}/${mapCoorToList(coordinates)}?token=${this.token}`,
          )
          if(!coordinateResponse.ok){
            throw new Error(`Error Fetching coordinatesFrom: ${coordinateResponse.statusText}`)
          }
          const coordinatesData = await coordinateResponse.json()
          coordinatesData.v3 = v3
          this.CoordinatesFrom = coordinatesData
        } catch (error) {
          console.error('Failed to fetch and update coordinateFrom', error)
        }
      }
    },
    async setCoordinatesTo() {
      if(this.CRSFrom === '' ){
        console.log('this should not happen')
      }
      else if(this.CRSFrom === this.CRSTo) {
        this.CoordinatesTo = this.CoordinatesFrom
      }
      else {
        try {
          const coordinateResponse = await fetch(
            `${this.webproj}${this.CRSFrom}/${this.CRSTo}/${mapCoorToList(this.CoordinatesFrom)}?token=${this.token}`,
          )
          if(!coordinateResponse.ok){
            throw new Error(`Error Fetching coordinatesTo: ${coordinateResponse.statusText}`)
          }
          const coordinatesData = await coordinateResponse.json()
          this.CoordinatesTo = coordinatesData
        } catch (error) {
          console.error('Failed to fetch and update coordinateTo', error)
        }
      }
    },
    
    clearState() {
      this.CRSFrom = ''
      this.CRSTo = ''
      this.CoordinatesFrom = {}
      this.CoordinatesTo = {}
    },
  },
})