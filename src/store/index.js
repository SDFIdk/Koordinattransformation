import {createStore} from 'vuex'
import tempModule from './temp.module'
import { mapCoorToList } from '../helperfunctions';
export default createStore({
    state: {
        webproj: import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_BASE_PATH,
        token: import.meta.env.VITE_TOKEN,
        CRSOptions: JSON.parse(localStorage.getItem('KoordinatTranformationCRSOptions')) || {}, 
        CRSFrom: '',
        CRSTo: '',
        CoordinatesFrom: {},
        CoordinatesTo: {},
        KoorResponseData: [],
        status: ''
    },
    mutations: {
        UPDATE_CRSOptions(state, payload){
            state.CRSOptions = payload;
        },
        UPDATE_CRSFrom(state, payload) {
            state.CRSFrom = payload
        },
        UPDATE_CRSTo(state, payload) {
            state.CRSTo = payload
        },
        UPDATE_KoordinatesFrom(state, payload) {
            state.CoordinatesFrom = payload
        },
        UPDATE_KoordinatesTo(state, payload) {
            state.CoordinatesTo = payload
        },
        UPDATE_KoorResponseData(state, payload) {
            state.KoorResponseData = payload
        },
        UPDATE_Status(state, payload) {
            state.status = payload
        }
    },
    actions: {
        // we call actions with store.dispath('name', data)
        async fetchCRSOptions(context) {
            try {
                // Fetch the list of available CRS options
                const response = await fetch(`https://api.dataforsyningen.dk/rest/webproj/v1.2/crs/?token=${import.meta.env.VITE_TOKEN}`);
                
                if (!response.ok) {
                    throw new Error(`Error fetching CRS-Options! status: ${response.status}`);
                }
                const data = await response.json();
                const updatedCRSOptions = { ...context.state.CRSOptions };
                const coverAreas = ['DK', 'GL', 'Global'];
                for (const coverArea of coverAreas) {
                    if(!updatedCRSOptions[coverArea]){
                        updatedCRSOptions[coverArea] = {}
                    }
                    for (const crsOption of data[coverArea]) {
                        if(!updatedCRSOptions[coverArea][crsOption]){
                            try {
                                const detailsResponse = await fetch(`https://api.dataforsyningen.dk/rest/webproj/v1.2/crs/${crsCode}?token=${import.meta.env.VITE_TOKEN}`);
                                if (!detailsResponse.ok) {
                                    throw new Error(`Error fetching details for ${crsCode}`);
                                }
                                updatedCRSOptions[category][crsOption] = detailsResponse
                            } catch (error) {
                                context.commit("UPDATE_Status", `Error fetching CRS details for: ${crsCode}`);
                                console.error(`Error fetching CRS details for: ${crsCode}`, err);
                            }
                        }
                    }
                }
                context.commit("UPDATE_CRSOptions", updatedCRSOptions);
                localStorage.setItem('KoordinatTranformationCRSOptions', JSON.stringify(updatedCRSOptions));
        
            } catch (err) {
                context.commit("UPDATE_Status", "Error Fetching CRS-options");
                console.error("Error fetching CRS options:", err);
            }
        },
        setCRSTo(context, payload) {
            context.commit('UPDATE_CRSTo', payload)
        },
        setCRSFrom(context, payload) {
            context.commit('UPDATE_CRSFrom', payload)
        },
        async setCoordinatesFrom(context, { crs, coordinates }) {
            if(crs === context.state.CRSFrom){
                context.commit('UPDATE_KoordinatesFrom', coordinates)
            }
            else{
                try {
                    const response = await fetch(
                        `${context.state.webproj}${crs}/${context.state.CRSFrom}/${mapCoorToList(coordinates)}?token=${context.state.token}`
                    )
            
                    if (!response.ok) {
                        throw new Error(`Error fetching coordinatesFrom: ${response.statusText}`)
                    }
                    const data = await response.json()
                    console.log(data)
                    context.commit('UPDATE_KoordinatesFrom', data)
                } catch (error) {
                    console.error('Failed to fetch and update coordinates:', error)
                }
            }
        },
        async setCoordinatesTo(context) {
            if(context.state.CRSFrom === context.state.CRSTo){
                context.commit('UPDATE_KoordinatesTo', context.state.CoordinatesFrom)
            }
            else {
                try {
                    const response = await fetch(
                        `${context.state.webproj}${context.state.CRSFrom}/${context.state.CRSTo}/${mapCoorToList(context.state.CoordinatesFrom)}?token=${context.state.token}`
                    )
                    if (!response.ok) {
                        throw new Error(`Error fetching coordinatesTo: ${response.statusText}`)
                    }
                    const data = await response.json()
                    context.commit('UPDATE_KoordinatesTo', data)
                } catch (error) {
                    console.error('Failed to fetch and update coordinatesTo:', error)
                }

            }
        },
        clearState(context, payload) {
            const status = ''

            const CRSFrom = {}
            const CRSTo = {}

            const CoordinatesFrom = ''
            const CoordinatesTo = ''
            const KoorResponseData = []

            context.commit('UPDATE_CRSFrom', CRSFrom)
            context.commit('UPDATE_CRSTo', CRSTo)
            context.commit('UPDATE_CoordinatesFrom', CoordinatesFrom)
            context.commit('UPDATE_CoordinatesTo', CoordinatesTo)
            context.commit('UPDATE_KoorResponseData', KoorResponseData)
            context.commit('UPDATE_Status', status)
        }
    },
    getters: {
        getWebProj: function (state) {
            return state.webproj
        },
        getToken: function (state) {
            return state.token
        },
        getCRS: function (state) {
            return {
                CRSTo: state.CRSTo,
                CRSFrom: state.CRSFrom
            }
        },
        getCRSTo: function (state) {
            return state.CRSTo
        },
        getCRSFrom: function (state) {
            return state.CRSFrom
        },
        getCRSOptions: function (state) {
            return  state.CRSOptions
        },
        getCRSDisplayOptionsDK: function (state) {
            if (state.CRSOptions) {
                const Options = []
                Object.values(state.CRSOptions.DK).forEach(crs => {
                    Options.push(`${crs.title_short} (${crs.srid})`)
                })
                Object.values(state.CRSOptions.Global).forEach(crs => {
                    Options.push(`${crs.title_short} (${crs.srid})`)
                })
                return Options;
            }
            return [];
        },
        
        getCRSDisplayOptionsGL: function (state) {
            if (state.CRSOptions) {
                const Options = [];
                Object.values(state.CRSOptions.GL).forEach(crs => {
                    Options.push(`${crs.title_short} (${crs.srid})`);
                })
                Object.values(state.CRSOptions.Global).forEach(crs => {
                    Options.push(`${crs.title_short} (${crs.srid})`);
                });
                return Options;
            }
            return [];
        },
        getCoordinatesFrom: function (state) {
            return state.CoordinatesFrom
        },
        getCoordinatesTo: function (state) {
            return state.CoordinatesTo
        }
    },
    modules: {
        temp: tempModule
    }
})