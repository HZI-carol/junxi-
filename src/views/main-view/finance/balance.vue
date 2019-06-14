<template lang="pug">
  .finance-balance
    .type-title 财务结算
    .wrapper
      .tab-options
        .label 当前状态
        .apply.fr
          el-tooltip(placement="top" effect="light")
            div(slot="content") 1.申请结算之后，我司将在1~3个工作日处理 <br/> 2.申请结算后，如有问题可直接与我司联系
            .label 结算规则
              span.el-icon-question.green
          el-button(size="mini", type="primary" @click='showWithdrawMoneyDialog') 申请结算
      DataDisplay(:info="totalRecord")

      .tab-options
        span 结算记录
        .item.fr
          el-date-picker(v-model="dateRange" value-format="yyyy.MM.dd" type="daterange" range-separator="至"
            start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
          el-button(type='primary' size='mini' @click='search') 确认

      el-table(:data='getCurList' stripe)
        el-table-column(label='结算时间')
          template(slot-scope='scope')
            span {{scope.row.createddt | dateFormat}}
        el-table-column(prop='money', label='结算金额(元)')
        el-table-column(label='结算结果')
          template(slot-scope='scope')
            span(:class='scope.row.status == 2 ? "green" : "red"') {{scope.row.statusText}}

      el-pagination.fl.mb20(:total="balanceList.length" v-if='balanceList.length' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
        :page-size='opts.pageSize' background layout="prev, pager, next")
    //- 提现输入对话框
    el-dialog(title="申请结算" :visible.sync="showWithdrawMoney" width='500px')
      el-form.mt20(label-width="120px")
        el-form-item(label="可结算金额(元):")
          span.red {{totalRecord[0].count}}
        el-form-item(label="申请金额(元):")
          el-input(v-model="withdrawNum" @change='checkWithdrawNum' size='small' placeholder='请输入申请金额')
      .dialog-footer(slot="footer")
        el-button(@click="submit" type='primary' size='mini') 确 定
        el-button(@click="showWithdrawMoney = false" size='mini') 取 消
</template>
<script>
import { mapGetters } from 'vuex'
export default {

  data () {
    return {
      totalRecord: [{
        count: '',
        title: '可结算金额(元)'
      }, {
        count: '',
        title: '已结算金额(元)'
      }, {
        count: '',
        title: '待结算金额(元)'
      }],
      opts: {
        pageIndex: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      dateRange: [],
      balanceList: [],
      showWithdrawMoney: false,
      withdrawNum: ''
    }
  },
  created () {
    this.getTotal()
    this.getBalenceList()
  },
  computed: {
    ...mapGetters(['userInfo']),
    getCurList () {
      if (this.balanceList[(this.opts.pageIndex - 1) * this.opts.pageSize]) {
        return this.balanceList.slice((this.opts.pageIndex - 1) * this.opts.pageSize, this.opts.pageIndex * this.opts.pageSize)
      }
    }
  },
  methods: {
    getTotal () {
      this.$api.getUserFinanceBalanceTotal().then(data => {
        this.totalRecord[0].count = data.bank
        this.totalRecord[1].count = data.allclear
        this.totalRecord[2].count = data.waitclear
      })
    },
    getBalenceList () {
      let PI = this.opts.pageIndex
      let PS = this.opts.pageSize
      if (!this.balanceList[(PI - 1) * PS]) {
        this.$vgo.openLoading()
        this.$api.getUserFinanceBalanceRecord(this.opts).then(data => {
          this.balanceList.length = data.count
          this.balanceList.splice((PI - 1) * PS, PS, ...data.list)
        })
      }
    },
    search () {
      this.opts.startTime = this.dateRange ? this.dateRange[0] : ''
      this.opts.endTime = this.dateRange ? this.dateRange[1] : ''
      this.opts.pageIndex = 1
      this.balanceList = []
      this.getBalenceList()
    },
    handlePageChange () {
      this.getBalenceList()
    },
    checkWithdrawNum (val) {
      if (isNaN(val) || val <= 0) {
        this.withdrawNum = 0
        return
      }
      this.withdrawNum = Number(val).toFixed(2)
    },
    submit () {
      if (!this.withdrawNum) {
        this.$vgo.tip('请输入正确的金额!', 'warning')
        return
      }
      if (this.withdrawNum > this.totalRecord[0].count) {
        this.$vgo.tip('输入金额大于可提现金额!', 'warning')
        return
      }
      this.$api.applyBalanceWithDraw(this.withdrawNum).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        this.showWithdrawMoney = false
        this.balanceList = []
        this.opts = {
          pageIndex: 1,
          pageSize: 10,
          startTime: '',
          endTime: ''
        }
        this.getBalenceList()
      })
    },
    showWithdrawMoneyDialog () {
      if (Number(this.userInfo.rz_status) !== 4) {
        this.$vgo.tip('需要实名认证通过才能操作!', 'warning')
        this.$router.push({ name: 'certificate' })
        return
      }
      if (this.totalRecord[0].count <= 0) {
        this.$vgo.tip('暂无可结算金额!', 'warning')
        return
      }
      this.showWithdrawMoney = true
    }
  },
  components: {
    DataDisplay: () => import('@/components/DataDisplay')
  }
}
</script>

<style lang="stylus">
.finance-balance
  width 100%

</style>
