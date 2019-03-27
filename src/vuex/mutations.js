// src/store/mutations.js
import * as types from './mutation-types'
import util from '../utils/util'
import { constantRouterMap } from '@/router/index'
import { Notification, Message } from 'element-ui'
import messages from '../i18n/langs/index'
import { getDeviceInfo } from '../api/api'
import Vue from 'vue'
export default {
  [types.SYSTEM_TOGGLE_SIDEBAR](state) {
    state.system.app.sidebar.opened = !state.system.app.sidebar.opened
  },

  [types.USER_IS_SHOW_BUBBLE](state) {
    if (state.user.popup.visible) {
      state.user.popup.visible = false
    } else {
      state.user.popup.visible = true
    }
  },

  [types.COMMON_UPDATA_USER_INFO](state, payload) {
    payload.forEach(payload => {
      Vue.set(state.common.user, payload.key, payload.value)
      // state.common.user[payload.key] = payload.value
    })
  },
  [types.USER_SET_VISIBLES_FLAG](state, payload) {
    payload.forEach(visible => {
      state.user.visibles[visible.key] = visible.value
    })
  },
  [types.USER_INIT_DEVICES_OWNED](state, vals) {
    Vue.set(state.user.devices, 'idsOwned', vals)
    // state.user.devices.idsOwned = vals
    //	state.user.deviceIndexHash = vals.deviceIndexHash;
  },
  [types.USER_INIT_DEVICES](state, vals) {
    console.log('初始化设备')
    state.user.devices = vals.devices
    if(state.common.user.roleKeys == "demo") {
      state.user.devices.list.map(device => {
        device.name = device.name.substr(0,2) + "***" + device.name.charAt(device.name.length - 1)
        return device
      })
    }
    state.user.deviceOptions = []
    state.user.devices.list.forEach(device => {
      state.user.deviceOptions.push({
        value: device.id,
        label: device.name
      })
    })
    state.user.onlineState = vals.onlineState
    //	state.user.deviceIndexHash = vals.deviceIndexHash;
  },
  [types.USER_UPDATE_DEVICE_POSITION](state, positions) {
    for (var i = 0; i < positions.length; i++) {
      var index = state.user.devices.index[positions[i].deviceId]
      if (typeof index == 'undefined') {
        continue
      }
      
      state.user.devices.list[index].marker.coord = [
        positions[i].longitude,
        positions[i].latitude
      ]
      Vue.set(state.user.devices.list[index], 'lastTime', Date.now())

      state.user.devices.list[index].position = positions[i]
      var attrs = JSON.parse(positions[i].attributes)
      // Object.assign(state.user.devices.list[index], { attributes: attrs })
      Vue.set(state.user.devices.list[index], 'attributes', attrs)

      state.user.devices.list[index].marker.angle = positions[i].course
      state.user.devices.list[index].lastUpdate = positions[i].time
      state.user.devices.list[index].marker.color = state.user.devices.list[
        index
      ].position.alarm
        ? '#00ff00'
        : state.user.devices.list[index].marker.color
      //如果运动状态发生改变
      if (
        state.user.devices.list[index].motion != util.motion(positions[i].time)
      ) {
        state.user.devices.list[index].motion = util.motion(positions[i].time)
      }
      if (state.user.devices.selectId == positions[i].deviceId) {
        var current = positions[i]
        var attributes = JSON.parse(current.attributes)
        if (state.user.map.isTrackCenter) {
          state.user.map.center = [current.longitude, current.latitude]
        }

        state.user.popup.coord = [current.longitude, current.latitude]
        state.user.popup.circle = {
          visible: current.mode != 0 ? true : false,
          radius: current.accuracy || 0,
          strokeColor: '#409EFF',
          fillColor: 'rgba(64,158,255, 0.2)'
        }

        state.user.popup.topRight = util.popupTopRight(current)
        state.user.popup.content = util.popupContent(
          state.user.devices.list[index]
        )
        if (attributes) {
          state.user.popup.footer = util.popupFooter(attributes)
        }
      }
    }
  },
  [types.USER_UPDATE_DEVICE_STATUS](state, devices) {
    var devstatus = devices[0]
    var index = state.user.devices.index[devstatus.id]
    if (typeof index == 'undefined') {
      return
    }
    // state.user.devices.list[index].status = devstatus.status
    state.user.devices.list[index].marker.color =
      devstatus.status == 0 ? '#cccccc' : '#aaff56'
    state.user.devices.list[index].lastUpdate = devstatus.time
    if (state.user.devices.list[index].position) {
      state.user.devices.list[index].motion = util.motion(
        state.user.devices.list[index].position.time
      )
    } else {
      state.user.devices.list[index].motion = 1
    }
    //更新跟踪设备的气泡信息
    if (state.user.devices.selectId == devstatus.id) {
      state.user.popup.content = util.popupContent(
        state.user.devices.list[index]
      )
    }

    Notification({
      title:
        state.user.devices.list[index].name +
        ' ' + 
        messages[state.common.system.lang].map[state.user.status[devstatus.status]].replace("value", devstatus.value),
      message: util.dateFormat(devstatus.time, 'YYYY-MM-DD HH:mm:ss'),
      type: devstatus.status == 1 ? 'success' : 'warning',
      duration: 6000,
      offset: 60
    })
    state.user.playAlarmSound = true
  },
  [types.USER_SET_SELECT_DEVICE_ID](state, deviceId) {
    state.user.map.mode = 1
    state.user.devices.selectId = deviceId
    var index = state.user.devices.index[deviceId]
    let device = state.user.devices.list[index]
    // console.log(device)
    if (device.position) {
      var attributes = JSON.parse(device.position.attributes)
      state.user.popup.visible = true
      state.user.popup.coord = [
        device.position.longitude,
        device.position.latitude
      ]
      state.user.popup.header = device.name
      state.user.popup.topRight = util.popupTopRight(device.position)
      state.user.popup.content = util.popupContent(device)
      if (attributes) {
        state.user.popup.footer = util.popupFooter(attributes)
      }

      if (state.user.map.isTrackCenter) {
        state.user.map.center = [
          device.position.longitude,
          device.position.latitude
        ]
      }
    } else {
      Message(messages[state.common.system.lang].map.invalidLocation)
    }
  },
  [types.USER_IS_TRACK_CENTER](state) {
    if (state.user.map.isTrackCenter) {
      state.user.map.isTrackCenter = false
    } else if (state.user.map.mode == 1) {
      state.user.map.isTrackCenter = true
      var index = state.user.devices.index[state.user.devices.selectId]
      if (state.user.devices.list[index].position) {
        state.user.map.center = [
          state.user.devices.list[index].position.longitude,
          state.user.devices.list[index].position.latitude
        ]
      }
    }
  },
  [types.USER_ADD_DEVICE](state, device) {
    state.user.devices.list.push(device)
    state.user.devices.index[device.id] = state.user.devices.length - 1
  },
  [types.USER_SET_PLAY_ALARM_SOUND](state, payload) {
    state.user.playAlarmSound = payload
  },
  [types.USER_SET_MAP_VALUES](state, payloads) {
    //state.user.map[payload.key] = payload.value
    payloads.forEach(payload => {
      state.user.map[payload.key] = payload.value
    })
  },
  [types.USER_SET_DEVICE_MARKERS_VISIBLE](state, payload) {
    if (payload.select.length == 0) {
      state.user.popup.circle.visible = false
      state.user.devices.list.forEach(device => {
        device.marker.visible = !payload.visible
      })
    } else {
      state.user.devices.list.forEach(device => {
        device.marker.visible = payload.select.indexOf(device.id) != -1
      })
    }
  },
  [types.USER_SET_CONTROL_VALUE](state, payload) {
    state.user.control[payload.key] = payload.value
  },
  [types.USER_REMOVE_HISTORY_POSITIONS](state) {
    state.user.historyPos = []
    state.user.control.begin = false
    state.user.control.pause = false
  },
  [types.USER_GET_HISTORY_POSITIONS](state, data) {
    state.user.historyPos = []
    state.user.control.begin = false

    state.user.control.runStep = 1
    state.user.control.total = 0
    state.user.control.speed = 1
    state.user.control.index = 0

    if (data.length > 0) {
      setTimeout(function() {
        state.user.historyPos = data
        state.user.control.begin = true
      }, 500)
    } else {
      Message(messages[state.common.system.lang].map.noTrack)
    }
  },
  [types.USER_GET_GEOFENCES](state, geofences) {
    state.user.geofences = []
    for (var i = 0; i < geofences.length; i++) {
      state.user.geofences.push({
        id: geofences[i].id,
        label: geofences[i].name,
        type: geofences[i].type,
        area: geofences[i].area,
        description: geofences[i].description,
        editable: false,
        visible: true
      })
    }
  },
  [types.USER_HIDE_GEOFENCES](state) {
    state.user.geofences = []
    state.user.drawGeofences = []
  },
  [types.USER_SET_SELECT_GEOFENCE](state, geofence) {
    if (geofence) {
      state.user.selectGeofence = geofence
      if (geofence && geofence.area) {
        var coord = []
        var point = geofence.area.split(', ')[0].split(' ')
        coord = [Number(point[1]), Number(point[0])]
        state.user.map.center = coord
      }
      for (var i = 0; i < state.user.geofences.length; i++) {
        state.user.geofences[i].editable = false
        state.user.geofences[i].color = 'green'
      }
    }
  },
  [types.USER_SET_SELECT_GEOFENCE_VALUE](state, props) {
    if (!state.user.selectGeofence.id) {
      Message(messages[state.common.system.lang].map.selectFence)
      return
    }
    for (var i = 0; i < state.user.geofences.length; i++) {
      if (state.user.selectGeofence.id == state.user.geofences[i].id) {
        props.forEach(prop => {
          state.user.geofences[i][prop.key] = prop.value
        })

        return
      }
    }
  },
  [types.USER_UPDATE_SELECT_GEOFENCE](state, payload) {
    //console.log(payload.name);
    for (var i = 0; i < state.user.geofences.length; i++) {
      if (payload.id == state.user.geofences[i].id) {
        state.user.geofences[i].label = payload.name
        return
      }
    }
  },
  [types.USER_SET_DRAW_ENABLE](state, payload) {
    state.user.draw = payload
    console.log(state.user.draw)
  },
  [types.USER_SET_MEASURE_ENABLE](state, payload) {
    state.user.measure = payload
  },
  [types.USER_SET_DRAW_GEOFENCE](state, geofence) {
    state.user.drawGeofences = []
    state.user.drawGeofences.push(geofence)
  },
  [types.USER_SAVE_DRAW_GEOFENCE](state, data) {
    state.user.drawGeofences = []
    state.user.geofences.push({
      id: data.id,
      label: data.name,
      type: data.type,
      area: data.area,
      editable: false,
      visible: true
    })
    Message(messages[state.common.system.lang].map.fenceCreateSuccess)
  },
  [types.USER_DELETE_SELECT_GEOFENCE](state, res) {
    for (var i = 0; i < state.user.geofences.length; i++) {
      if (res == state.user.geofences[i].id) {
        state.user.geofences.splice(i, 1)
        Message(messages[state.common.system.lang].map.fenceDeleteSuccess)
        return
      }
    }
  },
  [types.USER_SET_MESSAGE_VALUE](state, payload) {
    state.user.message[payload.key] = payload.value
  },

  [types.USER_INIT_STATIC_DATA](state, payload) {
    state.user.dict.commandViews = payload.commands
    state.user.dict.cmdIdsByType = payload.ids
    state.user.dict.deviceTypes = payload.deviceTypes
  },
  [types.USER_INIT_GROUPS](state, payload) {
    state.user.groups = payload
  },
  [types.USER_INIT_TREE_DATA](state, payload) {
    state.user.menuTreeData = payload
  },
  [types.USER_SET_MARKER_VISIBLE](state, payload) {
    state.user.devices.list[payload.key].marker.visible = payload.value
  },
  [types.COMMON_INIT_USER_PERMISSIONS](state, payload) {
    state.common.permissions = payload
  },
  [types.COMMON_INIT_ROUTERS]: (state, routers) => {
    state.common.addRouters = routers
    state.common.routers = constantRouterMap.concat(routers) //将固定路由和新增路由进行合并, 成为本用户最终的全部路由信息
  },
  [types.COMMON_UPDATE_PAGE_SIZE](state, val) {
    state.common.pageSize = val
  },
  [types.COMMON_UPDATE_PAGE_SIZE](state, val) {
    state.common.pageSize = val
  },
  [types.COMMON_INIT_ROLES](state, val) {
    state.common.roles = val
  },
  [types.USER_LOOK_DEVICES_MOTION_STATE](state) {
    state.user.devices.list.forEach(device => {
      var old = device.motion
      var attributes = {}
      if (old == 1) {
        device.motion = util.motion(device.position.time)
        if (old != device.motion) {
          if (state.user.devices.selectId == device.id) {
            state.user.popup.content = util.popupContent(device)
          }
          console.log(device.name + '通过巡检定为静止')
        }
      }
    })
  },
  [types.USER_GET_EVENTS](state, payload) {
    state.user.events = payload.alarms
    if(typeof payload.totalCount != undefined && payload.totalCount != null)
      state.user.eventTotal = payload.totalCount
  },
  [types.USER_INIT_CUSTOMLAYERS](state, vals) {
    state.user.customLayers = vals
  },
  [types.USER_SET_CUSTOMLAYER_VALUE](state, payload) {
    if (payload) {
      state.user.customLayers[payload.key] = payload.value
    }
  },
  [types.USER_INIT_POIS](state, vals) {
    state.user.pois.list = []
    state.user.pois = vals
  },
  [types.USER_SET_POI_VALUE](state, payload) {
    if (payload) {
      state.user.pois[payload.key] = payload.value
    }
  },
  [types.USER_ADD_POI](state, payload) {
    if (payload) {
      payload.styles = JSON.parse(payload.styles)
      payload.editable = true
      state.user.pois.list.push(payload)
      state.user.pois.index[payload.id] = state.user.pois.list.length - 1
      state.user.pois.selectId = payload.id
    }
  },
  [types.COMMON_INIT_SYSTEM](state, payloads) {
    payloads.forEach(payload => {
      Vue.set(state.common.system, payload.key, payload.value);
      // state.common.system[payload.key] = payload.value
    })
  },
  [types.COMMON_UPDATE_EVENTS](state, payloads) {
    payloads.forEach(payload => {
      // state.user.events.push(payload)
      // Vue.set(state.user.events, state.user.events.length, payload)
      state.user.message.eventCount++
    })
  },
  [types.INIT_USER_SETTING](state) {
    if(localStorage.setting) {
      // Vue.set(state.common, 'setting', JSON.parse(localStorage.setting))
    }
  },
  [types.UPDATE_USER_SETTING](state, payload) {
    state.common.setting = payload
    // Vue.set(state.common, 'setting', payload)
  },
  [types.ZOOM_IN](state) {
    let zoom = state.user.map.zoom + 1
    state.user.map.zoom = zoom;
  },
  [types.ZOOM_OUT](state) {
    let zoom = state.user.map.zoom - 1
    state.user.map.zoom = zoom;
  },
  [types.SET_MAP_CENTER](state, payload) {
    state.user.map.center = payload
  },
  [types.SET_CUSTOM_MESSAGES](state) {
    localStorage.customMsgs = JSON.stringify(state.user.customMsgs)
  },
  [types.GET_CUSTOM_MESSAGES](state) {
    if(localStorage.customMsgs) {
      state.user.customMsgs = JSON.parse(localStorage.customMsgs)
    }
  },
  [types.SET_ALARM_SETTING_FLAG](state, payload) {
    Vue.set(state.user, "alarmSettingChanged", payload)
    // state.user.alarmSettingChanged = payload
  }
}
