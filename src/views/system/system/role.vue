<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">  <el-button type="primary" @click="showAddRoleDialog" v-if="hasPermission('system:role:add')">{{$t('system.addRole')}}</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="list" element-loading-text="Loading" fit highlight-current-row>
          <el-table-column :label="$t('system.no')" width="95" type="index">
          </el-table-column>
          <el-table-column :label="$t('system.roleName')" prop="name">
          </el-table-column>
          <el-table-column :label="$t('system.roleCode')" align="center" prop="roleKey">
          </el-table-column>
          <el-table-column :label="$t('system.group')" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.groupId==0?$t('system.userRole'):$t('system.mgmtRole')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.operations')" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="showEditRoleDialog(scope.row)"  v-if="hasPermission('system:role:update')">{{$t('system.edit')}}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-if="hasPermission('system:role:delete')">{{$t('system.delete')}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>



    <el-dialog
    :title="$t('system.addRole')"
    :visible.sync="dialogVisible"
    width="40%"
    >
      <el-form :model="roleForm" ref="roleValidateForm" label-width="100px">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form-item :label="$t('system.group')" prop="groupId">
          <el-select v-model="roleForm.groupId" @change="changeGroup">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
       </el-form-item>

         <el-form-item
           :label="$t('system.roleName')"
           prop="name"
           :rules="[{ required: true, message: $t('system.nameRequire')}]"
         >
           <el-input v-model="roleForm.name" auto-complete="off"></el-input>
         </el-form-item>
         <el-form-item
           :label="$t('system.roleCode')"
           prop="roleKey"
           :rules="[{ required: true, message: $t('system.roleCodeEmpty')}]"
         >
           <el-input v-model="roleForm.roleKey" auto-complete="off"></el-input>
         </el-form-item>



      </el-col>

      <el-col :span="10">
        {{$t('system.rights')}}
        <permission-tree ref="addTree" :data="permisTreeData"></permission-tree>
        <!-- <el-tree
          ref="tree"
          :data="permisTreeData"
          show-checkbox
          node-key="id"
          :props="defaultProps">
        </el-tree> -->
      </el-col>

    </el-row>





    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t('report.cancel')}}</el-button>
      <el-button type="primary" @click="handleSave">{{$t('report.confirm')}}</el-button>
    </span>
  </el-dialog>

  <el-dialog
  :title="$t('system.editRole')"
  :visible.sync="permisDialogVisible"
  width="40%"
  >
  <el-form :model="roleEditForm" ref="roleEditValidateForm" label-width="100px">
    <el-row :gutter="20">
    <el-col :span="14">
      <el-form-item
        :label="$t('system.roleName')"
        prop="name"
        :rules="[{ required: true, message: $t('system.nameRequire')}]"
      >
        <el-input v-model="roleEditForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('system.roleCode')"
        prop="roleKey"
        :rules="[{ required: true, message: $t('system.roleCodeEmpty')}]"
      >
        <el-input v-model="roleEditForm.roleKey" auto-complete="off"></el-input>
      </el-form-item>


    </el-col>

    <el-col :span="10">
      {{$t('system.rights')}}
      <permission-tree ref="updateTree" :data="permisTreeData" :defaultCheckedKeys="roleEditForm.permissions"></permission-tree>
      <!-- <el-tree
        ref="tree"
        :data="permisTreeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="roleEditForm.permissions"
        :props="defaultProps">
      </el-tree> -->
    </el-col>

  </el-row>

  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="permisDialogVisible = false">{{$t('report.cancel')}}</el-button>
    <el-button type="primary" @click="handleEdit">{{$t('report.confirm')}}</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import PermissionTree from '../components/PermissionTree'
import { getRoles,addRole,deleteRole,getPermissions,updateRole } from '@/api/api'

export default {
  data() {
    return {
      list: null,
      dialogVisible:false,
      permisDialogVisible:false,
      roleForm:{
        groupId:0
      },
      roleEditForm:{

      },
      options: [{
           value: 0,
           label: this.$t('system.userRole')
         }, {
           value: 1,
           label: this.$t('system.mgmtRole')
         }],
         permisTreeData: [],
         defaultProps: {
         children: 'children',
         label: 'name'
       }
    }

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRoles().then(data => {
        this.list = data
      })
    },
    showAddRoleDialog(){

        this.permisTreeData = []
        this.roleForm.groupId = 0;
        this.getPermisData(0);
        this.dialogVisible = true;
        if(this.$refs.tree){
          this.$refs.tree.setCheckedKeys([]);
        }

    },
    handleEdit(){
         this.roleEditForm.permissions = this.$refs.updateTree.getAllCheckedKeys();
         updateRole(this.roleEditForm).then(data => {
             this.permisDialogVisible = false;
             this.init()
         })
    },
    handleSave(){
      this.$refs.roleValidateForm.validate((valid) => {

        if(valid) {
          this.roleForm.permissions = this.$refs.addTree.getAllCheckedKeys();
          addRole(this.roleForm).then(data => {
            this.dialogVisible=false;
            this.init()
          })
        }

      });

    },
    handleDelete(row){
      deleteRole(row.id).then(data => {
        this.init()
      })
    },
    showEditRoleDialog(row){
      this.roleEditForm = row;
      this.permisTreeData = []
      this.getPermisData(row.groupId);
      this.permisDialogVisible = true;
    },
    getPermisData(groupId){
      getPermissions(groupId).then(data => {

              this.permisTreeData = util.listToTree('id','parentId', data)


      })
    },
    changeGroup(val){
      this.permisTreeData = []
      this.getPermisData(val);
    }
  },
  components: {
    PermissionTree
  }
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
