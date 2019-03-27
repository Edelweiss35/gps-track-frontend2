<template>
  <section>
    <div id="gps-control" class="gps-control-box">
      <el-row v-if="chartVisible">
        <el-col>
          <div class="chart-container">
            <Chart
              ref="chart"
              height="100%"
              width="100%"
              title="title"
              :legend="legend"
              :series="series"
              :times="times"
              :unit="unit"
            ></Chart>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-date-picker v-model="timeRange" type="datetimerange" :picker-options="pickerOptions"></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-tooltip :content="$t('common.yes')" placement="top">
            <el-switch
              v-model="$store.state.user.control.filterlbs"
              @change="changeFilterlbs"
              active-color="#13ce66"
              inactive-color="#878D99"
            ></el-switch>
          </el-tooltip>
          <br>
          <span style="position: absolute;font-size:12px">LBS/Wifi</span>
        </el-col>
        <el-col :span="6">
          <el-button-group>
            <el-tooltip class="item" effect="dark" :content="$t('common.load')" placement="top-start">
              <el-button type="primary" size="small" @click.native="historyLoad" :loading="loading">
                <font-awesome-icon icon="hourglass-end"/>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('common.downloadTrack')" placement="top-start">
              <el-button
                type="primary"
                size="small"
                @click.native="downLoad"
                :loading="downLoading"
                :disabled="$store.state.common.user.roleKeys == 'demo'" 
              >
                <font-awesome-icon icon="download"/>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('common.chart')" placement="top-start">
              <el-button
                type="primary"
                size="small"
                :disabled="times.length==0"
                @click="chartVisible = (chartVisible?false:true)"
              >
                <font-awesome-icon icon="chart-line"/>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </el-col>
        <el-col :span="1" style="float:right">
          <i class="el-icon-close" @click="$store.dispatch('setMapValues', [{key:'mode',value:1}])"></i>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="3">
          <el-tooltip class="item" effect="dark" :content="$t('common.playAndPause')" placement="top-start">
            <el-button
              type="primary"
              size="small"
              :disabled="this.$store.state.user.historyPos.length==0"
              @click.native="historyPlay"
            >
              <font-awesome-icon :icon="this.$store.state.user.control.pause?'play':'pause'"/>
            </el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="5">
          <el-slider
            v-model="$store.state.user.control.speed"
            @change="changeSpeed"
            :min="1"
            :max="10"
            :format-tooltip="formatSpeedTooltip"
          ></el-slider>
        </el-col>
        <el-col :span="15">
          <el-slider
            v-model="$store.state.user.control.index"
            :max="this.$store.state.user.control.total"
            :format-tooltip="formatIndexTooltip"
          ></el-slider>
        </el-col>
      </el-row>
    </div>
    <div class="speed-color">
      <span>{{$t('common.speed')}}</span>
      <img src="../../../../assets/images/speedcolor.png">
    </div>
  </section>
</template>

<script>
import util from "@/utils/util";
import Chart from "@/components/Charts/barChart";
export default {
  name: "controlbox",
  data() {
    return {
      downLoading: false,
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();

              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              start.setTime(start.getTime() - 3600 * 1000 * 24);

              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);
              end.setMilliseconds(59);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "前天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();

              start.setHours(0);
              start.setMinutes(0);
              start.setSeconds(0);
              start.setMilliseconds(0);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);

              end.setHours(23);
              end.setMinutes(59);
              end.setSeconds(59);
              end.setMilliseconds(59);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timeRange: [util.getBefareDay(0), new Date()],
      speed: 2,
      index: 0,
      lastIndex: 0,
      chartVisible: false,
      legend: ["温度", "油量", "速度"],
      series: [
        {
          name: "温度",
          symbol: "none",
          smooth: true,
          type: "line",
          markPoint: {
            data: [{ type: "max", name: "最高" }, { type: "min", name: "最低" }]
          },
          data: []
        },
        {
          name: "油量",
          symbol: "none",
          smooth: true,
          type: "line",
          markPoint: {
            data: [{ type: "max", name: "最高" }, { type: "min", name: "最低" }]
          },
          data: []
        },
        {
          name: "速度",
          symbol: "none",
          smooth: true,
          type: "line",
          markPoint: {
            data: [{ type: "max", name: "最高" }, { type: "min", name: "最低" }]
          },
          data: []
        }
      ],
      times: [],
      unit: ""
    };
  },
  methods: {
    historyLoad: function() {
      var start = util.dateFormat(this.timeRange[0]);
      var end = util.dateFormat(this.timeRange[1]);
      let params = {
        id: this.$store.state.user.devices.selectId,
        start: start,
        end: end
      };
      this.loading = true;
      this.$store
        .dispatch("getHistoryPositons", params)
        .then(() => {
          this.loading = false;
          var _this = this;
          this.series[0].data = [];
          this.times = [];
          setTimeout(function() {
            var positions = _this.$store.state.user.historyPos;
            for (var i = 0; i < positions.length; i++) {
              var time = positions[i].time;
              var attributes = JSON.parse(positions[i].attributes);

              if (attributes.temp) {
                _this.series[0].data.push(attributes.temp);
              }
              if (attributes.fuelPercentage) {
                _this.series[1].data.push(attributes.fuelPercentage);
              }
              _this.series[2].data.push(positions[i].speed);
              _this.times.push(util.dateFormat(time, "HH:mm:ss"));
            }
            // _this.times.push('00:15:58');
            // _this.times.push('11:15:58');
            // _this.times.push('12:15:58');
          }, 500);
          setTimeout(function() {
            if (_this.$refs.chart) {
              _this.$refs.chart.refresh();
            }
          }, 500);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    changeSpeed(val) {
      this.$store.dispatch("setControlValue", { key: "speed", value: val });
    },
    historyPlay() {
      if (this.$store.state.user.control.pause) {
        this.$store.dispatch("setControlValue", { key: "pause", value: false });
      } else {
        this.$store.dispatch("setControlValue", { key: "pause", value: true });
      }
    },
    formatSpeedTooltip(val) {
      return this.$t('common.playSpeed') + "：" + val + "X";
    },
    formatIndexTooltip(val) {
      if (Math.abs(Math.abs(val) - Math.abs(this.lastIndex)) > 2) {
        this.$store.dispatch("setControlValue", { key: "runStep", value: val });
      }
      this.lastIndex = val;
      return (
        Math.ceil((val / this.$store.state.user.control.total) * 100) + "%"
      );
    },
    changeFilterlbs(val) {
      this.$store.dispatch("setControlValue", { key: "filterlbs", value: val });
    },
    downLoad() {
      alert("下载");
    }
  },
  mounted() {},
  components: {
    Chart
  }
};
</script>
<style scoped>
.gps-control-box {
  padding: 5px;
  background: #fff;
  width: 660px;
  margin-right: 60px;
  position: absolute;
  bottom: 30px;
  left: 380px;
  font-size: 16px;
  border-radius: 5px;
  box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
}
.speed-color {
  position: absolute;
  bottom: 160px;
  right: 0px;
}
.speed-color img {
  width: 60%;
}
.speed-color span {
  position: absolute;
  top: 10px;
  font-size: 10px;
  width: 60%;
  text-align: center;
}
.chart-container {
  position: relative;
  width: 100%;
  height: 30vh;
}
</style>
