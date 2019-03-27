import Vue from 'vue'
import ElementUI from 'element-ui'

import App from './App'
import router from './router'
import store from './vuex/store'
import i18n from './i18n/i18n'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import './assets/css/iconfont/iconfont.css'

import VueAMap, { lazyAMapApiLoaderInstance } from 'vue-amap' //高德地图

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'
import '@/icons' // icon
import '@/permission' // permission control
window.Vue = Vue
require('./utils/lbsmap')
VueAMap.initAMapApiLoader({
  key: '34b45a5981702f30c89bbd3876f71893',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.DistrictSearch','AMap.MarkerClusterer','AMap.RangingTool','AMap.MouseTool'],
  uiVersion: '1.0' // 版本号
});

// lazyAMapApiLoaderInstance.load().then(() => { console.log('AMap load success.') })

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VueAMap)
Vue.use(require('vue-moment'))
Vue.use(ElementUI)
Vue.config.productionTip = false
//按钮操作权限判段
Vue.prototype.hasPermission = permission => {
  let myPermissions = store.state.common.permissions
  if(myPermissions != null && typeof myPermissions != 'undefined') 
    return myPermissions.indexOf(permission) > -1;
  else 
    return false;
}

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: { App }
})
