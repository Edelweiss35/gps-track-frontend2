<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-form :inline="true">
          <el-select v-model="type" :placeholder="$t('system.cacheType')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

        <el-form-item>
          <el-button type="primary" v-on:click="clean">{{$t('system.cleanUp')}}</el-button>
        </el-form-item>
      </el-form>
      </el-col>

    </el-row>


  </div>
</template>

<script>
import { cleanCache } from '@/api/api'

export default {
  data() {
    return {
        type:'permiss',
        options: [{
           value: 'token',
           label: this.$t('system.userToken')
         },
          {
           value: 'permiss',
           label: this.$t('system.rolePermis')
         }],

    }

  },

  methods: {
    clean() {
      cleanCache(this.type).then(data => {
        this.$message({
         message: this.$t('system.cleanSuccess'),
         type: 'success'
       });
      })
    },

  }
}
</script>
