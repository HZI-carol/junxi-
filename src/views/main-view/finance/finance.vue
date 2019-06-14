<template lang='pug'>
  .finance-center
    .type-title 财务中心
    .wrapper
      .header
        .finally
          .ft 当前余额(元)
          .fn.orange {{userInfo.bank}}
        .finally
          .ft 广告收入金额(元)
          .fn.red {{userInfo.adincome}}
        .finally
          .ft 广告支出金额(元)
          .fn.green {{userInfo.adout}}
      .table-title
        span.title  收支明细
        .filter
          el-date-picker(v-model="dateRange" value-format="yyyy.MM.dd" type="daterange" range-separator="至"
            start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
          el-button(type='primary' size='mini' @click='filter') 确认
      .table
        el-table(:data='bill.list[opts.pageIndex]' stripe)
          el-table-column(prop='date', label='时间' width='180')
            template(slot-scope='scope')
              span {{scope.row.createddt | dateFormat}}
          el-table-column(prop='typeText', label='类型' width='200' align='center')
          el-table-column(prop='remark', label='明细')
          el-table-column(prop='money', label='收支(元)' width='150' align='center')
            template(slot-scope='scope')
              span {{scope.row.isout ? '-' : '+'}}{{scope.row.money}}
          el-table-column(prop='balance', label='余额(元)' width='150' align='center')
        el-pagination.fl.mb20(:total="bill.count" v-if='bill.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
          :page-size='opts.pageSize' background layout="prev, pager, next")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      bill: { list: {}, count: 0 },
      dateRange: [],
      opts: {
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      }
    }
  },
  created () {
    this.getUserFinance()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    filter () {
      this.opts.pageIndex = 1
      this.opts.startTime = this.dateRange ? this.dateRange[0] : ''
      this.opts.endTime = this.dateRange ? this.dateRange[1] : ''
      this.bill.list = {}
      this.bill.count = 0
      this.getUserFinance()
    },
    handlePageChange (val) {
      this.getUserFinance()
    },
    getUserFinance () {
      if (!this.bill.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getUserFinance(this.opts).then(data => {
          this.bill.count = data.count
          this.$set(this.bill.list, this.opts.pageIndex, data.list)
        })
      }
    }
  }
}
</script>

<style lang='stylus'>
.finance-center
  width 100%
  .header
    display flex
    .finally
      width 25%
      height 100px
      text-align center
      margin-bottom 15px
      .ft
        width 100%
        font-size 14px
      .fn
        width 100%
        height 40px
        line-height 40px
        margin 20px 0
        font-size 40px
        font-weight 400
      .green
        color rgb(13,163,46)
      .orange
        color rgb(255,150,0)
      .red
        color red
  .table-title
    display flex
    align-items center
    line-height 50px
    justify-content space-between
    background-color #e8f1ff
    border-bottom 1px solid #fff
    span.title
      margin-left 10px
    .filter
      display flex
      align-items center
      .el-button
        margin 2px 10px
</style>
