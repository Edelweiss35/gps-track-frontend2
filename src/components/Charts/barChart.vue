<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'

import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    title:String,
    legend:Array,
    series:Array,
    times:Array,//x轴数据
    unit:String//数据单位
  },

  data() {
    return {
      chart: null,
      option:{}
    }
  },
  // watch: {
  //   series(val){
  //       this.option.legend.data = [];
  //       this.option.xAxis[0].data = [];
  //       this.option.series = [];
  //       this.option.legend.data = this.legend;
  //       this.option.xAxis[0].data = this.times;
  //       this.option.yAxis[0].name = this.unit;
  //       this.option.series = this.series;
  //       this.chart.setOption(this.option);
  //   }
  // },
  mounted() {
    this.initChart();

  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.clear();
    this.chart.dispose()
    //this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.option = {
        // toolbox: { //可视化的工具箱
        //          show: true,
        //          feature: {
        //            magicType: {type: ['bar', 'line']},
        //            dataView: {show: true},
        //            restore: {show: true},
        //            dataZoom: {show: true},
        //            saveAsImage: {show: true}
        //          }
        //      },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0} : {c0}'+this.unit
        },
        grid: {
          x:40,
          y:40,
          x2:30,
          y2:30,
          borderWidth: 0,
          top: 50,
          bottom: 40
        },
        legend: {
          x: '5%',
          top: '10%',
          data: this.legend
        },
        calculable: true,
        xAxis: [{
          type: 'category',

          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval:5,//0：全部显示，1：间隔为1显示对应类目，2：依次类推，（简单试一下就明白了，这样说是不是有点抽象）
          //  rotate:-30,//倾斜显示，-：顺时针旋转，+或不写：逆时针旋转
          },
          data: this.times
        }],
        yAxis: [{
          type: 'value',
          name: this.unit,
          splitLine: {
            show: false
          },

          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 8,
          xAxisIndex: [
            0
          ],
          bottom: 10,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '100%',

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: this.series
      }

        //this.option.yAxis[0].min = Math.min.apply(null, this.series[0].data)-2;
      //  this.option.yAxis[0].max = Math.max.apply(null, this.series[0].data)+2;
        this.option.xAxis[0].axisLabel.interval = 6;

      this.chart.setOption(this.option)
    },
    refresh(){

            this.chart.clear();
            this.option.legend.data = this.legend;
            this.option.xAxis[0].data = this.times;
            this.option.yAxis[0].name = this.unit;
            this.option.series = this.series;
              //this.option.yAxis[0].min = Math.min.apply(null, this.series[0].data)-2;
            //  this.option.yAxis[0].max = Math.max.apply(null, this.series[0].data)+2;

            this.chart.setOption(this.option);
    },
    handleDestroy() {
            this.$destroy()
        }
  }
}
</script>
