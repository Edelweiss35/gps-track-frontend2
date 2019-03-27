<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened  :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#BFCBD9" active-text-color="#409EFF">
      <sidebar-item :routes="$store.state.common.routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>

import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    isCollapse() {
      return !this.$store.state.system.app.sidebar.opened
    }
  }
}
</script>
