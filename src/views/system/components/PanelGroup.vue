<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('setting.online') + "/" + $t('system.totalUser')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.userOnline" :duration="2600"></count-to>/
          <count-to class="card-panel-num" :startVal="0" :endVal="data.userCount" :duration="2600"></count-to>
          <el-progress :percentage="userPercentage" status="success" :show-text="false"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-device">
          <svg-icon icon-class="device" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('setting.online') + "/" + $t('system.totalDevice')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.online" :duration="3000"></count-to>/
          <count-to class="card-panel-num" :startVal="0" :endVal="data.deviceCount" :duration="3000"></count-to>
          <el-progress :percentage="devicePercentage" :show-text="false"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-alarm">
          <svg-icon icon-class="alarm" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('system.unreadAlarm')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.unread" :duration="3200"></count-to>/
          <count-to class="card-panel-num" :startVal="0" :endVal="data.eventCount" :duration="3200"></count-to>
          <el-progress :percentage="eventPercentage" status="exception" :show-text="false"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-geofence">
          <svg-icon icon-class="geofence" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('system.nFences')}}</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.geofenceCount" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getCounts } from '@/api/api'
export default {
  props: {
    data:Object
  },
  data() {
    return {

    }

  },
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  },
  created() {
  },
  computed: {
    // 计算属性的 getter
    userPercentage: function () {
      if(this.data.userCount){
        return Math.ceil((this.data.userOnline/this.data.userCount)*100);
      }else{
        return 0;
      }

    },
    devicePercentage: function () {
      if(this.data.deviceCount){
          return Math.ceil((this.data.online/this.data.deviceCount)*100);
      }else{
          return 0;
      }

    },
    eventPercentage: function () {
        if(this.data.eventCount){
            return Math.ceil((this.data.unread/this.data.eventCount)*100);
        }else{
          return 0;
        }

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #67C23A;
      }
      .icon-device {
        background: #409EFF;
      }
      .icon-alarm {
        background: #F56C6C;
      }
      .icon-geofence {
        background: #E6A23C
      }
    }
    .icon-people {
      color: #67C23A;
    }
    .icon-device {
      color: #409EFF;
    }
    .icon-alarm {
      color: #F56C6C;
    }
    .icon-geofence {
      color: #E6A23C
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
