export default {
    namespaced: true,
    state: {
        temp: []
    },
    getters: {
        getTemp: function (state) {
            return state.temp
        }
    },
    mutations: {
        UPDATE_TEMP(state, payload) {
            state.temp = payload
        }
    },
    actions: {
        setTemp(context, payload) {
            const temp = context.state.temp
            temp.push(payload)
            context.commit('UPDATE_TEMP', temp)
        }
    }
}