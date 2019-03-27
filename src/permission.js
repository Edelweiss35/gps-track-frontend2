import router from './router'
import store from './vuex/store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import util from '@/utils/util'
import {constantRouterMap} from '@/router/index'

if (localStorage.user) {
  store.dispatch('initCommonData').then(data => {
    router.addRoutes(data)
  })
}


const whiteList = ['/login','/register','/install'] // 不重定向白名单
router.beforeEach((to, from, next) => {

  NProgress.start()

  if (localStorage.user) {
    if (to.path === '/login') {
        next({ path: '/' })
    }else {
          next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
