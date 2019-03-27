import lazyLoading from './lazyLoading'
export default (routers,data) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换

  generaMenu(routers,data)
}
function generaMenu(routers,data){
  data.forEach((item)=>{
    let menu = Object.assign({},item)
    menu.component = lazyLoading(menu.component)
    // delete menu.id
    // delete menu.parentId
    // delete menu.groupId
    // delete menu.permis
    let meta = {
      title:item.name,
      icon:item.icon
    }
    menu.meta = Object.assign({},meta);
    if(item.type==0&&!item.children&&item.parentId==0){
      item.children = [];
      item.children.push({
          path: '',
          name: item.name,
          component:'/system'+item.path,
          icon:item.icon
      })
    }

    if(!item.leaf&&item.children){
      menu.children = []
      generaMenu(menu.children,item.children)
    }
    routers.push(menu)
  })
}
