import { environmentAPIDomains } from '@/store/shared/Paths'

const tokens = {
  get: {
    production: process.env.VUE_APP_TOKEN,
    development: process.env.VUE_APP_TOKEN,
    staging: process.env.VUE_APP_TOKEN
  }
}

export class Koortrans {
  constructor (path, parseData) {
    this.state = {
      data: [],
      status: ''
    }

    this.getters = {
    }

    this.actions = {
      get ({ commit }, crsParameter) {
        return new Promise((resolve, reject) => {
          commit('request')
          fetch(environmentAPIDomains[process.env.VUE_APP_NODE_ENV] + path + crsParameter + '?token=' + tokens.get[process.env.VUE_APP_NODE_ENV])
            .then(res => res.json())
            .then(data => {
              commit('success', data)
              resolve(data)
            })
            .catch(err => {
              commit('error', err)
              reject(err)
            })
        })
      },
      clear ({ commit }) {
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
