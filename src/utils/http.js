import axios from 'axios'
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  //baseURL: "http://"+window.location.hostname+":8085", // api的base_url
  baseURL: 'http://www.maitao365.com:8086', // api的base_url/
  // baseURL: 'http://192.168.124.5:8085', // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (localStorage.user) {
      let token = ''
      //如果存在监控用户信息 并且打开的是监控地图
      if (localStorage.monitorUser && window.location.hash == '#/map') {
        token = JSON.parse(localStorage.getItem('monitorUser')).token
      } else {
        token = JSON.parse(localStorage.getItem('user')).token
      }
      config.headers['token'] = token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 2) {
        Message({
          message: res.data[0].defaultMessage,
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 401:token无效; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          localStorage.removeItem('user')
          localStorage.removeItem('monitorUser')
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
      return Promise.reject('error')
    } else {
      //开发调试放开提示框
      // Message({
      //   message: res.msg,
      //   type: 'success',
      //   duration: 5 * 1000
      // })
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
