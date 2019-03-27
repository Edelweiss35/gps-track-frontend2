//import axios from 'axios';
import axios from '../utils/http'

//用户登录
export const userLogin = params => {
  return axios.post(`users/login`, params).then(res => res.data)
}
//用户注册
export const userRegister = params => {
  return axios.post(`users/register`, params, true).then(res => res.data)
}

//管理员创建用户
export const userAdd = params => {
  return axios.post(`users`, params, true).then(res => res.data)
}

//新增设备
export const deviceAdd = params => {
  return axios.post(`devices`, params).then(res => res.data)
}

//删除设备
export const delDevice = deviceId => {
  return axios.delete(`devices/` + deviceId).then(res => res.data)
}

//更新设备
export const updateDevice = params => {
  return axios.put(`devices/` + params.id, params).then(res => res.data)
}

export const getLastPosition = params => {
  return axios.get(`positions`).then(res => res.data)
}

export const getDevices = params => {
  return axios.get(`devices`).then(res => res.data)
}

export const getDeviceIdsOwned = params => {
  return axios.get('devices/owned').then(res => res.data)
}

//历史轨迹
export const getHistoryPosition = params => {
  return axios
    .get(`positions/history`, { params: params })
    .then(res => res.data)
}

export const getEvents = params => {
  return axios.get(`events`, { params: params }).then(res => res.data)
}

export const getGeofences = params => {
  return axios.get(`geofences`).then(res => res.data)
}

export const updateGeofence = params => {
  return axios.put(`geofences/` + params.id, params).then(res => res.data)
}

export const addGeofence = params => {
  return axios.post(`geofences`, params).then(res => res.data)
}

export const deleteGeofence = params => {
  return axios.delete(`geofences/` + params.id).then(res => res.data)
}

export const getUserInfo = params => {
  return axios.get(`users`).then(res => res.data)
}

export const getUserAccounts = () => {
  return axios.get('users/accounts/').then(res => res.data)
}

export const readEvent = id => {
  return axios.get(`events/` + id).then(res => res.data)
}

export const getDeviceIdsByGeoId = id => {
  return axios.get(`geofences/deviceids/` + id).then(res => res.data)
}

export const unbindDeviceIds = params => {
  return axios.post(`geofences/unbind`, params).then(res => res.data)
}

export const bindDeviceIds = params => {
  return axios.post(`geofences/bind`, params).then(res => res.data)
}

export const getGeofenceIdsByDid = id => {
  return axios.get(`devices/geofenceids/` + id).then(res => res.data)
}

export const bindGeofenceIds = params => {
  return axios.post(`devices/bind`, params).then(res => res.data)
}

export const unbindGeofenceIds = params => {
  return axios.post(`devices/unbind`, params).then(res => res.data)
}

export const getCommandViews = params => {
  return axios.get(`command/views`).then(res => res.data)
}

//字典数据
export const getDeviceTypes = params => {
  return axios.get(`devicetypes`).then(res => res.data)
}
//命令管理
export const sendCommand = params => {
  return axios.post(`command/send`, params).then(res => res.data)
}
//用户管理
export const updatePass = params => {
  return axios.put(`users/updatepass`, params).then(res => res.data)
}
//用户获取权限资源
export const getUserPermissions = params => {
  return axios.get(`users/permissions`).then(res => res.data)
}
//管理员获取用户列表
export const getUserList = params => {
  return axios.get(`users/list`, { params: params }).then(res => res.data)
}

//删除用户
export const deleteUser = id => {
  return axios.delete(`users/` + id).then(res => res.data)
}

//管理员获取角色列表
export const getRoles = params => {
  return axios.get(`roles`).then(res => res.data)
}

//管理员获取权限资源列表
export const getPermissions = groupId => {
  return axios.get(`permissions/` + groupId).then(res => res.data)
}

//添加资源
export const addPermission = params => {
  return axios.post(`permissions`, params).then(res => res.data)
}

//删除权限资源
export const delPermission = id => {
  return axios.delete(`permissions/` + id).then(res => res.data)
}

//添加角色
export const addRole = params => {
  return axios.post(`roles`, params).then(res => res.data)
}

//添加角色
export const deleteRole = id => {
  return axios.delete(`roles/` + id).then(res => res.data)
}

//修改角色
export const updateRole = params => {
  return axios.put(`roles`, params).then(res => res.data)
}

//修改权限信息
export const updatePermission = params => {
  return axios.put(`permissions`, params).then(res => res.data)
}

//修改角色
export const updateUser = params => {
  return axios.put(`users`, params).then(res => res.data)
}

//获取系统日志
export const getLogs = params => {
  return axios.get(`logs`, { params: params }).then(res => res.data)
}

//获取登录日志
export const getLoginLogs = params => {
  return axios.get(`logs/loginlog`, { params: params }).then(res => res.data)
}

//获取系统角色数据
export const getCommonRoles = params => {
  return axios.get(`common/roles`).then(res => res.data)
}

//获取分组设备的树形机构
export const getDevicesTree = params => {
  return axios.get(`devices/tree`).then(res => res.data)
}

//获取分组结构
export const getGroups = params => {
  return axios.get(`groups`).then(res => res.data)
}

// get groups by uid
export const getGroupsByUid = params => {
  return axios.get('groups/' + params).then(res => res.data)
}

//添加分组
export const addGroup = params => {
  return axios.post(`groups`, params).then(res => res.data)
}

//删除分组
export const deleteGroup = id => {
  return axios.delete(`groups/` + id).then(res => res.data)
}

//修改分组
export const updateGroup = params => {
  return axios.put(`groups`, params).then(res => res.data)
}

//分组绑定围栏ids
export const groupBindGeofenceIds = params => {
  return axios.post(`groups/bind`, params).then(res => res.data)
}

export const groupUnBindGeofenceIds = params => {
  return axios.post(`groups/unbind`, params).then(res => res.data)
}

//根据分组id获取绑定的围栏ids
export const getGeofenceIdsByGroupId = id => {
  return axios.get(`groups/geofenceids/` + id).then(res => res.data)
}

//获取设备信息
export const getDeviceInfo = id => {
  return axios.get(`devices/` + id).then(res => res.data)
}

//统计设备信息
export const getStatisticsDevice = params => {
  return axios
    .get(`statistics/device`, { params: params })
    .then(res => res.data)
}

//移动分组设备
export const moveGroup = params => {
  return axios.put(`groups/move`, params).then(res => res.data)
}

//删除类型
export const deleteDeviceType = id => {
  return axios.delete(`devicetypes/` + id).then(res => res.data)
}

//添加分组
export const addDeviceType = params => {
  return axios.post(`devicetypes`, params).then(res => res.data)
}

//修改类型
export const updateDeviceType = params => {
  return axios.put(`devicetypes`, params).then(res => res.data)
}

//整体统计数量
export const getCounts = params => {
  return axios.get(`statistics/counts`).then(res => res.data)
}

//退出登陆
export const userExit = params => {
  return axios.get(`users/exit`).then(res => res.data)
}

//生成token
export const generateToken = id => {
  return axios.put(`users/token/` + id).then(res => res.data)
}

//菜单权限排序
export const permissionSort = params => {
  return axios.put(`permissions/sort`, params).then(res => res.data)
}

//管理员获取设备列表
export const getAllDevices = params => {
  return axios.get(`devices/all`, { params: params }).then(res => res.data)
}

//清理缓存
export const cleanCache = type => {
  return axios.delete(`cache/clean/` + type).then(res => res.data)
}

//获取系统配置
export const getConfig = params => {
  return axios.get(`config`).then(res => res.data)
}

//修改系统配置
export const updateConfig = params => {
  return axios.put(`config`, params).then(res => res.data)
}

//获取注册配置信息
export const getConfigReg = params => {
  return axios.get(`config/register`).then(res => res.data)
}

//删除事件
export const deleteEvent = id => {
  return axios.delete(`events/` + id).then(res => res.data)
}

//获取自定义图层
export const getLayers = params => {
  return axios.get(`layers`).then(res => res.data)
}

//修改自定义图层信息
export const updateLayer = params => {
  return axios.put(`layers`, params).then(res => res.data)
}

//创建图层
export const addLayer = params => {
  return axios.post(`layers`, params).then(res => res.data)
}

//删除图层
export const deleteLayer = id => {
  return axios.delete(`layers/` + id).then(res => res.data)
}

//获取我的兴趣点
export const getPois = params => {
  return axios.get(`pois`).then(res => res.data)
}

//创建兴趣点
export const addPoi = params => {
  return axios.post(`pois`, params).then(res => res.data)
}

//删除兴趣点
export const deletePoi = id => {
  return axios.delete(`pois/` + id).then(res => res.data)
}

//修改兴趣点信息
export const updatePoi = params => {
  return axios.put(`pois`, params).then(res => res.data)
}

//管理员获取设备列表
export const getCmdRecords = params => {
  return axios.get(`command/records`, { params: params }).then(res => res.data)
}

//获取设备的媒体信息
export const getMedias = params => {
  return axios.get(`medias`, { params: params }).then(res => res.data)
}

//安装检查
export const installCheck = params => {
  return axios.get(`install/check`).then(res => res.data)
}

//安装第二步获取AppSecret
export const installSecond = params => {
  return axios.post(`install/second`, params).then(res => res.data)
}

//安装第三步初始化数据
export const installThird = params => {
  return axios.post(`install/third`, params).then(res => res.data)
}

//获取设备的停留记录
export const getStatisticsStop = params => {
  return axios.get(`statistics/stop`, { params: params }).then(res => res.data)
}

//获取地图配置信息
export const getConfigByMaps = params => {
  return axios.get(`config/maps`, { params: params }).then(res => res.data)
}

// get attributes values
export const getAttrValues = params => {
  return axios.get('attributes', { params: params }).then(res => res.data)
}

// add device detail information
export const addDeviceDetail = params => {
  return axios.post('deviceDetail', params).then(res => res.data)
}

// update device detail information
export const updateDeviceDetail = params => {
  return axios.put('deviceDetail', params).then(res => res.data)
}

// get device detail information by device_id
export const getDeviceDetail = params => {
  return axios.get('deviceDetail', { params: params }).then(res => res.data)
}

// update alarm settings
export const updateAlarmSetting = params => {
  return axios.put('alarmsetting', params).then(res => res.data)
}

// get alarm settings
export const getAlarmSetting = device_id => {
  return axios.get('alarmsetting/' + device_id).then(res => res.data)
}

// update user setting
export const updateSetting = params => {
  return axios.put('users/setting', params).then(res => res.data)
}

// delete all events
export const deleteAllEvents = () => {
  return axios.delete('events/all').then(res => res.data)
}

// read all events
export const readAllEvents = () => {
  return axios.get('events/all').then(res => res.data)
}

// get mileage statistics
export const getStatisticsMileage = params => {
  return axios
    .get(`statistics/mileage`, { params: params })
    .then(res => res.data)
}