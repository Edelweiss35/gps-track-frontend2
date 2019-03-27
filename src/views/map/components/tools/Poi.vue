<template>
  <section class="lbs-bg-transparent   lbs-bg-transparent2">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="POI" name="poilist">
      <el-table  size="small" :data="poiList" highlight-current-row @current-change="currentChange">
         <el-table-column  width="120"  property="name" :label="$t('common.name')"></el-table-column>
         <el-table-column width="120" :label="$t('common.type')">
           <template slot-scope="scope">
             {{$store.state.user.poiTypes[scope.row.type]}}
           </template>
         </el-table-column>
         <el-table-column   :label="$t('map.menuOperation')">
           <template slot-scope="scope">
             <el-button size="mini" type="danger" plain @click="handleDelete(scope.row.id)">{{$t('common.delete')}}</el-button>
           </template>

         </el-table-column>

      </el-table>
      <el-pagination
      small
      :background="true"
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
      > {{pois.length}}
      </el-pagination>
    </el-tab-pane>
    <el-tab-pane :label="$t('common.property')" name="property" :disabled="this.$store.state.user.pois.selectId==0">
      <el-form ref="editForm" :model="editForm" label-width="80px" size="mini">
        <el-form-item :label="$t('common.name')">
          <el-input v-model="editForm.name" :disabled="!editForm.editable"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.type')">
          <el-input v-model="$store.state.user.poiTypes[editForm.type]" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="editForm.styles.strokeColor" label="边框颜色">
          <el-color-picker v-model="editForm.styles.strokeColor" :disabled="!editForm.editable" @active-change="changeStrokeColor"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="editForm.styles.strokeWidth" :label="$t('common.width')">
           <el-input-number v-model="editForm.styles.strokeWidth" :disabled="!editForm.editable" :min="1" :max="20" label="线宽度" @change="changeStrokeWidth"></el-input-number>
        </el-form-item>
        <el-form-item  v-if="editForm.styles.fillColor" label="填充颜色">
          <el-color-picker v-model="editForm.styles.fillColor" :disabled="!editForm.editable" show-alpha @active-change="changeFillColor"></el-color-picker>
        </el-form-item>

        <el-form-item v-if="editForm.styles.radius" label="大小">
           <el-input-number v-model="editForm.styles.radius" :disabled="!editForm.editable" @change="changeRadius"  :min="1" :max="100" label="点大小"></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('common.visible')">
          <el-switch v-model="editForm.visible" :disabled="!editForm.editable"></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="editForm.editable=!editForm.editable">{{editForm.editable?'锁定':'编辑'}}</el-button>
          <el-button type="primary" size="mini" @click="handlerSave" :disabled="!editForm.editable">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="$t('common.create')" :disabled="$store.state.common.user.roleKeys == 'demo'" name="create">
        <el-button type="primary" :plain="$store.state.user.draw.build!='Point'" @click="drawType('Point')"><font-awesome-icon icon="circle"/> {{$t('map.tools.poi.point')}}</el-button>
        <el-button type="primary" :plain="$store.state.user.draw.build!='LineString'" @click="drawType('LineString')"><font-awesome-icon icon="minus"/> {{$t('map.tools.poi.line')}}</el-button>
        <el-button type="primary" :plain="$store.state.user.draw.build!='Circle'" @click="drawType('Circle')"><font-awesome-icon :icon="['far','circle']"/> {{$t('map.tools.poi.circle')}}</el-button><br><br>
        <el-button type="primary" :plain="$store.state.user.draw.build!='Polygon'" @click="drawType('Polygon')"><font-awesome-icon :icon="['fas','square']"/> {{$t('map.tools.poi.polygon')}}</el-button>
        <el-button type="primary" :plain="$store.state.user.draw.build!='Marker'" @click="drawType('Marker')"><font-awesome-icon :icon="['fab','periscope']"/> {{$t('map.tools.poi.marker')}}</el-button>
    </el-tab-pane>
  </el-tabs>
    <!-- <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
     <el-button  type="primary" icon="el-icon-plus" size="mini" @click="addVisible=true"></el-button> </el-tooltip>
     <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
      <el-button  type="primary" icon="el-icon-edit" size="mini" :disabled="this.$store.state.user.pois.selectId==0" @click="editVisible=true"></el-button> </el-tooltip>
     <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
      <el-button  type="danger" icon="el-icon-delete" size="mini" :disabled="this.$store.state.user.pois.selectId==0"  @click="deleteSubmit"></el-button> </el-tooltip> -->



    </section>
    </template>
<script>
export default {

	data() {
			return {
        activeName: 'poilist',
        addVisible:false,
        editVisible:false,
        addForm:{
          name:"POI",
          type:"",
          area:"",
          visible:true
        },
        poiList:[],
        page:1,
        total:0,
        pageSize:10
			}
		},
		methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      rowClick(row, event, column) {

     },
     currentChange(currentRow, oldCurrentRow){
       if(currentRow){
         var point = [];
         if(currentRow.type==="point"){
              point = currentRow.area.split(' ');
         }else{
              point = currentRow.area.split(', ')[0].split(' ');
         }
         this.$store.dispatch('setPoiValue',{key:'selectId',value:currentRow.id});
         this.$store.dispatch('setMapValues',[{key:'center',value:[Number(point[0]),Number(point[1])]}]);
       }

     },
     changeRadius(val){
       var style = {
         radius:val,
         fillColor:this.editForm.styles.fillColor
       }
       this.editForm.styles = style;
     },
     changeFillColor(val){
       var style = this.formatObject(this.editForm.styles)
       style.fillColor = val
       this.editForm.styles = style;
     },
     changeStrokeColor(val){
        var style = this.formatObject(this.editForm.styles)
        style.strokeColor = val
        this.editForm.styles = style;
     },
     changeStrokeWidth(val){
         var style = this.formatObject(this.editForm.styles)
         style.strokeWidth = val
         this.editForm.styles = style;
     },
     drawType(val){
       var draw ={}
       console.log(val+' '+this.$store.state.user.draw.build);
       if(val===this.$store.state.user.draw.build){
         console.log('关闭');
         draw = {
           type:'',
           build:'',
           enable:false
         }
       }else{
          console.log('开启');
         draw = {
           type:val=='Marker'?'Point':val,
           build:val,
           enable:true
         }
       }

       this.$store.dispatch('setDrawEnable',draw);
      },
     formatObject(obj){
       var style={};
       for(var key in obj){
          style[key] = obj[key];
       }
       return style;
     },
     handleDelete(val){
       this.$store.dispatch('deletePoi',val);
     },
     handlerSave(){
       let params = {
         id:this.editForm.id,
         name:this.editForm.name,
         styles:JSON.stringify(this.editForm.styles),
         visible:this.editForm.visible
       }
       this.$store.dispatch('updatePoi', params);
       this.$message({
          message: '保存成功',
          type: 'success'
        });
     },
     changePage(page){
       this.page = page;
       let data ={page:page,array:this.$store.state.user.pois.list}
       this.pois = data;
     }
		},
		mounted() {

		},
    computed:{
      editForm:function(){
          if(this.$store.state.user.pois.selectId!=0){
              return this.$store.state.user.pois.list[this.$store.state.user.pois.index[this.$store.state.user.pois.selectId]];
          }else{
            var editForm = {
              id:0,
              name:'',
              type:'',
              area:'',
              styles:{
                strokeColor:"#409EFF",
                fillColor:"#409EFF",
                strokeWidth:5,
                //radius:5
              },
              visible:false,
              editable:false
            }
            return editForm;
          }

      },
      pois:{
        get: function() {
        this.total = this.$store.state.user.pois.list.length;
        var array =  this.$store.state.user.pois.list;
        var page = 1;
        var offset = (page - 1) * this.pageSize;
        return this.poiList = (offset + this.pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.pageSize)
      },
      set:function(data){
        var array = data.array;
        var page = data.page;
        var offset = (page - 1) * this.pageSize;
        this.poiList = (offset + this.pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + this.pageSize)
      }
    }

  },
  watch: {
    // 'editForm.styles.radius' : function(nv, ov) {
    //     var style = {
    //       radius:this.editForm.styles.radius,
    //       fillColor:this.editForm.styles.fillColor
    //     }
    //     this.editForm.styles = style;
    // }
  },

		props: ['visible']
}
</script>
<style>

</style>
