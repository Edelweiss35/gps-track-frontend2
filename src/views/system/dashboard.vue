<template>
  <div class="dashboard-container">
    <panel-group :data="counts" @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData"></line-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :data="counts"></pie-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import { getCounts } from '@/api/api'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'dashboard',
  data() {
   return {
     counts:{
       userOnline:0,
       userCount:0,
       deviceCount:0,
       eventCount:0,
       geofenceCount:0,
       online:0,
       offline:0,
       notactive:0,
       unread:0
     },
     lineChartData: lineChartData.newVisitis
   }
 },
 methods: {
     init(){
       getCounts().then(data => {
         this.counts = data
       })
     },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  },
  created(){
      this.init();
  },
  mounted(){

  },
  computed: {

  },
  components: {
    PanelGroup,
    LineChart,
    PieChart
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
</style>
