<template lang='pug'>
  .custoer-consult
    .type-title 项目咨询量统计
    .tab-options
      .item
        el-date-picker(v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至" :clearable='false'
          start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
        el-button(type='primary' size='mini' @click='search') 确认
    .chart
      .chart-line
        ve-line(ref='vLine' :data="lineObj" :extend="lineExtend" :grid="grid"  :toolbox="lineToolbox")
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
        columns: ['date', '留言量', '处理量'],
        rows: []
        // { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
        // { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
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
        endDate: new Date().toLocaleDateString().replace(/\//g, '-'), // 结束时间
        status: -1// 留言处理状态 - 1 全部 0 未处理 1 已处理
      }
    }
  },
  created () {
    this.getCustomerConsultCount()
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  methods: {
    search () {
      this.opts.beginDate = this.dateRange[0]
      this.opts.endDate = this.dateRange[1]
      this.getCustomerConsultCount()
    },
    getCustomerConsultCount () {
      this.$api.getCustomerConsultCount(this.opts).then(data => {
        if (data) {
          let obj = {}
          // 处理为 {日期 : {留言量 : 3, 处理量: 4}}
          data.map(item => {
            if (!obj[item.browse_date]) {
              obj[item.browse_date] = {}
            }
            if ('留言量' in obj[item.browse_date]) {
              obj[item.browse_date]['留言量'] += item.count
            } else {
              obj[item.browse_date]['留言量'] = item.count
            }
            if (Number(item.status) === 1) {
              obj[item.browse_date]['处理量'] = item.count
            }
          })
          // 为无数据端添加0 修改格式
          this.lineObj.rows = []
          for (const key in obj) {
            if (!obj[key].hasOwnProperty('处理量')) {
              obj[key]['处理量'] = 0
            }
            this.lineObj.rows.push({ date: key, ...obj[key] })
          }
        }
      })
    }
  },
  components: {
    VeLine,
    VeHistogram
  },
  watch: {
    isCollapse () {
      this.$vgo.throttle(() => this.$nextTick(() => {
        this.$refs.vLine.resize()
      }), 300)
    }
  }
}
</script>

<style lang="stylus">
.custoer-consult
  .type-title
    margin-bottom 0
  .tab-options
    text-align right
  .chart
    margin 20px
</style>
