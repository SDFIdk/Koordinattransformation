import { Koortrans } from '@/store/shared/Koortrans'
import { parseCRS } from '@/store/shared/ParseData'
import { crsGet } from '@/store/shared/Paths'

// eslint-disable-next-line one-var
const crud = new Koortrans(crsGet, parseCRS),
  state = crud.state,
  getters = crud.getters,
  actions = crud.actions,
  mutations = crud.mutations

export const CRS = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
