<template>
  <div class="app-container">
    <el-row class="toolbar">
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-select v-model="filters.status" :placeholder="$t('system.status')">
            <el-option
              v-for="item in optionStatus"
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
      </el-form>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="data.list"  element-loading-text="Loading"   highlight-current-row>
          <el-table-column :label="$t('system.no')" width="80" type="index">
          </el-table-column>
          <el-table-column :label="$t('system.account')" prop="account" width="80">
          </el-table-column>
          <el-table-column :label="$t('system.action')" prop="action">
          </el-table-column>
          <el-table-column :label="$t('system.desc')" prop="remark">
          </el-table-column>
          <el-table-column label="IP" prop="ip">
          </el-table-column>
          <el-table-column :label="$t('common.time')">
            <template slot-scope="scope">
              {{scope.row.time/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('system.param')">
            <template slot-scope="scope">
             <el-popover trigger="hover" placement="top">
               {{ scope.row.params }}
               <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{$t('system.param')}}</el-tag>
              </div>
             </el-popover>
           </template>
          </el-table-column>
          <el-table-column :label="$t('system.response')" prop="result">
            <template slot-scope="scope">
             <el-popover trigger="hover" placement="top">
               {{ scope.row.result }}
               <div slot="reference" class="name-wrapper">
                <el-tag size="medium"> {{ JSON.parse(scope.row.result).msg }}</el-tag>
              </div>
             </el-popover>
           </template>
          </el-table-column>
          <el-table-column :label="$t('system.result')">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status===0?'success':'danger'">{{scope.row.status===0?$t('system.success'):$t('system.fail')}}</el-tag>
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


  </div>
</template>

<script>
import util from '@/utils/util'
import { getLogs } from '@/api/api'

export default {
  data() {
    return {
      page: 1,
      data:{},
      filters: {
          column:'',
          keyword:'',
          status:-1
        },
        optionStatus:[
            {
             value: -1,
             label: this.$t('setting.all')
           },
            {
             value: 0,
             label: this.$t('system.success')
           }, {
             value: 1,
             label: this.$t('system.fail')
           }
        ],
        options: [{
           value: 'account',
           label: this.$t('system.account')
         }, {
           value: 'ip',
           label: 'IP'
         }, {
           value: 'action',
           label: this.$t('system.action')
         }, {
           value: 'remark',
           label: this.$t('system.desc')
         }],

    }

  },
  created() {
    this.init()
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
      getLogs(para).then(data => {
        this.data = data
      })
    },
    handleSizeChange(val) {
      this.$store.dispatch('updatePageSize',val);
      this.init();

     },
     handleCurrentChange(val) {
       this.page = val;
       this.init();
     },
  }
}
</script>
