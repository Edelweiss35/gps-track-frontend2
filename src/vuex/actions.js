// src/store/actions.js
import {
  userLogin,
  getUserPermissions,
  getLastPosition,
  getDevices,
  getDeviceIdsOwned,
  getHistoryPosition,
  getGeofences,
  updateGeofence,
  addGeofence,
  deleteGeofence,
  getUserInfo,
  getCommandViews,
  getDeviceTypes,
  getCommonRoles,
  getGroups,
  getDevicesTree,
  userExit,
  getLayers,
  updateLayer,
  addLayer,
  deleteLayer,
  getPois,
  addPoi,
  deletePoi,
  updatePoi,
  getConfigByMaps
} from '../api/api'
import * as types from './mutation-types'

import store from './store'
import router from '../router'
import { asyncRouterMap } from '@/router/index'
import rUtil from '../utils/routerUtil'
import util from '@/utils/util'
import MenuUtils from '@/utils/MenuUtils'

export default {
  ToggleSideBar: ({ commit }) => {
    commit(types.SYSTEM_TOGGLE_SIDEBAR)
  },

  // 登录
  Login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      userLogin(loginForm)
        .then(data => {
          localStorage.user = JSON.stringify(data)
          store.dispatch('initCommonData').then(res => {
            router.addRoutes(res)
            if (store.state.common.user.groupId === 0) {
              router.push({ path: '/map' })
            } else {
              router.push({ path: '/dashboard' })
            }
          })
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 登出
  Exit({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit(types.COMMON_UPDATA_USER_INFO, [])
      localStorage.removeItem('user')
      localStorage.removeItem('monitorUser')
      resolve()
    })
  },
  cleanToken({ commit, state }) {
    userExit().then(data => {})
  },

  //初始化公共数据
  initCommonData({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 获取用户权限
      getUserPermissions()
        .then(data => {
          //储存菜单信息
          let routes = []
          if (data.user.groupId == 1) {
            let arrs = util.listToTree('id', 'parentId', data.routers)
            MenuUtils(routes, arrs)
            //如果是管理员默认路径进入后端
            routes.push({ path: '', redirect: '/dashboard' })
            commit(types.COMMON_INIT_ROUTERS, routes)
          } else {
            //如果是用户默认路径进入地图监控
            routes.push({ path: '', redirect: '/map' })

            setTimeout(() => {
              store.dispatch('initPois')
              store.dispatch('initLayers')
            }, 2000)

            commit(types.COMMON_INIT_ROUTERS, routes)
          }

          //储存用户角色
          commit(types.COMMON_UPDATA_USER_INFO, [
            { key: 'account', value: data.user.account },
            { key: 'roleKeys', value: data.user.roleKeys },
            { key: 'groupId', value: data.user.groupId }
          ])
          commit(types.COMMON_INIT_USER_PERMISSIONS, data.permissions)
          //获取角色数据
          getCommonRoles().then(data => {
            commit(types.COMMON_INIT_ROLES, data)
          })

          resolve(routes)
        })
        .catch(error => {
          reject(error)
          //console.log('验证失败,请重新登录');
          store.dispatch('Exit').then(() => {
            window.location.href = '/'
          })
        })
    })
  },

  /**
      老平台接口开始
    **/
  updateDeviceStatus({ commit }, status) {
    commit(types.USER_UPDATE_DEVICE_STATUS, status)
  },
  updateDevicePosition({ commit }, positions) {
    commit(types.USER_UPDATE_DEVICE_POSITION, positions)
  },
  initData({ commit }, vals) {
    getConfigByMaps().then(data => {
      let mapTypes = JSON.parse(data)
      commit(types.USER_SET_MAP_VALUES, [{ key: 'types', value: mapTypes }])
    })

    store.dispatch('initSystem', [
      { key: 'lang', value: localStorage.lang || 'en' }
    ])

    var onlineState = {
      online: 0,
      offline: 0,
      notactive: 0
    }
    //获取所有设备
    getDevices().then(data => {
      var devices = {
        selectId: 0,
        index: {},
        list: []
      }
      if(store.state.common.user.roleKeys == "demo") {
        data.map(item => {
          item.name = item.name.substr(0,2) + "***" + item.name.charAt(item.name.length - 1)
        })
      }
      var deviceIndexHash = new Object()
      for (var i = 0; i < data.length; i++) {
        // console.log(data[i])
        devices.index[data[i].id] = i
        devices.list[i] = data[i]
        devices.list[i].motion = 0
        //  devices.list[i].todayTrip = 0;
        //devices.list[i].trip = 0;
        //devices.list[i].state = JSON.parse(data[i].state||"{}");
        devices.list[i].marker = {
          id: data[i].id,
          label: data[i].name,
          coord: [],
          color: data[i].status == 0 ? '#cccccc' : '#aaff56',
          angle: 0,
          visible: true,
          icon: (devices.list[i].icon != null && devices.list[i].icon != "") ? devices.list[i].icon : 'default',
        }
        if (data[i].status == 1) {
          onlineState.online++
        } else if (data[i].status == 0) {
          onlineState.offline++
        } else {
          onlineState.notactive++
        }
      }
      commit(types.USER_INIT_DEVICES, {
        devices: devices,
        onlineState: onlineState
      })
      // get device ids that current user owned
      getDeviceIdsOwned().then(res => {
        if (res.length > 0) {
          commit(types.USER_INIT_DEVICES_OWNED, res)
        }
      })
      // 获取设备位置
      getLastPosition().then(res => {
        if (res.length > 0) {
          let position = res[0]
          commit(types.USER_SET_MAP_VALUES, [
            { key: 'center', value: [position.longitude, position.latitude] }
          ])
        }
        commit(types.USER_UPDATE_DEVICE_POSITION, res)
      })

      //初始化设备树形菜单
      getDevicesTree().then(data => {
        let checkedKeys = []
        let lastIdInGroups = 0;
        if(store.state.common.user.roleKeys == "demo") {
          data.map(item => {
            item.name = item.name.substr(0,2) + "***" + item.name.charAt(item.name.length - 1)
          })
        }
        for(var i = 0; i < data.length; i++) {
          if(data[i].type == 'group' && data[i].id > lastIdInGroups)
            lastIdInGroups = data[i].id
        }
        data.forEach(node => {
          if(node.type == "group") {
            checkedKeys.push(node.id)
            node._id = node.id
          }
          else if(node.type == "device") {
            node._id = node.id
            lastIdInGroups++
            node.id = lastIdInGroups
            checkedKeys.push(node.id)
          }
        })
        let nodes = util.listToTree('id', 'parentId', data)
        commit(types.USER_INIT_TREE_DATA, {
          nodes: nodes,
          checkedKeys: checkedKeys,
          list: data
        })
      })

      //获取未读的消息条数
      getUserInfo().then(res => {
        commit(types.USER_SET_MESSAGE_VALUE, {
          key: 'eventCount',
          value: res.messages.unReadEventCount
        })
      })
    })
  },

  isShowBoubble({ commit }) {
    commit(types.USER_IS_SHOW_BUBBLE)
  },
  ////////////////////////////////////////////////
  setVisblesFlag({ commit }, payload) {
    commit(types.USER_SET_VISIBLES_FLAG, payload)
  },
  setSelectDeviceId({ commit }, index) {
    commit(types.USER_SET_SELECT_DEVICE_ID, index)
  },
  isTrackCenter({ commit }) {
    commit(types.USER_IS_TRACK_CENTER)
  },
  addDevice({ commit }, device) {
    commit(types.USER_ADD_DEVICE, device)
  },
  setPlayAlarmSound({ commit }, payload) {
    commit(types.USER_SET_PLAY_ALARM_SOUND, payload)
  },
  setMapValues({ commit }, payloads) {
    commit(types.USER_SET_MAP_VALUES, payloads)
  },
  setDeviceMarkersVisible({ commit }, payload) {
    commit(types.USER_SET_DEVICE_MARKERS_VISIBLE, payload)
  },
  setControlValue({ commit }, payload) {
    commit(types.USER_SET_CONTROL_VALUE, payload)
  },
  removeHistoryPositions({ commit }) {
    commit(types.USER_REMOVE_HISTORY_POSITIONS)
  },
  getHistoryPositons({ commit }, params) {
    return new Promise((resolve, reject) => {
      getHistoryPosition(params)
        .then(res => {
          commit(types.USER_GET_HISTORY_POSITIONS, res)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getGeofences({ commit }) {
    getGeofences().then(res => {
      commit(types.USER_GET_GEOFENCES, res)
    })
  },
  hideGeofences({ commit }) {
    commit(types.USER_HIDE_GEOFENCES)
  },
  setSelectGeofence({ commit }, geofence) {
    commit(types.USER_SET_SELECT_GEOFENCE, geofence)
  },
  setSelectGeofenceValue({ commit }, prop) {
    commit(types.USER_SET_SELECT_GEOFENCE_VALUE, prop)
  },
  updateGeofence({ commit }, geofence) {
    let params = {
      id: geofence.id,
      area: geofence.area,
      name: geofence.label,
      type: geofence.type
    }
    updateGeofence(params).then(res => {
      commit(types.USER_UPDATE_SELECT_GEOFENCE, params)
    })
  },
  setDrawEnable({ commit }, prop) {
    commit(types.USER_SET_DRAW_ENABLE, prop)
  },
  setMeasureEnable({ commit }, prop) {
    commit(types.USER_SET_MEASURE_ENABLE, prop)
  },
  setDrawGeofence({ commit }, geofence) {
    commit(types.USER_SET_DRAW_GEOFENCE, geofence)
  },
  saveDrawGeofence({ commit }, geofence) {
    geofence.type = geofence.type.toLowerCase()
    addGeofence(geofence).then(res => {
      commit(types.USER_SAVE_DRAW_GEOFENCE, res)
    })
  },
  deleteGeofence({ commit }, payload) {
    deleteGeofence(payload).then(res => {
      commit(types.USER_DELETE_SELECT_GEOFENCE, res)
    })
  },
  setMessageValue({ commit }, payload) {
    commit(types.USER_SET_MESSAGE_VALUE, payload)
  },

  // updateDeviceState({ commit }, devState) {
  // 	commit(types.USER_UPDATE_DEVICE_STATE, devState)
  // },
  initStaticData({ commit }, payload) {
    var commands = []
    var cmdIds = []
    var deviceTypes = []
    getCommandViews().then(res => {
      res.views.forEach(command => {
        commands[command.id] = command
      })
      res.commandIdsByType.forEach(row => {
        cmdIds[row.typeId] = row.commandIds.split(',')
      })
    })

    getDeviceTypes().then(data => {
      deviceTypes = data
      commit(types.USER_INIT_STATIC_DATA, {
        commands: commands,
        ids: cmdIds,
        deviceTypes: deviceTypes
      })
    })
  },

  updatePageSize({ commit }, val) {
    commit(types.COMMON_UPDATE_PAGE_SIZE, val)
  },
  setMarkersVisible({ commit }, payload) {
    commit(types.USER_SET_MARKER_VISIBLE, payload)
  },
  initGroups({ commit }) {
    getGroups().then(data => {
      var groups = util.listToTree('id', 'groupId', data)
      commit(types.USER_INIT_GROUPS, groups)
    })
  },
  lookDevicesMotionState({ commit }) {
    commit(types.USER_LOOK_DEVICES_MOTION_STATE)
  },
  getEvents({ commit }, payload) {
    commit(types.USER_GET_EVENTS, payload)
  },
  setCustomLayerValue({ commit }, payload) {
    commit(types.USER_SET_CUSTOMLAYER_VALUE, payload)
  },
  updateLayer({ commit }, payload) {
    updateLayer(payload).then(data => {})
  },
  addLayer({ commit }, payload) {
    addLayer(payload).then(data => {
      store.dispatch('initLayers')
    })
    // new Promise((resolve, reject) => {
    // 	addLayer(payload).then((res) => {
    // 		store.dispatch('initLayers');
    // 		resolve()
    // 	}).catch(error => {
    //       //console.log(error);
    // 		reject(error)
    // 	})
    //  });
  },
  deleteLayer({ commit }, id) {
    deleteLayer(id).then(data => {
      store.dispatch('initLayers')
    })
  },
  initLayers({ commit }) {
    //获取自定义图层
    getLayers().then(data => {
      var customLayers = {
        selectId: 0,
        index: {},
        list: []
      }
      for (var i = 0; i < data.length; i++) {
        var coords = data[i].coord.split(',')
        customLayers.index[data[i].id] = i
        customLayers.list[i] = data[i]
        customLayers.list[i].coord = [
          parseFloat(coords[0]),
          parseFloat(coords[1])
        ]
      }
      commit(types.USER_INIT_CUSTOMLAYERS, customLayers)
    })
  },
  initPois({ commit }) {
    getPois().then(data => {
      var pois = {
        selectId: 0,
        index: {},
        list: []
      }
      for (var i = 0; i < data.length; i++) {
        pois.index[data[i].id] = i
        pois.list[i] = data[i]
        pois.list[i].styles = JSON.parse(data[i].styles)
        pois.list[i].editable = false
      }
      commit(types.USER_INIT_POIS, pois)
    })
  },
  setPoiValue({ commit }, payload) {
    commit(types.USER_SET_POI_VALUE, payload)
  },
  addPoi({ commit }, payload) {
    addPoi(payload).then(data => {
      commit(types.USER_ADD_POI, data)
    })
  },
  deletePoi({ commit }, id) {
    var pois = { selectId: 0, index: {}, list: [] }
    commit(types.USER_INIT_POIS, pois)
    deletePoi(id).then(data => {
      store.dispatch('initPois')
    })
  },
  updatePoi({ commit }, payload) {
    updatePoi(payload).then(data => {})
  },
  initSystem({ commit }, payloads) {
    commit(types.COMMON_INIT_SYSTEM, payloads)
  },
  updateEvents({ commit }, payloads) {
    commit(types.COMMON_UPDATE_EVENTS, payloads)
  },
  initUserSetting({ commit }) {
    commit(types.INIT_USER_SETTING)
  },
  updateUserSetting({ commit }, payload) {
    commit(types.UPDATE_USER_SETTING, payload)
  },
  zoomIn({ commit }) {
    commit(types.ZOOM_IN)
  },
  zoomOut({ commit }) {
    commit(types.ZOOM_OUT)
  },
  setMapCenter({ commit }, payload) {
    commit(types.SET_MAP_CENTER, payload)
  },
  setCustomMsgs({ commit }) {
    commit(types.SET_CUSTOM_MESSAGES)
  },
  getCustomMsgs({ commit }) {
    commit(types.GET_CUSTOM_MESSAGES)
  },
  setAlarmSettingFlag({ commit }, payload) {
    commit(types.SET_ALARM_SETTING_FLAG, payload)
  }
}
