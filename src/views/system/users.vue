<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-select v-model="filters.status" :placeholder="$t('system.status')">
            <el-option
              v-for="(item) in optionStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        <el-select v-model="filters.column" :placeholder="$t('system.filterBy')">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-form-item>
          <el-input v-model="filters.keyword" :placeholder="$t('system.keyword')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="init">{{$t('system.query')}}</el-button>
        </el-form-item>
        <el-form-item>
					  <el-button type="primary" @click="addDialogVisible=true"   v-if="hasPermission('system:user:add')">{{$t('system.createUser')}}</el-button>
				</el-form-item>
      </el-form>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table  :data="data.list" element-loading-text="Loading"  fit highlight-current-row>
          <el-table-column :label="$t('system.no')" type="index">
          </el-table-column>
          <el-table-column :label="$t('system.account')" prop="account" width="150px">
          </el-table-column>
          <el-table-column :label="$t('system.email')" prop="email">
          </el-table-column>
          <el-table-column :label="$t('system.phone')" prop="phone">
          </el-table-column>
          <el-table-column :label="$t('system.role')">
            <template slot-scope="scope">
              <el-tag  size="mini" v-for="(roleKey,index) in scope.row.roleKeys.split(',')" :key="index">{{$t("common." + roleKey)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.timeRegister')">
            <template slot-scope="scope">
              {{scope.row.time/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.disable')">
            <template slot-scope="scope">
              <el-switch disabled  v-model="scope.row.disabled" active-color="#ff4949"  inactive-color="#13ce66"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.status')">
            <template slot-scope="scope">
              <el-tag size="mini" :type="scope.row.status===1?'success':'info'">{{scope.row.status===1?$t('setting.online'):$t('setting.offline')}}</el-tag>

            </template>
          </el-table-column>
          <el-table-column :label="$t('system.operations')" align="center" width="300">
            <template slot-scope="scope">
                <el-button size="small" type="success" @click="goTrack(scope.row)">{{$t('system.monitor')}}</el-button>
                <el-button size="small" type="primary" @click="handleEdit(scope.row)" v-if="hasPermission('system:user:update')">{{$t('system.edit')}}</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)" v-if="hasPermission('system:user:delete')">{{$t('system.delete')}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
    <el-row class="toolbar">
      <el-col :span="24">
        <el-pagination
         layout="total, sizes, prev, pager, next"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
        :page-sizes="this.$store.state.common.pageSizes"
        :page-size="this.$store.state.common.pageSize"
        :total="data.total"
        style="float:right;">
        </el-pagination>
      </el-col>
    </el-row>


    <el-dialog
    :title="$t('system.createUser')"
    :visible.sync="addDialogVisible"
    width="40%"
    >
    <el-form :model="addForm" ref="addValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item  :label="$t('register.account')" prop="account" :rules="[{ required: true, message: $t('common.accountEmpty')}]" >
        <el-input v-model="addForm.account" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.email')"  prop="email" :rules="[{ required: true, type: 'email', message: $t('common.incorrectEmail'), trigger: ['blur', 'change']}]">
        <el-input v-model="addForm.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.mobile')"  prop="phone" :rules="[{ required: true, message: $t('common.incorrectPhone'), trigger: 'blur'}]">
        <el-input v-model="addForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.supUser')"  prop="sup_user">
        <el-select v-model="addForm.sup_user" placeholder="Select">
          <el-option
            v-for="item in optionUsers"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('register.password')"
        prop="password"
        :rules="[{ required: true, message: $t('common.pwdEmpty')}]"
      >
        <el-input v-model="addForm.password" auto-complete="off"></el-input>
      </el-form-item>
     <el-form-item :label="$t('register.role')" prop="roleIds" :rules="[{ required: true, message: $t('common.selectRole')}]">
       <el-checkbox-group v-model="addForm.roleIds">
         <el-checkbox v-for="(role,index) in roles"   :key="index" :label="role.id"  :disabled="role.roleKey==='root'">{{$t("common." + role.roleKey)}}</el-checkbox>

       </el-checkbox-group>
    </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">{{$t('report.cancel')}}</el-button>
      <el-button type="primary" @click="addSubmit">{{$t('report.confirm')}}</el-button>
    </span>
  </el-dialog>


    <el-dialog
    :title="$t('system.editUser')"
    :visible.sync="editDialogVisible"
    width="40%"
    >
    <el-form :model="editForm" ref="editValidateForm" label-width="100px" class="demo-ruleForm">
      <el-form-item  :label="$t('register.account')"  prop="account">
        <el-input v-model.number="editForm.account" auto-complete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.email')"  prop="email" :rules="[{ required: true, type: 'email', message: $t('common.accountEmpty'), trigger: ['blur', 'change']}]">
        <el-input v-model="editForm.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.mobile')"  prop="phone" :rules="[{ required: true, message: $t('common.incorrectPhone'), trigger: 'blur'}]">
        <el-input v-model="editForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item  :label="$t('register.supUser')"  prop="sup_user">
        <el-select v-model="editForm.sup_user" placeholder="Select">
          <el-option
            v-for="item in optionUsers"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
     <el-form-item :label="$t('register.role')" prop="parentId">
       <el-checkbox-group v-model="editForm.roleIds">
         <el-checkbox v-for="(role,index) in roles"  :key="index" :label="role.id" :disabled="role.roleKey==='root'">{{$t("common." + role.roleKey)}}</el-checkbox>

       </el-checkbox-group>
    </el-form-item>
    <el-form-item :label="$t('common.disable')" prop="disabled">
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
import { getUserList,deleteUser,getRoles,updateUser,userAdd,generateToken,getUserAccounts } from '@/api/api'

export default {
  data() {
    return {
      page: 1,
      data: {},
      allUsers: [], 
      optionUsers: [],
      optionStatus:[
          {
           value: -1,
           label: this.$t('setting.all')
         },
          {
           value: 1,
           label: this.$t('setting.online')
         },{
          value: 0,
          label: this.$t('setting.offline')
        }
      ],
      filters: {
          column:'',
          keyword:'',
          status:-1
        },
        options: [{
           value: 'account',
           label: this.$t('register.account')
         }, {
           value: 'email',
           label: this.$t('register.email')
         }, {
           value: 'phone',
           label: this.$t('register.mobile')
         }],
      editDialogVisible:false,
      addDialogVisible:false,
      editForm:{
        roleIds:[]
      },
      addForm:{
        roleIds:[]
      },
      roles:[]
    }

  },
  created() {
    this.init();
    this.getRoles();
    //console.log();
  },
  methods: {
    init() {
      let para = {
        page: this.page,
        pageSize:this.$store.state.common.pageSize,
        column:this.filters.column,
        keyword:this.filters.keyword,
        status:this.filters.status
      };
      getUserList(para).then(data => {
        this.data = data
        this.optionUsers = [
          {
            value: -1,
            label: "Nobody Selected"
          },
          {
            value: 0,
            label: "Admin"
          },
        ];
      })
      getUserAccounts().then(data => {
        this.allUsers = data;
      })
    },
    updateOptionUsers() {
      
    },
    handleDelete(row){
      deleteUser(row.id).then(data => {
        this.init()
      })
    },
    handleEdit(row){
      this.editForm=row;
      console.log(row);
      if(row.roleIds  instanceof Array){

      }else{
        let arrs = row.roleIds.split(',');
        let roles = [];
        for(var i=0;i<arrs.length;i++){
          roles.push(parseInt(arrs[i]))
        }
        this.editForm.roleIds=roles;
      }
      this.optionUsers = [
        {
          value: -1,
          label: "Nobody Selected"
        },
        {
          value: 0,
          label: "Admin"
        },
      ];
      this.allUsers.forEach(user => {
        if(user.account.indexOf('admin') == -1 && user.account.indexOf('root') == -1 && user.id != row.id) {
          this.optionUsers.push({
            value: user.id,
            label: user.account
          });
        }
      })

      this.editDialogVisible=true;
    },
    editSubmit(){
        this.$refs.editValidateForm.validate((valid) => {
            if (valid) {
                  this.editDialogVisible=false;
                  updateUser(this.editForm).then(data => {
                      this.init()
                  })
              }
        });
    },
    getRoles(){
      getRoles().then(data => {
        this.roles = data
      })
    },
    addSubmit(){
        this.$refs.addValidateForm.validate((valid) => {
          if (valid) {
            userAdd(this.addForm).then(data => {
                this.addDialogVisible=false;
                this.init();
            })
          }else{
             return false;
          }
        });
    },
    handleSizeChange(val) {
      this.$store.dispatch('updatePageSize',val);
      this.init();

     },
     handleCurrentChange(val) {
       this.page = val;
       this.init();
     },
     goTrack(row){
          generateToken(row.id).then(data => {
            let monitorUser = {account:row.account,token:data}
            localStorage.monitorUser = JSON.stringify(monitorUser);
            window.open('#/map');
          })

     },
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}

</style>
