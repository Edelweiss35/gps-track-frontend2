<template>
    <section class="lbs-bg-transparent  lbs-bg-transparent2">
      <el-dialog
       :title="'['+this.$store.state.user.selectGeofence.label+'] 绑定设备'"
       :visible.sync="bindGeoVisible"
       width="60%"
       append-to-body
       :lock-scroll="false"
       >
         <div class="block">
         <el-row>
         <el-col :span="18" :offset="4">
                   <Binds :visible="bindGeoVisible" :by="by"></Binds>
               </el-col>
         </el-row>
       </div>

     </el-dialog>

     <el-tooltip class="item" effect="dark" content="绑定设备" placement="top-start">
      <el-button type="primary"  size="mini" @click.native="bindGeoHanlder(0)" :disabled="!this.$store.state.user.selectGeofence.id||!hasPermission('user:geofence:binddevice')"><font-awesome-icon icon="exchange-alt"/></el-button> </el-tooltip>
       <el-tooltip class="item" effect="dark" content="编辑围栏" placement="top-start">
      <el-button type="warning"  icon="el-icon-edit"  size="mini" @click="editHandler" :disabled="!this.$store.state.user.selectGeofence.id||this.$store.state.user.selectGeofence.description=='行政区域'||!hasPermission('user:geofence:update')"></el-button></el-tooltip>
       <el-tooltip class="item" effect="dark" content="删除围栏" placement="top-start">
      <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeHandler" :disabled="!this.$store.state.user.selectGeofence.id||!hasPermission('user:geofence:update')"></el-button></el-tooltip>

		 <el-dropdown @command="handleCommand">

		   <el-button type="success" size="mini" :disabled="this.$store.state.user.drawGeofences.length>0||!hasPermission('user:geofence:delete')">
		    <i class="el-icon-plus"></i>{{$t("common.create")}}<i class="el-icon-caret-bottom el-icon--right"></i>
		  </el-button>

			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item command="Circle">{{$t("map.geofence.circle")}}</el-dropdown-item>
			    <el-dropdown-item command="Polygon">{{$t("map.geofence.polygon")}}</el-dropdown-item>
			    <el-dropdown-item command="LineString">{{$t("map.geofence.lineString")}}</el-dropdown-item>
			    <el-dropdown-item  command="district">{{$t("map.geofence.district")}}</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
		  <el-table  size="small" :data="geofenceList"
		  highlight-current-row
		  @current-change="handleCurrentChange"
		  >
		    <el-table-column width="200" property="label" :label="$t('common.geofence')"></el-table-column>
		    <el-table-column
		      prop="tag"
		      :label="$t('common.type')"
		      filter-placement="bottom-end">
          <template slot-scope="scope">
  					<el-tag
  					size="mini"
  						type="primary"
  						close-transition>{{scope.row.type === 'circle' ? '圆形' : (scope.row.type==='polygon'&&scope.row.description==='行政区域') ?'行政围栏':scope.row.type==='polygon'?'多边形':scope.row.type==='linestring'?'线形':'未知'}}</el-tag>
  				</template>
		    </el-table-column>

		  </el-table>
      <el-pagination
		  small
      :background="true"
		  layout="prev, pager, next"
		  :total="total"
			@current-change="changePage"
			> {{geofences.length}}
			</el-pagination>

         <DistrictGeo></DistrictGeo>

    </section>
    </template>
<script>
import Binds from '../common/Binds'; //绑定围栏
import DistrictGeo from './District'; //绑定围栏
export default {


	data() {
			return {
					deviceMsgData:{},
          bindGeoVisible:false,
          districtGeoVisible:false,
          by:0,// 0围栏绑定设备 1设备绑定围栏
          geofenceList:[],
  				page:1,
  				total:0,
          pageSize:10
			}
		},
		methods: {
      editHandler(){
            this.$store.dispatch('setSelectGeofenceValue',[{key:'editable',value:true},{key:'color',value:'red'}]);
      },
      removeHandler(){
           this.$store.dispatch('deleteGeofence',this.$store.state.user.selectGeofence);
      },
      bindGeoHanlder(by){
          this.by=by
          this.bindGeoVisible=true

      },
      handleCommand(command) {
		       if(this.$store.state.user.drawGeofences.length>0){
    					 this.$message({
    			            message: '当前有围栏没有保存，请保存后再添加'
    			          });
    					return
    				}

            if(command=='district'){
              this.$store.dispatch('setVisblesFlag', [{key:'districtGeoDialog',value:true}]);
              return;
            }
            var draw = {
               type:command,
               editable:true,
               enable:true
             };
             this.$store.dispatch('setDrawEnable',draw);
		    },
        handleCurrentChange(val) {

             this.$store.dispatch('setSelectGeofence',val);
       },
       changePage(page){
       this.page = page;
       let data ={page:page,array:this.$store.state.user.geofences}
       this.geofences = data;
     }
		},
		 watch: {
			'visible': function() {
		    	if(this.visible){
            this.$store.dispatch('getGeofences');
		    	}else{
            this.$store.dispatch('hideGeofences');
            this.$store.dispatch('setSelectGeofence',{});
          }
		    }
		  },
      computed: {
  		    geofences:{
  					get: function() {
  					this.total = this.$store.state.user.geofences.length;
  					var array =  this.$store.state.user.geofences;
  					var page = 1;
  					var offset = (page - 1) * this.pageSize;
  					return this.geofenceList = (offset + this.pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.pageSize)
  		    },
  				set:function(data){
  					var array = data.array;
  					var page = data.page;
  					var offset = (page - 1) * this.pageSize;
  					this.geofenceList = (offset + this.pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.pageSize)
  				}
  			}
  		},
		mounted() {

		},
    components: {
			"Binds":Binds,
      "DistrictGeo":DistrictGeo
		},
		props: ['visible']
}
</script>
<style>
 .el-table .read-row {
    background: #EFF2F7;
  }
</style>
