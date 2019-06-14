<template lang='pug'>
  .publish-count
    .type-title 发布项目数量统计
    .tab-options
      .item
        el-date-picker(v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" :clearable='false'
          start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
        el-button(type='primary' size='mini' @click='search') 确认
    .chart
      .chart-line
        ve-histogram(ref='VeHistogram' :data="lineObj" :extend="lineExtend" :grid="grid"  :toolbox="lineToolbox")
</template>

<script>
import VeLine from 'v-charts/lib/line'
import VeHistogram from 'v-charts/lib/histogram'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
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
        name: '数量'
      },
      title: {
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
    return {
      lineToolbox: {
        show: true,
        feature: {
          dataView: { readOnly: true },
          magicType: { type: ['line', 'bar'] },
          saveAsImage: {}
        }
      },
      lineObj: {
        columns: ['date', '项目数量'],
        rows: []
        // { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
        //     { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近7天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近14天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近30天',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      dateRange: [new Date(Date.now() - 3600 * 1000 * 24 * 30).toLocaleDateString().replace(/\//g, '-'), new Date().toLocaleDateString().replace(/\//g, '-')],
      opts: {
        day_type: 0, // 天数类型 默认为30天 7天、14天、30天
        beginDate: new Date(Date.now() - 3600 * 1000 * 24 * 30).toLocaleDateString().replace(/\//g, '-'), // 开始时间
        endDate: new Date().toLocaleDateString().replace(/\//g, '-') // 结束时间
      }
    }
  },
  created () {
    this.getPublishCount()
  },

  methods: {
    search () {
      this.opts.beginDate = this.dateRange[0]
      this.opts.endDate = this.dateRange[1]
      this.getPublishCount()
    },
    getPublishCount () {
      this.$api.getPublishCount(this.opts).then(data => {
        if (data) {
          // 处理为 {日期 : {留言量 : 3, 处理量: 4}}
          this.lineObj.rows = []
          data.map(item => {
            this.lineObj.rows.push({ date: item.browse_date, '项目数量': item.count })
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  components: {
    VeHistogram,
    VeLine
  },
  watch: {
    isCollapse () {
      this.$vgo.throttle(() => this.$nextTick(() => {
        this.$refs.VeHistogram.resize()
      }), 300)
    }

  }
}
</script>

<style lang="stylus">
.publish-count
  .type-title
    margin-bottom 0
  .tab-options
    text-align right
  .chart
    margin 20px
</style>
