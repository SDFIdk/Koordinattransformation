import { Koortrans } from '@/store/shared/Koortrans'
import { parseCRSInformation } from '@/store/shared/ParseData'
import { crsGet } from '@/store/shared/Paths'

// eslint-disable-next-line one-var
const crud = new Koortrans(crsGet, parseCRSInformation),
  state = crud.state,
  getters = crud.getters,
  actions = crud.actions,
  mutations = crud.mutations

export const CRSInformation = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
