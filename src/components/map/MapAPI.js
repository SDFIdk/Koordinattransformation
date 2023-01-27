import store from '@/store/index'

const MapAPI = {

  async filterCodes (routeName, crs) {
    let codes = []
    // Der er forskellige lister for Danmark og Grønland
    if (routeName === 'Denmark' && crs.length !== 0) {
      codes = await MapAPI.getDenmarkCodes(crs)
    } else if (routeName === 'Greenland') {
      codes = await MapAPI.getGreenlandCodes(crs)
    }
    return codes
  },

  async getGreenlandCodes (crs) {
    const codes = []
    for (let i = 0; i < crs.GL.length; ++i) {
      await store
        .dispatch('CRSInformation/get', crs.GL[i])
        .then(() => {
          codes.push(store.state.CRSInformation.data)
        })
    }
    for (let i = 0; i < crs.Global.length; ++i) {
      await store
        .dispatch('CRSInformation/get', crs.Global[i])
        .then(() => {
          codes.push(store.state.CRSInformation.data)
        })
    }
    return codes
  },

  async getDenmarkCodes (crs) {
    const codes = []
    for (let i = 0; i < crs.DK.length; ++i) {
      await store
        .dispatch('CRSInformation/get', crs.DK[i])
        .then(() => {
          codes.push(store.state.CRSInformation.data)
        })
    }

    for (let i = 0; i < crs.Global.length; ++i) {
      await store
        .dispatch('CRSInformation/get', crs.Global[i])
        .then(() => {
          codes.push(store.state.CRSInformation.data)
        })
    }
    return codes
  }
}
export default MapAPI
