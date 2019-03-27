<template>
  <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
    <div>
      <svg-icon class-name='international-icon' icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh_CN">中文</el-dropdown-item>
      <el-dropdown-item command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return localStorage.lang
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      localStorage.lang = lang;
      //this.$store.dispatch('setLanguage', lang)
      // this.$message({
      //   message: 'switch language success',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
  color:#ffffff
}

</style>
