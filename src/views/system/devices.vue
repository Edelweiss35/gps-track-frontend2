<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
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
					<el-button type="primary" @click="handleAdd" :disabled="!hasPermission('system:device:add')">{{$t('system.addDevice')}}</el-button>
				</el-form-item>
			</el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="data.list" element-loading-text="Loading"  fit highlight-current-row>
          <el-table-column :label="$t('common.deviceName')" prop="name">
          </el-table-column>
          <el-table-column label="IMEI" width="160" prop="imei">
          </el-table-column>
          <el-table-column label="SIM"  width="160" prop="sim">
          </el-table-column>
          <el-table-column :label="$t('common.type')" prop="typeName">
          </el-table-column>
          <el-table-column  width="160" :label="$t('system.timeAdded')">
            <template slot-scope="scope">
              {{scope.row.time/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <!-- <el-table-column  width="160" :label="$t('system.lastTimeUpdated')">
            <template slot-scope="scope">
              {{scope.row.lastUpdate/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('system.status')">
            <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.status===1?'success':scope.row.status===0?'danger':'info'">{{scope.row.status===1 ? $t('setting.online') : scope.row.status===0 ? $t('setting.offline') : $t('map.inactive')}}</el-tag>
            </template>
          </el-table-column>

          <!-- <el-table-column :label="$t('system.totalMileage')" width="200">
            <template slot-scope="scope">
            {{scope.row.todayTrip+"/"+scope.row.trip}}
            </template>
          </el-table-column> -->

          <el-table-column :label="$t('system.account')" prop="account">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">{{scope.row.account}}</el-button>
            </template>
          </el-table-column>

          <el-table-column :label="$t('system.operations')" align="center" width="300">
            <template slot-scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.row)" v-if="hasPermission('system:device:update')">{{$t('system.edit')}}</el-button>
                <el-button size="small" type="danger" @click="deleteConfirm(scope.row)" v-if="hasPermission('system:device:delete')">{{$t('system.delete')}}</el-button>
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
    <DeviceBox 
      :device="deviceSelected"
      :types="deviceTypes"
      :users="users"
      :init="init">
    </DeviceBox>
  </div>
</template>

<script>
import { getAllDevices, getUserAccounts, getDeviceTypes, delDevice } from '@/api/api'
import DeviceBox from "./components/Device";

export default {
  data() {
    return {
      page: 1,
      data:{},
      deviceTypes: [],
      users: [],
      deviceSelected: {},
      filters: {
        column:'',
        keyword:''
      },
      options: [
        {
          value: 'name',
          label: this.$t('system.name')
        }, 
        {
          value: 'imei',
          label: 'IMEI'
        }, 
        {
          value: 'sim',
          label: 'SIM'
        }, 
        {
          value: 'account',
          label: this.$t('system.account')
        }
      ]
    }
  },
  created() {
    this.init();
  },
  components: {
    DeviceBox
  },
  methods: {
    init() {
      let para = {
        page: this.page,
        pageSize:this.$store.state.common.pageSize,
        column:this.filters.column,
        keyword:this.filters.keyword
      };
      getAllDevices(para).then(data => {
        this.data = data
      })
      getUserAccounts().then(data => {
        this.users = data
      })
      getDeviceTypes().then(data => {
        this.deviceTypes = data
      })
    },
    handleDelete(row){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.init()
        })
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
    handleAdd: function() {
      this.$store.dispatch("setVisblesFlag", [
        { key: "deviceAddForm", value: true }
      ]);
    },
    deleteConfirm(device) {
      this.$confirm(this.$t('system.deleteMsg'), this.$t('report.confirm'), {
        confirmButtonText: this.$t('report.confirm'),
        cancelButtonText: this.$t('report.cancel'),
        type: "warning",
        lockScroll: false
      }).then(() => {
        delDevice(device.id).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('system.deleteSuccess')
          });
          this.init()
        });
      })
      .catch(() => {});
    },

    handleEdit(device) {
      this.deviceSelected = device;
      if (device.id != 0) {
        this.$store.dispatch("setVisblesFlag", [
          { key: "deviceEditForm", value: true }
        ]);
      } else {
        this.$message({
          message: this.$t("map.selectAlert"),
          type: "error"
        });
      }
    },
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
