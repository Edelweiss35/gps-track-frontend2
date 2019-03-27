<template>
  <section class="lbs-bg-transparent   lbs-bg-transparent2">
    <el-tooltip class="item" effect="dark" content="添加" placement="top-start">
     <el-button  type="primary" icon="el-icon-plus" size="mini" :disabled="$store.state.common.user.roleKeys == 'demo'" @click="addVisible=true"></el-button> </el-tooltip>
     <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
      <el-button  type="primary" icon="el-icon-edit" size="mini" :disabled="!this.$store.state.user.customLayers.current" @click="editVisible=true"></el-button> </el-tooltip>
     <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
      <el-button  type="danger" icon="el-icon-delete" size="mini" :disabled="!this.$store.state.user.customLayers.current"  @click="deleteSubmit"></el-button> </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="this.$store.state.user.map.move?'可平移':'不可平移'" placement="top-start">
       <el-button  type="primary" :disabled="$store.state.common.user.roleKeys == 'demo'" size="mini" @click="moveHandler"><font-awesome-icon :icon="this.$store.state.user.map.move?'hand-paper':'lock'"/></el-button> </el-tooltip>
    <el-table :data="this.$store.state.user.customLayers.list" highlight-current-row @current-change="currentChange">
      <el-table-column  width="120"  property="name" :label="$t('common.name')"></el-table-column>
     <el-table-column  property="width" :label="$t('common.width')"></el-table-column>
     <el-table-column  property="height" :label="$t('common.height')"></el-table-column>
     <el-table-column   :label="$t('common.visible')">
       <template slot-scope="scope">
         <el-switch
         v-model="scope.row.visible"
         @change="changeVisible"
         active-color="#13ce66"
         inactive-color="#ff4949">
       </el-switch>
     </template>
     </el-table-column>
    </el-table>

    <el-dialog  title="添加图层" width="30%" :visible.sync="addVisible" append-to-body :lock-scroll="false">
      <el-form label-width="80px" ref="addForm" :model="addForm" >
        <el-form-item label="图层名称" prop="name">
         <el-input type="input" v-model="addForm.name" auto-complete="off"></el-input>
       </el-form-item>
       <el-form-item label="图层地址" prop="url">
        <el-input type="input" v-model="addForm.url" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
       <el-input type="input" v-model="addForm.width" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
       <el-input type="input" v-model="addForm.height" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="coord">
       <el-input type="input" v-model="addForm.coord" auto-complete="off"></el-input>
      </el-form-item>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  title="编辑图层" width="30%" :visible.sync="editVisible" append-to-body :lock-scroll="false">
      <el-form label-width="80px" ref="editForm" :model="editForm" >
        <el-form-item label="图层名称" prop="name">
         <el-input type="input" v-model="editForm.name" auto-complete="off"></el-input>
       </el-form-item>
       <el-form-item label="图层地址" prop="url">
        <el-input type="input" v-model="editForm.url" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
       <el-input type="input" v-model="editForm.width" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="高度" prop="height">
       <el-input type="input" v-model="editForm.height" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="coord">
       <el-input type="input" v-model="formatCoord" auto-complete="off"></el-input>
      </el-form-item>
       </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    </section>
    </template>
<script>

export default {


	data() {
			return {
        addVisible:false,
        editVisible:false,
        addForm:{
          name:"自定义图层",
          url:"http://",
          width:500,
          height:500,
          coord:this.$store.state.user.map.center[0]+','+this.$store.state.user.map.center[1],
          visible:true
        },
        editForm:{
          coord:""
        }
			}
		},
		methods: {
      rowClick(row, event, column) {

     },
     currentChange(currentRow, oldCurrentRow){
       //console.log(currentRow);
       if(currentRow){
         this.$store.dispatch('setCustomLayerValue',{key:'current',value:currentRow});
         this.$store.dispatch('setMapValues',[{key:'center',value:currentRow.coord}]);
         this.editForm = currentRow;
       }

     },
     changeVisible(val){
       var _this = this;
       setTimeout(function(){
         if(_this.$store.state.user.customLayers.current){
           var params = {id:_this.$store.state.user.customLayers.current.id,visible:val};
           _this.$store.dispatch('updateLayer', params);
         }
       },500)

     },
     addSubmit(){
      //  this.$store.dispatch('addLayer',this.addForm);
        //this.addVisible=false;

        this.$store.dispatch('addLayer', this.addForm).then(() => {
          this.addVisible=false;
        }).catch(() => {
        })

     },
     deleteSubmit(){
        this.$store.dispatch('deleteLayer',this.$store.state.user.customLayers.current.id);
     },
     editSubmit(){
       var params = {
          id:this.editForm.id,
          name:this.editForm.name,
          url:this.editForm.url,
          width:this.editForm.width,
          height:this.editForm.height,
          coord:this.editForm.coord.join(","),
          visible:this.editForm.visible
       };
       this.$store.dispatch('updateLayer', params);
       this.editVisible=false;
     },
     moveHandler(){
        this.$store.dispatch('setMapValues',[{key:'move',value:!this.$store.state.user.map.move}]);
     }

		},
		mounted() {

		},
    computed:{
        formatCoord:function(){
          if(this.editForm.coord instanceof Array){
            return this.editForm.coord.join(",");
          }else{
            return this.editForm.coord;
          }
        }

  },

		props: ['visible']
}
</script>
<style>
 .el-table .read-row {
    background: #EFF2F7;
  }
  .name-width {
    /* overflow: hidden; 
    text-overflow:ellipsis; 
    white-space: nowrap; */
  }
  
</style>
