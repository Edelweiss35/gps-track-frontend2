<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
//require('echarts/theme/macarons') // echarts theme
import { debounce } from "@/utils";
import moment from "moment";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array
    },
    type: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }

    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  methods: {
    setOptions(chartData = {}) {
      this.chart.setOption({
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            xAxisIndex: [0],
            start: 0,
            end: 3,
            filterMode: "filter"
            // handlerSize: "100%"
          }
        ],
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        color: ["#009C95", "#21ba45"],
        title: {
          text: this.title,
          textStyle: {
            fontFamily: "lato"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        calculable: true,
        xAxis: [
          {
            type: "time",
            boundaryGap: false,
            axisLabel: {
              formatter: function(value) {
                return moment(value).format("YY-MM-DD HH:mm:ss");
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: this.title,
            type: this.type ? this.type : "line",
            smooth: true,
            // itemStyle: { normal: { areaStyle: { type: "none" } } },
            data: chartData
          }
        ],
        anmation: true
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      this.setOptions(this.chartData);
    }
  }
};
</script>
