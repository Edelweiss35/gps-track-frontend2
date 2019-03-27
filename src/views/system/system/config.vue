<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-form ref="form" :model="config" label-width="120px">
          <el-form-item :label="$t('system.registerEnable')">
            <el-switch
              @change="change"
              v-model="config.registration"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>

          </el-form-item>

          <el-form-item :label="$t('system.mapEnable')">
            <el-checkbox v-for="(map,index) in config.maps" @change="mapsChange" :key="index" v-model="map.enable" :label="map.value">
              {{map.label}}
            </el-checkbox>
          </el-form-item>

        </el-form>

      </el-col>

    </el-row>


  </div>
</template>

<script>
import { getConfig,updateConfig } from '@/api/api'

export default {
  data() {
    return {
        config:{
          registration: true,
          maps:[]
        },
        checked:true

    }

  },

  methods: {
    init() {
      getConfig().then(data => {
          this.config = data;
          this.config.maps = JSON.parse(data.maps)
      })
    },
    change(val){
      let param = {registration:val}
      updateConfig(param).then(data => {
          this.$message({
           message: this.$t('system.confSuccess'),
           type: 'success'
         });
          this.config.registration = data.registration;
      })
    },
    mapsChange(){
      let param = {
        registration:this.config.registration,
        maps:JSON.stringify(this.config.maps)
      }
      updateConfig(param).then(data => {
          this.$message({
           message: this.$t('system.confSuccess'),
           type: 'success'
         });
      })
    }

  },

  mounted() {
      this.init();
  }
}
</script>
