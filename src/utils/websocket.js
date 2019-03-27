import { Message } from 'element-ui'
import messages from '../i18n/langs/index'
import store from '../vuex/store'
let token = ''

if (localStorage.user) {
  //  token = JSON.parse(localStorage.user).token;

  //如果存在监控用户信息 并且打开的是监控地图
  if (localStorage.monitorUser && window.location.hash == '#/map') {
    token = JSON.parse(localStorage.getItem('monitorUser')).token
  } else {
    token = JSON.parse(localStorage.getItem('user')).token
  }
}

const ws = {
  wsServer: 'ws://www.maitao365.com:8086/websocket/' + token,
  // wsServer: 'ws://192.168.124.5:8085/websocket/' + token,
  // wsServer:"ws://"+window.location.hostname+":8085/websocket/"+token,
  websocket: null,
  connection: false, //是否连接成功
  interval: null, //重连定时器
  init: function(val) {
    var self = val
    this.websocket = new WebSocket(this.wsServer)
    this.websocket.onopen = function(evt) {
      ws.connection = true
    }
    this.websocket.onclose = function(evt) {
      if (ws.connection) {
        Message({ message: messages[store.state.common.system.lang].system.disconnected, type: 'error' })
        ws.reconnection()
      }
    }
    this.websocket.onmessage = function(evt) {
      if (evt.data) {
        let socketMsg = JSON.parse(evt.data)
        //console.log("socketMsg"+socketMsg);
        if (socketMsg.positions) {
          //   console.log(socketMsg)
          store.dispatch('updateDevicePosition', socketMsg.positions)
        } else if (socketMsg.devices) {
          //   console.log(devices)
          store.dispatch('updateDeviceStatus', socketMsg.devices)
        } else if (socketMsg.states) {
          //   console.log(states)
          // console.log("updateDeviceState"+socketMsg.states);
          //  self.$store.dispatch('updateDeviceState', socketMsg.states);
        } else if (socketMsg.events) {
          // self.$store.dispatch('updateEvents', socketMsg.events)
        }
      }
    }
    this.websocket.onerror = function(evt) {}
  },
  reconnection: function(val) {
    ws.connection = false
    ws.interval = setInterval(function() {
      if (ws.connection) {
        Message({ message: messages[store.state.common.system.lang].system.reconnected, type: 'success' })
        clearInterval(ws.interval)
      } else {
        Message({ message: messages[store.state.common.system.lang].system.tryConnect, type: 'warning' })
        ws.connection = false
        ws.init(val)
      }
    }, 10000)
  }
}

export default ws
