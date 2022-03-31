import { environmentAPIDomains } from '@/store/shared/Paths'

const tokens = {
  get: {
    production: process.env.TOKEN,
    development: process.env.TOKEN,
    staging: process.env.TOKEN
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
      get ({ commit, dispatch }, crsParameter) {
        return new Promise((resolve, reject) => {
          commit('request')
          fetch('https://' + environmentAPIDomains[process.env.NODE_ENV] + path + crsParameter + '?token=' + tokens.get[process.env.NODE_ENV])
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
