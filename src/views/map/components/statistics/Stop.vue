<template>
  <section>
    <el-row type="flex" class="row-bg" id="park-filter" justify="center">
      <el-tooltip class="item" effect="dark" :content="$t('report.timeRange')" placement="top">
        <el-date-picker
          v-model="startAndEnd"
          type="daterange"
          :picker-options="pickerOptions"
          :range-separator="$t('report.to')"
          :start-placeholder="$t('report.startTime')"
          :end-placeholder="$t('report.endTime')"
          align="right">
        </el-date-picker>
      </el-tooltip>
      <el-button type="primary" icon="el-icon-search" v-on:click="init">{{$t("common.query")}}</el-button>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="data.list" style="width: 100%">
          <el-table-column  prop="startTime" :label="$t('report.startTime')" width="180">
            <template slot-scope="scope">
              {{scope.row.startTime/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column  prop="endTime" :label="$t('report.endTime')" width="180">
            <template slot-scope="scope">
              {{scope.row.endTime/1000|moment("YYYY-MM-DD HH:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column  prop="stopTime" :label="$t('map.parkDuration')" width="180"  :formatter="formatStopTime"></el-table-column>
          <el-table-column  prop="address" :label="$t('map.address')"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="this.$store.state.pageSizes"
          :page-size="this.$store.state.pageSize"
          :total="data.total"
          :current-page="page"
          style="float:right;">
          </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import util from '@/utils/util'
import moment from "moment";
import { getStatisticsStop } from '@/api/api'
export default {
  name: 'StatisticsStop',
  data() {
    return {
      page: 1,
      data: {},
      start: "",
      end: "",
      isDateChanged: false,
    }
  },
  methods: {
    init() {
      let para = {
        deviceId:this.device.id,
        page: this.page,
        pageSize:this.$store.state.common.pageSize,
        start: this.start,
        end: this.end
      };
      getStatisticsStop(para).then(data => {
        this.data = data
      })
    },
    moment() {
      return moment();
    },
    handleSizeChange(val) {
      this.$store.dispatch('updatePageSize',val);
      this.init();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
    formatStopTime:function(row, column) {
      var diff = row[column.property];
      if (diff == undefined) {
        return "";
      }
      return util.stopTime(diff);
    },
  },
  mounted() {
    this.start = moment(Date.now() - 1000 * 3600 * 24 * 7).format(
      "YYYY-MM-DD HH:mm"
    );
    this.end = moment(Date.now()).format("YYYY-MM-DD HH:mm");
    this.init()
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: this.$t("common.lastWeek"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("common.lastMonth"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t("common.last3Month"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      };
    },
    startAndEnd: {
      get: function() {
        this.isDateChanged = true;
        return [this.start, this.end];
      },
      set: function(newValue) {
        this.start = newValue[0];
        this.end = newValue[1];
      }
    },
  },
  watch: {
    'visible': function() {
      if(this.visible){
        this.init()
      }
    }
  },
  props: ['device','visible']
}
</script>

<style scoped>
#park-filter button {
  margin-left: 30px;
}
#park-filter .el-range-separator {
  width: auto !important;
  padding: 1px;
}
</style>
