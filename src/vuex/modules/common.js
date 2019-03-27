/**
  vuex通用存储模块
**/
import {constantRouterMap} from '@/router/index'
export const moduleCommon = {

    state: {
      system:{//系统相关信息
        name:'GPSBD',
        version:'1.0.7',
        company:'LBSSOFT',
        date:'2018',
        lang:'en'
      },
      langs: [
        {value: 'en',label: 'English'},
    		{value: 'zh_CN',label: '简体中文'},
    	],
      user:{},//用户信息
      pageSize:10,//单页最大显示条数
    	pageSizes:[10,20, 30, 50, 100],//可选每页显示多少条
      roles:{}, //角色hash值{roleKey:name}
      setting: {
        bubbleShow: {
          battery: true,
          temperature: true,
          power: true,
          signal: false,
        },
        alarm: {
          fenceEnter: true,
          fenceLeave: true,
          online: true,
          offline: true,
          power: true,
          weakSignal: true,
        },
        voice: true,
        tempUnit: '°C',
        speedUnit: 'KM/H',
        emailAlert: true,
      }
    },
    permissions: [],
    routers: constantRouterMap, //本用户所有的路由,包括了固定的路由和下面的addRouters
    addRouters: [], //本用户的角色赋予的新增的动态路由
};
