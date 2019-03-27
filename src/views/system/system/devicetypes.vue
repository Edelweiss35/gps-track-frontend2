<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-button type="primary" @click="addDialogVisible=true"   v-if="hasPermission('system:devicetype:add')">{{$t('system.addType')}}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="list" element-loading-text="Loading" fit highlight-current-row>
          <el-table-column :label="$t('system.no')" width="95" type="index">
          </el-table-column>
          <el-table-column :label="$t('system.name')" prop="name">
          </el-table-column>
          <el-table-column :label="$t('system.port')" prop="port">
          </el-table-column>
          <el-table-column :label="$t('system.desc')" prop="description">
          </el-table-column>
          <el-table-column :label="$t('system.disable')">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.disabled" active-color="#ff4949"  inactive-color="#13ce66"> </el-switch>

            </template>
          </el-table-column>
          <el-table-column :label="$t('system.operations')" align="center">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.row)" v-if="hasPermission('system:devicetype:update')">{{$t('system.edit')}}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-if="hasPermission('system:devicetype:delete')">{{$t('system.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>


    <el-dialog
    :title="$t('system.addType')"
    :visible.sync="addDialogVisible"
    width="30%"
    >
    <el-form :model="addForm" ref="addValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item  :label="$t('system.name')"  prop="name"  :rules="[{ required: true, message: $t('system.nameRequire')}]">
        <el-input v-model="addForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('system.port')"  prop="port" :rules="[{ required: true, message: $t('system.portEmpty')}, { type: 'number', message: $t('system.portNumeric')}]">
        <el-input v-model.number="addForm.port" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('system.desc')"  prop="description" >
        <el-input type="textarea" :rows="2" :placeholder="$t('system.enterDesc')" v-model="addForm.description" auto-complete="off"></el-input>
      </el-form-item>
     <el-form-item :label="$t('system.disable')" prop="disabled">
       <el-switch
       v-model="addForm.disabled"
       active-color="#ff4949"
       inactive-color="#13ce66"
       :active-text="$t('common.yes')"
       :inactive-text="$t('common.no')"
       >
     </el-switch>
    </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">{{$t('report.cancel')}}</el-button>
      <el-button type="primary" @click="addSubmit">{{$t('report.confirm')}}</el-button>
    </span>
  </el-dialog>

  <el-dialog
  :title="$t('system.editType')"
  :visible.sync="editDialogVisible"
  width="30%"
  >
  <el-form :model="editForm" ref="editValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item  :label="$t('system.name')"  prop="name"  :rules="[{ required: true, message: $t('system.nameRequire')}]">
        <el-input v-model="editForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('system.port')"  prop="port" :rules="[{ required: true, message: $t('system.portEmpty')}, { type: 'number', message: $t('system.portNumeric')}]">
        <el-input v-model.number="editForm.port" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('system.desc')"  prop="description" >
        <el-input type="textarea" :rows="2" :placeholder="$t('system.enterDesc')" v-model="editForm.description" auto-complete="off"></el-input>
      </el-form-item>
     <el-form-item :label="$t('system.disable')" prop="disabled">
       <el-switch
       v-model="editForm.disabled"
       active-color="#ff4949"
       inactive-color="#13ce66"
       :active-text="$t('common.yes')"
       :inactive-text="$t('common.no')"
       >
     </el-switch>
    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">{{$t('report.cancel')}}</el-button>
    <el-button type="primary" @click="editSubmit">{{$t('report.confirm')}}</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import util from '@/utils/util'
import { getDeviceTypes,deleteDeviceType,addDeviceType,updateDeviceType } from '@/api/api'

export default {
  data() {
    return {
      list:[],
      addDialogVisible:false,
      editDialogVisible:false,
      addForm:{
      },
      editForm:{}

    }

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDeviceTypes().then(data => {
        this.list = data
      })
    },
    handleDelete(row){
      deleteDeviceType(row.id).then(data => {
        this.init()
      })
    },
    handleEdit(row){
      this.editForm=row;
      this.editDialogVisible=true;
    },
    addSubmit(){
      this.$refs.addValidateForm.validate((valid) => {
        if (valid) {
          addDeviceType(this.addForm).then(data => {
                this.addDialogVisible=false;
                this.init();
          })
        }else{
           return false;
        }
      });
    },
    editSubmit(){
        this.editDialogVisible=false;
        console.log(this.editForm);
        updateDeviceType(this.editForm).then(data => {
          this.init()
       })
    },

  }
}
</script>
