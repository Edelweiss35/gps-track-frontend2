
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import {moduleSystem} from './modules/system'
import {moduleUser} from './modules/user'
import {moduleCommon} from './modules/common'


Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
       common:moduleCommon,
       system: moduleSystem,
       user: moduleUser
   },
	mutations,
	actions
})
