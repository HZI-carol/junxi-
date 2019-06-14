<template lang='pug'>
  .home

    .type-title 作品流量统计
    .chart
      .chart-line
        ve-line(ref='vLine' :data="lineObj" :extend="lineExtend" :grid="grid"  :toolbox="lineToolbox")
      .chart-map
        ve-map(ref='vMap' :extend="mapExtend" height='600px' :settings="mapSettings" :data="mapObj" :toolbox="mapToolbox")
</template>

<script>
import VeLine from 'v-charts/lib/line'
import VeHistogram from 'v-charts/lib/histogram'
import VeMap from 'v-charts/lib/map'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import { mapGetters } from 'vuex'
export default {
  data () {
    this.grid = {
      left: 40,
      right: 60,
      eight: 40
    }
    this.lineExtend = {
      xAxis: {
        name: '日期',
        nameLocation: 'end'
      },
      'yAxis.0': {
        name: '访问量(人次)'
      },
      title: {
        text: '作品浏览数统计',
        subtext: '(近一个月)',
        x: 'center',
        align: 'right',
        textStyle: {
          fontSize: 20,
          fontWeight: '700'
        }
      },
      legend: {
        x: 'left'
      }
    }
    this.mapExtend = JSON.parse(JSON.stringify(this.lineExtend))
    this.mapExtend.title.text = '区域浏览数统计'
    this.mapExtend.visualMap = [{
      type: 'continuous',
      color: ['orangered', 'yellow', 'lightskyblue'],
      text: ['多', '少'],
      min: 0,
      max: 2000,
      let: '100px',
      bottom: '40%'
    }]
    return {
      lineToolbox: {
        show: true,
        feature: {
          dataView: { readOnly: true },
          magicType: { type: ['line', 'bar'] },
          saveAsImage: {}
        }
      },
      mapToolbox: {
        show: true,
        feature: {
          dataView: { readOnly: true },
          saveAsImage: {}
        }
      },
      mapSettings: {
        labelMap: {
          count: '浏览次数'
        },
        legendName: {
          browser_region: '访问用户'
        },
        mapGrid: {
          left: '25%',
          top: '10%',
          right: '25%'
        }
      },
      lineObj: {
        columns: ['date', 'PC端', '手机端', '平板端'],
        rows: []
        // { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
        //     { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
        // 0: {count: 3, browser_type: 1, browse_date: "02-11"}
        // browse_date: "02-11"
        // browser_type: 1
        // count: 3
        // 1: {count: 4, browser_type: 2, browse_date: "02-11"}
        // browse_date: "02-11"
        // browser_type: 2
        // count: 4
        // 2: {count: 3, browser_type: 1, browse_date: "02-12"}
        // browse_date: "02-12"
        // browser_type: 1
        // count: 3
      },
      mapObj: {
        columns: ['browser_region', 'count'],
        rows: []
      },
      mapData: [
      ]
    }
  },
  created () {
    this.$api.getPanoViewCount().then(data => {
      if (data) {
        let obj = {}
        // 处理为 {日期 : {pc : 3, phone: 4, pad: 5}}
        data.map(item => {
          if (!obj[item.browse_date]) {
            obj[item.browse_date] = {}
          }
          if (Number(item.browser_type) === 1) {
            obj[item.browse_date]['PC端'] = item.count
          } else if (Number(item.browser_type) === 2) {
            obj[item.browse_date]['手机端'] = item.count
          } else {
            obj[item.browse_date]['平板端'] = item.count
          }
        })
        // 为无数据端添加0 修改格式
        for (const key in obj) {
          if (!obj[key].hasOwnProperty('PC端')) {
            obj[key]['PC端'] = 0
          }
          if (!obj[key].hasOwnProperty('手机端')) {
            obj[key]['手机端'] = 0
          }
          if (!obj[key].hasOwnProperty('平板端')) {
            obj[key]['平板端'] = 0
          }
          this.lineObj.rows.push({ date: key, ...obj[key] })
        }
      }
    })
    this.$vgo.openLoading()
    this.$api.getPanoViewAreaCount().then(data => {
      this.mapObj.rows = data
    })
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  components: {
    VeLine,
    VeMap,
    VeHistogram,
    DataDisplay: () => import('@/components/DataDisplay')
  },
  watch: {
    isCollapse () {
      this.$vgo.throttle(() => this.$nextTick(() => {
        this.$refs.vLine.resize()
        this.$refs.vMap.resize()
      }), 300)
    },
    $route (to, from) {
      if (to.name === 'home') {
        this.$nextTick(() => {
          this.$refs.vLine.resize()
          this.$refs.vMap.resize()
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.home
  .data-display
    border-bottom 10px solid #f5f5f5
  .chart
    margin 20px
</style>
