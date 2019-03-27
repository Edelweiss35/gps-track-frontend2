<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-table :data="data.list"  element-loading-text="Loading"   highlight-current-row>
          <el-table-column label='ID' width="95" type="index">
          </el-table-column>
          <el-table-column label="IP" prop="ip">
          </el-table-column>
          <el-table-column :label="$t('common.time')">
            <template slot-scope="scope">
              {{scope.row.time/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column width="95" :label="$t('system.terminal')">
            <template slot-scope="scope">
              {{scope.row.client==0?"PC":scope.row.client==1?"Android":"IOS"}}
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
import { getLoginLogs } from '@/api/api'

export default {
  data() {
    return {
      page: 1,
      data:{}

    }

  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let para = {
        page: this.page,
        pageSize:this.$store.state.common.pageSize
      };
      getLoginLogs(para).then(data => {
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
