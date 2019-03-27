<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="6">
        <el-button type="primary" @click="dialogVisible=true" v-if="hasPermission('system:permis:add')">{{$t('system.addPermission')}}</el-button>
      </el-col>
     <el-col :span="8">
        <el-alert
        :title="$t('system.permisDesc')"
        type="warning">
      </el-alert>
     </el-col>

    </el-row>
    <el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
       <el-tab-pane :label="$t('system.userRights')" name="0">
         <tree-table highlight-current-row :data="frontData" :expandAll="expandAll" :columns="columns" border>
           <el-table-column :label="$t('common.type')" width="200">
             <template slot-scope="scope">
             <el-tag :type="scope.row.type==0?'':scope.row.type==1?'success':'warning'"> <i :class="scope.row.type==0?'fa fa-align-justify':'fa fa-stop'"></i> {{scope.row.type==0?$t('system.menu'):$t('system.button')}}</el-tag>
             </template>
           </el-table-column>
           <el-table-column  :label="$t('system.sort')" width="200">
             <template slot-scope="scope">
                <el-button-group>
               <el-button plain type="primary"  icon="el-icon-sort-up" size="small"  @click="handleSort(scope.row.id,1)" v-if="hasPermission('system:permis:update')"></el-button>
               <el-button plain type="warning"  icon="el-icon-sort-down" size="small" @click="handleSort(scope.row.id,0)" v-if="hasPermission('system:permis:update')"></el-button>
               </el-button-group>
             </template>
           </el-table-column>
             <el-table-column :label="$t('system.operations')" width="200">
               <template slot-scope="scope">
                 <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('system:permis:update')">{{$t('system.edit')}}</el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('system:permis:delete')">{{$t('system.delete')}}</el-button>

               </template>
             </el-table-column>
           </tree-table>
       </el-tab-pane>
       <el-tab-pane :label="$t('system.adminAuth')" name="1">
         <tree-table highlight-current-row :data="backData" type="index" :expandAll="expandAll" :columns="columns" border>

           <el-table-column :label="$t('common.type')" width="200">
             <template slot-scope="scope">
               <el-tag :type="scope.row.type==0?'':scope.row.type==1?'success':'warning'"> <i :class="scope.row.type==0?'fa fa-align-justify':'fa fa-stop'"></i> {{scope.row.type==0?$t('system.menu'):$t('system.button')}}</el-tag>
             </template>
           </el-table-column>

           <el-table-column :label="$t('system.sort')" width="200">
             <template slot-scope="scope">
                <el-button-group>
               <el-button plain type="primary"  icon="el-icon-sort-up" size="small"  @click="handleSort(scope.row.id,1)" v-if="hasPermission('system:permis:update')"></el-button>
               <el-button plain type="warning"  icon="el-icon-sort-down" size="small" @click="handleSort(scope.row.id,0)" v-if="hasPermission('system:permis:update')"></el-button>
               </el-button-group>
             </template>
           </el-table-column>
             <el-table-column :label="$t('system.operations')" width="200">
               <template slot-scope="scope">

                 <el-button type="primary" size="small" @click="handleEdit(scope.row)" v-if="hasPermission('system:permis:update')">{{$t('system.edit')}}</el-button>
                 <el-button type="danger" size="small" @click="handleDelete(scope.row)" v-if="hasPermission('system:permis:delete')">{{$t('system.delete')}}</el-button>

               </template>
             </el-table-column>
           </tree-table>
       </el-tab-pane>

     </el-tabs>

    </el-row>

    <el-dialog
    :title="$t('system.addPermission')"
    :visible.sync="dialogVisible"
    width="40%"
    >
      <el-form :model="permisForm" ref="permisValidateForm" label-width="100px" class="demo-ruleForm">
    <el-row :gutter="20">
    <el-col :span="14">
      <el-form-item :label="$t('common.type')" prop="type">
       <el-radio-group v-model="permisForm.type" @change="change">
         <el-radio :label="0">{{$t('system.menu')}}</el-radio>
         <el-radio :label="1">{{$t('system.button')}}</el-radio>
       </el-radio-group>
     </el-form-item>


      <el-form-item
        :label="$t('system.name')"
        prop="name"
        :rules="[{ required: true, message: $t('system.nameRequire')}]"
      >
        <el-input v-model.number="permisForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('system.permisCode')"  prop="permis">
        <el-input v-model.number="permisForm.permis" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="permisForm.type==0" :label="$t('system.component')"  prop="component"  >
        <el-input v-model="permisForm.component" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="permisForm.type==0" :label="$t('system.path')"  prop="path"  >
        <el-input v-model="permisForm.path" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="permisForm.type==0" :label="$t('system.icon')"  prop="icon"  >
        <el-input v-model="permisForm.icon" auto-complete="off"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="10">
        {{$t('system.parentMenu')}} <el-button size="mini"  @click="handleNodeClick(0)">{{$t('system.topMenu')}}</el-button>
        <el-tree :render-content="renderContent" :data="moduleTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>

    </el-col>
  </el-row>



    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t('report.cancel')}}</el-button>
      <el-button type="primary" @click="handleSave">{{$t('report.confirm')}}</el-button>
    </span>
  </el-dialog>


  <el-dialog
  :title="$t('system.editPermission')"
  :visible.sync="editDialogVisible"
  width="40%"
  >
  <el-form :model="editForm" ref="editValidateForm" label-width="100px" class="demo-ruleForm">
    <el-row :gutter="20">
    <el-col :span="14">
      <el-form-item :label="$t('common.type')" prop="type">
       <el-radio-group v-model="editForm.type" disabled>
         <el-radio :label="0">{{$t('system.menu')}}</el-radio>
         <el-radio :label="1">{{$t('system.button')}}</el-radio>
       </el-radio-group>
     </el-form-item>

      <el-form-item
        :label="$t('system.name')"
        prop="name"
        :rules="[{ required: true, message: $t('system.nameRequire')}]"
      >
        <el-input v-model.number="editForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('system.permisCode')"  prop="permis"  >
        <el-input v-model.number="editForm.permis" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.type==0" :label="$t('system.component')"  prop="component"  >
        <el-input v-model="editForm.component" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.type==0" :label="$t('system.path')"  prop="path"  >
        <el-input v-model="editForm.path" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="editForm.type==0" :label="$t('system.icon')"  prop="icon"  >
        <el-input v-model="editForm.icon" auto-complete="off"></el-input>
      </el-form-item>

    </el-col>
    <el-col :span="10">
      {{$t('system.parentMenu')}} <el-button size="mini"  @click="handleNodeClick(0)">{{$t('system.topMenu')}}</el-button>
      <el-tree :render-content="renderContent"  ref="tree" node-key="id" :default-expanded-keys="defaultExpandedKeys" :highlight-current='true' :data="moduleTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>

    </el-col>
  </el-row>


  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">{{$t('report.cancel')}}</el-button>
    <el-button type="primary" @click="editSubmit">{{$t('report.confirm')}}</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import { getPermissions,addPermission,delPermission,updatePermission,permissionSort } from '@/api/api'
import util from '@/utils/util'
import treeTable from '@/components/TreeTable'
export default {
  name: 'treeTableDemo',
  components: { treeTable },
  data() {
    return {
      columns: [
       {
         text: this.$t('system.name'),
         value: 'name',
         width: 200
       },
       {
         text: this.$t('system.permisCode'),
         value: 'permis'
       }
     ],
      expandAll: true,
      defaultExpandedKeys:[],
      frontData:[],
      backData:[],
      originalData:[],
      dialogVisible:false,
      editDialogVisible:false,
      permisForm:{
        type:0,
        parentId:0
      },
      activeName:'1',
      editForm:{
        parentId:0
      },
      //点击选中的节点
      parentId:-1,
      moduleTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }

    }
  },
  created() {
    this.init(1)
  },
  methods: {
    init(groupId){
      getPermissions(groupId).then(data => {
        this.originalData = data;
        this.moduleTreeData = this.extractPermisModule(data);
        var treeData = util.listToTree('id','parentId', data);
        if(groupId==0){
          this.frontData = treeData
        }else if(groupId==1){
          this.backData = treeData
        }
      //   this.$nextTick(() => {
      //    this.setSort()
      //  })
      })

    },
    handleClick(tab, event) {
       this.permisForm.parentId = 0;
       this.init(tab.name)
       this.activeName = tab.name;
     },

    handleSave(){
      this.$refs.permisValidateForm.validate((valid) => {
       if (valid) {
         if(this.parentId==-1){
           this.parentId = 0;
         }
         this.permisForm.groupId = this.activeName;
         this.permisForm.parentId = this.parentId;
         addPermission(this.permisForm).then((res) => {
             this.dialogVisible=false;
             this.init(this.activeName);
         });
       } else {
         return false;
       }
     });
   },
   extractPermisModule(data){
     let moduleTreeData = []
     data.forEach(d => {
        if(d.type==0){
           moduleTreeData.push({
             id:d.id,
             parentId:d.parentId,
             name:d.name,
             type:d.type
           })
        }
      });
     return util.listToTree('id','parentId', moduleTreeData);
   },
   handleDelete(row){
     delPermission(row.id).then(data => {
        this.init(this.activeName)
     })
   },
   handleEdit(row){
     this.parentId = -1;
     this.editForm = row;
     this.editDialogVisible = true;
     var _this = this;
     setTimeout(function(){
       _this.defaultExpandedKeys.push(_this.editForm.parentId)
        _this.$refs.tree.setCurrentKey(_this.editForm.parentId);
     },500);

    // console.log(row);

   },
   editSubmit(){
     //console.log(this.editForm);
     this.$refs.editValidateForm.validate((valid) => {
      if (valid) {
        //console.log(this.editForm);

        // if(!this.editForm.parentId){
        //   if(this.editForm.parent){
        //     this.editForm.parentId = this.editForm.parent.id;
        //   }else{
        //       this.editForm.parentId=0;
        //   }
        // }
        if(this.parentId==-1){
          this.parentId = this.editForm.parentId;
        }

         let params = {
           id:this.editForm.id,
           name:this.editForm.name,
           permis:this.editForm.permis,
           parentId:this.parentId,
           type:this.editForm.type,
           component:this.editForm.component,
           path:this.editForm.path,
           icon:this.editForm.icon
         }
        console.log(params)
        updatePermission(params).then((res) => {
            this.editDialogVisible=false;
            this.init(this.activeName);
        });
      } else {
        return false;
      }
    });
   },
   handleNodeClick(val){
     console.log(val);
     if(val.id){
       this.parentId = val.id;
       this.parentId = val.id;
     }else{
       this.parentId = val;
       this.parentId = val;
     }

     console.log(this.editForm);
   },
    message(row) {
     this.$message.info(row.name)
   },
   renderContent(h, { node, data, store }) {
     var dom;
        switch(data.type){
            case 0:
                dom = (<span><i class="fa fa-align-justify"></i> {node.label}</span>);
                break;
            case 1:
                dom = (<span><i class="fa fa-stop"></i> {node.label}</span>);
            break;
        }


     return  dom;
   },
   handleSort(id,direction){
     let params = {id:id,direction:direction}
     permissionSort(params).then((res) => {
         this.init(this.activeName);
     });
   },
   change(val){
      if(val===1){
        delete this.permisForm.component;
        delete this.permisForm.icon;
        delete this.permisForm.path;
      }
   }
 },
 computed: {

   },
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  /* &:last-child {
    margin-bottom: 0;
  } */
}

</style>
