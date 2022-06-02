import { Koortrans } from '@/store/shared/Koortrans'
import { parseTrans } from '@/store/shared/ParseData'
import { transGet } from '@/store/shared/Paths'

// eslint-disable-next-line one-var
const crud = new Koortrans(transGet, parseTrans),
  state = crud.state,
  getters = crud.getters,
  actions = crud.actions,
  mutations = crud.mutations

export const trans = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
