/**
  vuex系统前端用户存储模块
**/
export const moduleUser = {
  state: {
    selectId: 0, //选中的设备ID
    devices: {
      selectId: 0, //选中的设备ID
      index: {}, //索引
      list: [], //设备数组
      idsOwned: [],
    },
    deviceOptions: [],
    alarmSettingChanged: false,
    bubble: {
      //气泡内容
      coord: [117.284073, 31.75012],
      content: 'Demo',
      hide: true,
      circle: {
        visible: false,
        radius: 2000,
        strokeColor: '#409EFF',
        fillColor: 'rgba(64,158,255, 0.2)'
      }
    },
    popup: {
      header: '',
      topRight: 'GPS',
      coord: [45.4215, 75.6972],
      content: [],
      footer: '',
      visible: false,
      circle: {
        visible: false,
        radius: 2000,
        strokeColor: '#409EFF',
        fillColor: 'rgba(64,158,255, 0.2)'
      }
    },
    visibles: {
      deviceMenu: false, //设备列表
      deviceAddForm: false, //添加设备
      deviceEditForm: false, //编辑设备
      updatePassDialog: false, //密码修改
      districtGeoDialog: false, //行政区域围栏
      groupAddForm: false, //添加分组
      groupEditForm: false, //编辑分组
      groupsDialog: false, //分组管理
      statisticsTripDialog: false, //里程统计
      userConfigDialog: false, //用户配置
      mapLayersDialog: false, //图层管理,
      commandDialog: false, //命令下发
      measureDialog: false,
      reportDialog: false,
      customMsgDialog: false,
      reportDialogRef: false,
    },
    //selectDeviceId:0,//选中的设备ID
    map: {
      type: localStorage.map ? JSON.parse(localStorage.map).type : 'google',
      types: [],
      mode: 0, //模式 0默认全局展示 1跟踪模式  2轨迹回放模式
      center: [45.4215, 75.6972],
      zoom: 17,
      isTrackCenter: true, //画面是否跟随
      deviceIcon: '../static/icon/icon_car_1.png',
      startIcon: '../static/icon/startpoint.png',
      endIcon: '../static/icon/endpoint.png',
      stopIcon: '../static/icon/stoppoint.png',
      move: false //自定义图层是否可平移
    },
    customMsgs: {
      eventOnline: "",
      eventOffline: "",
      eventFenceEnter: "",
      eventFenceExit: "",
      eventOverSpeed: "",
      eventCoolerOff: "",
      eventDoorOpen: "",
      eventVibration: "",
      eventPowerOff: "",
    },
    status: {
      '-1': '断开连接',
      0: 'eventOffline',
      1: 'eventOnline',
      2: 'eventFenceEnter',
      3: 'eventFenceExit',
      4: 'eventOverSpeed',
      5: '报警',
      9: 'eventAlarm',
      10: '拆除报警',
      11: '静默报警',
      12: '低电报警',
      13: 'eventTemp1',
      14: 'eventTemp2',
      15: 'eventTemp3',
      16: 'eventTemp4',
      17: 'eventHumid1',
      18: 'eventHumid2',
      19: 'eventHumid3',
      20: 'eventHumid4',
      21: 'eventCoolerOff',
      22: 'eventFuelOut',
      23: 'eventBatteryVoltage',
      24: 'eventDoorOpen',
      25: 'eventVibration',
      26: 'eventBatteryOut',
      27: 'eventPowerOff'
    }, //事件状态字典
    alarms: {
      sos: '求救报警',
      idle: '静默报警',
      vibration: 'vibration',
      powerOff: 'powerOff',
      powerCut: 'powerOff',
      lowBattery: '低电报警',
      removing: '拆除报警'
    }, //报警字典
    deviceStates: { stop: '停', clockwise: '顺', inverse: '反' }, //设备运转状态
    playAlarmSound: false, //播放报警声音
    control: {
      begin: false,
      pause: false,
      speed: 1,
      index: 0,
      total: 1,
      runStep: 1,
      filterlbs: false
    },
    historyPos: [], //历史轨迹
    geofences: [], //围栏
    selectGeofence: {}, //选中的围栏
    drawGeofences: [], //绘制中的围栏
    draw: {
      //地图上绘制特征事件
      type: '', //绘制类型
      build: '', //需要构建的对象
      enable: false //是否启用
    },
    measure: {
      //测绘事件
      type: 'Circle',
      clean: false,
      editable: false
    },
    message: {
      eventCount: 0 //未读设备消息
    },
    dict: {
      commandViews: {}, //命令格式视图数据
      commandIdsByType: {}, //设备类型对应的命令
      deviceTypes: [] //设备类型字典
    },
    onlineState: {
      online: 0,
      offline: 0,
      notactive: 0
    },
    groups: [], //分组信息
    menuTreeData: {
      nodes: [], //节点数据
      checkedKeys: [], //选中的节点
      list: []
    }, //分组设备树形菜单
    events: [],
    eventTotal: 0,

    customLayers: {
      //自定义图层
      current: {
        //当前选中的图层
      },
      index: {}, //索引
      list: [] //图层数组
    },
    pois: {
      //我的兴趣点
      selectId: 0,
      index: {}, //索引
      list: [] //兴趣点数组
    },
    poiTypes: {
      point: '点',
      linestring: '线',
      circle: '圆',
      polygon: '多边形',
      marker: '图标'
    } //兴趣点类型字典
  }
}
