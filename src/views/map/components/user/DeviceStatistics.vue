<template>
  <section>
		<el-dialog :title="$t('map.user.deviceStatistics.title')+' '+title"  width="80%" :visible="$store.state.user.visibles.statisticsTripDialog" :before-close="handleClose" :lock-scroll="false">

      <el-row>
        <el-col :span="24">

                <span class="demonstration">{{$t('map.user.deviceStatistics.selectTime')}}</span>
                 <el-date-picker
                   v-model="timeRange"
                   type="daterange"
                   :picker-options="pickerOptions"
                   range-separator="至"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期"
                   align="right">
                 </el-date-picker>
                 <el-select v-model="column" placeholder="请选择">
                  <el-option
                    v-for="item in columns"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                  <el-button type="primary" @click="init">{{$t('common.query')}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
           <span class="demonstration">{{$t('map.user.deviceStatistics.selectDevices')}}</span>
          <el-tree
  				  ref="tree"
  				  :data="$store.state.user.menuTreeData.nodes"
  				  show-checkbox
  				  node-key="id"
  					:default-expand-all="true"
  					:highlight-current='true'
  				  :props="defaultProps"
  					:render-content="renderContent"
            @check-change="handleCheckChange"
  					:default-checked-keys="$store.state.user.menuTreeData.checkedKeys"
  					>
  				</el-tree>
        </el-col>
        <el-col :span="20">
          <div class='chart-container'>
            <chart ref="chart1" height='100%' width='100%' :title="title"  :legend="legend" :series="series" :times="times" :unit="unit"></chart>
          </div>
        </el-col>
      </el-row>


</el-dialog>
</section>
</template>

<script>
import util from '@/utils/util'
import Chart from '@/components/Charts/barChart'
import { getStatisticsDevice } from '@/api/api'
export default {
  name: 'deviceStatistics',
  data() {
    return {
      columns:[{
          value: 'trip',
          label: this.$t('map.popupMileage')
        }, {
          value: 'geofenceEnter',
          label: this.$t('map.eventFenceEnter')
        }, {
          value: 'geofenceExit',
          label: this.$t('map.eventFenceExit')
        }],
      pickerOptions: {
           shortcuts: [{
             text: '最近一周',
             onClick(picker) {
               const end = new Date();
               const start = new Date();
               start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
               picker.$emit('pick', [start, end]);
             }
           }, {
             text: '最近一个月',
             onClick(picker) {
               const end = new Date();
               const start = new Date();
               start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
               picker.$emit('pick', [start, end]);
             }
           }, {
             text: '最近三个月',
             onClick(picker) {
               const end = new Date();
               const start = new Date();
               start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
               picker.$emit('pick', [start, end]);
             }
           }]
         },
         timeRange:[util.getBefareDay(7), new Date()],
         legend:[],
         series:[],
         times:[],
         column:'trip',//查询的维度
         title:'里程统计',
         unit:'km',
         defaultProps: {
             children: 'children',
             label: 'name'
           }
    }
  },
  methods: {
   init(){
    this.legend=[]
    this.series=[]
    this.times=[]
    switch(this.column)
      {
      case 'trip':
        this.title=this.$t('map.popupMileage')
        this.unit='km'
        break;
      case 'geofenceEnter':
        this.title=this.$t('map.eventFenceEnter')
        this.unit='次'
        break;
      case 'geofenceExit':
        this.title=this.$t('map.eventFenceExit')
        this.unit='次'
        break;
      default:
        this.title='里程统计'
      }
     let deviceIds = []
     if(this.$refs.tree){
       let nodes = this.$refs.tree.getCheckedNodes();
       for(var i=0;i<nodes.length;i++){
         if(nodes[i].type==='device'){
           deviceIds.push(nodes[i]._id)
         }
       }
     }else{
       this.$store.state.user.devices.list.forEach(device => {
   				deviceIds.push(device.id)
   		 });
     }

     var start = util.dateFormat(this.timeRange[0],'YYYY-MM-DD');
     var end = util.dateFormat(this.timeRange[1],'YYYY-MM-DD');
     this.times = util.getDayAll(start,end);
     if(deviceIds.length==0){
       this.$message({
         message: '请至少选择一个设备',
         type: 'warning'
       });
       return;
     }
     let params = {deviceIds:deviceIds.join(','),column:this.column,start:start,end:end}
     getStatisticsDevice(params).then((data) => {
           for(var i=0;i<data.length;i++){
             let vals  = data[i].vals.split(',');
             let sdates  = data[i].sdates.split(',');
             let tsHash = {}
             for(var j=0;j<sdates.length;j++){
               tsHash[sdates[j]] = vals[j];
             }
             this.legend.push(data[i].name);
             let _this = this;
             this.series.push({
               name: data[i].name,
               type: 'bar',
               data: (function() {
                 let arr = []
                 for(var i=0;i<_this.times.length;i++){
                       if(tsHash[_this.times[i]]){
                         arr.push(parseFloat(tsHash[_this.times[i]]))
                       }else{
                         arr.push(0)
                       }
                 }
                 return arr
               }())
             })
           }
           this.$refs.chart1.refresh()
      });
   },
   renderContent(h, { node, data, store }) {
     var dom;
        switch(data.type){
            case 'group':
                dom = (<span><svg-icon icon-class="group" class-name="menu-icon-question blue" /> {node.label}</span>);
                break;
                case 'device':
                    var dev = this.$store.state.user.devices.list[
                      this.$store.state.user.devices.index[data._id]
                    ];
                    if(typeof dev == 'undefined' || dev == null) {
                      status = 0;
                      motion = 0;
                    }
                    else {
                      var status = dev.hasOwnProperty('status') ? dev.status : 0;
                      var motion = dev.hasOwnProperty('motion') ? dev.motion : 0;
                    }
                    // var status = this.$store.state.user.devices.list[this.$store.state.user.devices.index[data.id]].status;
                    // var motion = this.$store.state.user.devices.list[this.$store.state.user.devices.index[data.id]].motion;
                    if(status==1){//在线
                      if(motion==1){
                        dom = (<span><svg-icon icon-class="luntai" class-name="menu-icon-luntai green icon_spin" />  {node.label}</span>)
                      }else{
                        dom = (<span><svg-icon icon-class="luntai" class-name="menu-icon-luntai green" />  {node.label}</span>)
                      }

                    }else if(status==0){
                       dom = (<span><svg-icon icon-class="luntai" class-name="menu-icon-luntai" /> {node.label}</span>)
                    }else{
                       dom = (<span><svg-icon icon-class="question" class-name="menu-icon-question" />  {node.label}</span>)
                    }
                break;
        }


     return  dom;
   },
   handleCheckChange(data, checked, indeterminate){//节点勾选
      if(data.type==='device'){
        console.log(data.id+' '+checked);
      }
    },

   handleClose: function() {
     this.$store.dispatch('setVisblesFlag', [{key:'statisticsTripDialog',value:false}]);
     //this.$refs.chart1.handleDestroy();
   },
 },

 watch: {
  '$store.state.user.visibles.statisticsTripDialog': function() {
      if(this.$store.state.user.visibles.statisticsTripDialog){
         this.init();
      }else{
        this.legend=[]
        this.series=[]
      }
    }
  },
  components: { Chart }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height:55vh;
}
</style>
