import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
//import SystemLayout from '../views/layout/SystemLayout'
//import MapLayout from '../views/layout/MapLayout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/install', component: () => import('@/views/install/index'), hidden: true },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/login/register'), hidden: true },
  { path: '/map', component: () => import('@/views/map/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// export const asyncRouterMap = [
//
//     {
//       path: '',
//       component: Layout,
//       redirect: '/dashboard',
//       name: '首页',
//       children: [{
//         path: 'dashboard',
//         component: () => import('@/views/system/index'),
//         meta: { title: '首页', icon: 'home' },
//         menu:'system:dashboard'
//       }]
//     },
//
//   {
//     path: '/users',
//     component: Layout,
//     name: 'User',
//     meta: { title: '用户管理', icon: 'example' },
//     children: [
//       {
//         path: '',
//         name: 'user',
//         component: () => import('@/views/system/users'),
//         meta: { title: '用户管理', icon: 'user' },
//         menu:'system:user:list'
//       }
//     ]
//   },
//   {
//     path: '/system',
//     component: Layout,
//     redirect: '/role',
//     name: 'Role',
//     meta: { title: '系统管理', icon: 'system' },
//     children: [
//       {
//         path: 'role',
//         name: 'Role',
//         component: () => import('@/views/system/system/role'),
//         meta: { title: '角色管理', icon: 'role' },
//         menu:'system:role:list'
//       },
//       {
//         path: 'permis',
//         name: 'permis',
//         component: () => import('@/views/system/system/permis'),
//         meta: { title: '权限管理', icon: 'permis' },
//         menu:'system:permis:list'
//       },
//       {
//         path: 'devicetypes',
//         name: 'devicetypes',
//         component: () => import('@/views/system/system/devicetypes'),
//         meta: { title: '设备类型', icon: 'device' },
//         menu:'system:devicetype:list'
//       },
//       {
//         path: 'logs',
//         name: 'logs',
//         component: () => import('@/views/system/system/logs'),
//         meta: { title: '系统日志', icon: 'log' },
//         menu:'system:log:list'
//       },
//       {
//         path: 'loginlogs',
//         name: 'loginlogs',
//         component: () => import('@/views/system/system/loginlogs'),
//         meta: { title: '登陆日志', icon: 'loginlog' },
//         menu:'system:loginlog:list'
//       }
//     ]
//   }
// ]
