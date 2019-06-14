<template lang="pug">
  .finance-reward
    .type-title 打赏记录
    .wrapper
      .tab-options
        span 累计数据指标
      DataDisplay(:info="totalRecord")

      .tab-options.mt20
        span 结算记录
        .item.fr
          el-date-picker(v-model="dateRange" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
            start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
          el-button(type='primary' size='mini' @click='search') 确认

      el-table(:data='rewardRecord.list[opts.pageIndex]' stripe)
        el-table-column(prop='date', label='打赏时间' width='250')
          template(slot-scope='scope')
            span {{scope.row.createddt | dateFormat}}
        el-table-column(prop='pano_name', label='打赏作品')
        el-table-column(label='打赏收入(元)' width='150' align='center')
          template(slot-scope='scope')
            span.green(v-if='!scope.row.isout') {{scope.row.money}}
        el-table-column(prop='out', label='打赏支出(元)' width='150' align='center')
          template(slot-scope='scope')
            span.red(v-if='scope.row.isout') {{scope.row.money}}

      el-pagination.fl.mb20(:total="rewardRecord.count" v-if='rewardRecord.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
        :page-size='opts.pageSize' background layout="prev, pager, next")
</template>

<script>
export default {
  data () {
    return {
      totalRecord: [{
        count: '',
        title: '累计打赏收支(元)'
      }, {
        count: '',
        title: '累计打赏支出(元)'
      }, {
        count: '',
        title: '累计打赏收入(元)'
      } ],
      opts: {
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      dateRange: [],
      rewardRecord: {list: {}, count: -1},
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.getRewardRecord()
    this.$api.getRewardTotal().then(data => {
      this.totalRecord[0].count = data.total_income
      this.totalRecord[1].count = data.total_outreward
      this.totalRecord[2].count = data.total_inreward
    })
  },
  methods: {
    getRewardRecord () {
      if (this.rewardRecord.count && !this.rewardRecord.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getRewardRecord(this.opts).then(data => {
          this.$set(this.rewardRecord.list, this.opts.pageIndex, data.list)
          this.rewardRecord.count = data.count
        })
      }
    },
    search () {
      this.opts.startTime = this.dateRange ? this.dateRange[0] : ''
      this.opts.endTime = this.dateRange ? this.dateRange[1] : ''
      this.opts.pageIndex = 1
      this.rewardRecord.list = {}
      this.getRewardRecord()
    },
    handlePageChange () {
      this.getRewardRecord()
    }
  },
  components: {
    DataDisplay: () => import('@/components/DataDisplay')
  }
}
</script>

<style lang="stylus">
.finance-reward
  width 100%

</style>
