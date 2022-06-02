// import { environmentAPIDomains } from '@/store/shared/Paths'

// const tokens = {
//   get: {
//     production: process.env.VUE_APP_TOKEN,
//     development: process.env.VUE_APP_TOKEN,
//     staging: process.env.VUE_APP_TOKEN
//   }
// }

export class Koortrans {
  constructor (path, parseData) {
    this.state = {
      data: [],
      status: ''
    }

    this.getters = {
    }

    this.actions = {
      get ({ commit, dispatch }, crsParameter) {
        return new Promise((resolve, reject) => {
          commit('request')
          // fetch(environmentAPIDomains[process.env.VUE_APP_NODE_ENV] + path + crsParameter + '?token=' + tokens.get[process.env.VUE_APP_NODE_ENV])
          fetch('https://api.dataforsyningen.dk/rest/webproj' + path + crsParameter + '?token=' + 'fe21ca875526ff7d91c068a943f2f821')
            .then(resp => {
              resp.json().then(data => {
                commit('success', data)
                resolve(data)
              })
            })
            .catch((err) => {
              commit('error', err)
              reject(err)
            })
        })
      },

      clear ({ commit, dispatch }) {
        commit('clear')
      }
    }

    this.mutations = {
      request (state) {
        state.status = 'loading'
      },
      success (state, data) {
        state.data = parseData(data)
        state.status = 'success'
      },
      error (state) {
        state.status = 'error'
      },
      clear (state) {
        state.data = []
      }
    }
  }
}
