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
          <el-table-column  prop="sdate" :label="$t('report.date')">
            <template slot-scope="scope">
              {{scope.row.sdate|moment("YYYY-MM-DD")}}
            </template>
          </el-table-column>
          <el-table-column  prop="trip" :label="$t('map.popupMileage')">
            <template slot-scope="scope">
              {{($store.state.common.setting.speedUnit == "KM/H") 
              ? parseFloat(scope.row.trip).toFixed(2) + " " + "km" 
              : (parseFloat(scope.row.trip) * 0.62).toFixed(2) + " " + "miles"}}
            </template>
          </el-table-column>
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
import { getStatisticsMileage } from '@/api/api'
export default {
  name: 'StatisticsMileage',
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
      getStatisticsMileage(para).then(data => {
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
    }
  },
  mounted() {
    this.start = moment(Date.now() - 1000 * 3600 * 24 * 30).format(
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
</style>
