<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    data:Object
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
         title: { text: this.$t('system.devStatistics'),textStyle: {
                color: '#000'
            } },
        color:['#67C23A','#409EFF','#909399'],
        legend: {
          left: 'center',
          bottom: '10',
          data: [this.$t('setting.online'), this.$t('setting.offline'), this.$t('map.inactive')]
        },
        calculable: true,
        series: [
          {
            name: this.$t('system.currentState'),
            type: 'pie',
            //roseType: 'radius',
            radius: [55, 95],
            center: ['50%', '45%'],
            data: [
              { value: this.data.online, name: this.$t('setting.online') },
              { value: this.data.offline, name: this.$t('setting.offline') },
              { value: this.data.notactive, name: this.$t('map.inactive') }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  },
  watch:{
    data:function () {
        this.initChart();
    }
  }
}
</script>
