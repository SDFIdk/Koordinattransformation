import
Vuex from 'vuex'

import { Koortrans } from '@/store/shared/Koortrans'
import { CRS } from '@/store/koortransAPI/CRS'
import { CRSInformation } from '@/store/koortransAPI/CRSInformation'
import { trans } from '@/store/koortransAPI/trans'

export default Vuex.createStore({
  modules: {
    Koortrans,
    CRS,
    CRSInformation,
    trans
  }
})
