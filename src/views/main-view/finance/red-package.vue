<template lang="pug">
.finance-red-package
  .type-title 红包结算
  .wrapper
    .tab-options
      .label 当前状态
      .apply.fr
        el-tooltip(placement="top" effect="light")
          div(slot="content") 1. 提现必须绑定微信账户 <br/> 2. 申请的提现金额最小为1元
          .label 提现规则
            span.el-icon-question.green
        el-button(size="mini" type="primary" @click='showWithdrawMoneyDialog') 申请提现

    DataDisplay(:info="totaltRecord")

    .tab-options
      span 提现记录
      //- .item.fr
      //-   el-date-picker(v-model="dateRange" value-format="yyyy.MM.dd" type="daterange" range-separator="至"
      //-     start-placeholder="开始日期"  end-placeholder="结束日期" size='small' :picker-options="pickerOptions")
      //-   el-button(type='primary' size='mini' @click='search') 确认

    el-table(:data='getCurList' stripe)
      el-table-column(label='结算时间' width='200')
        template(slot-scope='scope')
          span {{scope.row.created | dateFormat}}
      el-table-column(prop='money', label='结算金额(元)' min-width='100' align='center')
      el-table-column(label='结算结果' min-width='100')
        template(slot-scope='scope')
          span(:class='scope.row.status == 1 ? "green" : "red"') {{scope.row.status_text}}
      el-table-column(prop='paymentno', label='微信单号' min-width='220')
      el-table-column(prop='remark', label='备注' min-width='260')

    el-pagination.fl.mb20(:total="redPackWithdrawList.length" v-if='redPackWithdrawList.length' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
      :page-size='opts.pageSize' background layout="prev, pager, next")

    //- 提现输入对话框
    el-dialog(title="申请提现" :visible.sync="showWithdrawMoney" width='500px')
      el-form.mt20(label-width="120px")
        el-form-item(label="可提现金额(元):")
          span.red {{totaltRecord[0].count}}
        el-form-item(label="申请金额(元):")
          el-input(v-model="withdrawNum" @change='checkWithdrawNum' size='small' placeholder='请输入申请金额')
        el-form-item(label="提现注意:")
          span.red 提现必须绑定微信账户，否则无法提现成功!
      .dialog-footer(slot="footer")
        el-button(@click="submit" type='primary' size='mini') 确 定
        el-button(@click="showWithdrawMoney = false" size='mini') 取 消

</template>
<script>

import { mapGetters } from 'vuex'
export default {

  data () {
    return {
      showWithdrawMoney: false,
      totaltRecord: [{
        count: '',
        title: '可提现红包金额(元)'
      }, {
        count: '',
        title: '累计提现红包金额(元)'
      }, {
        count: '',
        title: '累计抢到红包金额(元)'
      } ],
      opts: {
        pageIndex: 1,
        pageSize: 10,
        status: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      dateRange: [],
      redPackWithdrawList: [],
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
      if (this.redPackWithdrawList[(this.opts.pageIndex - 1) * this.opts.pageSize]) {
        return this.redPackWithdrawList.slice((this.opts.pageIndex - 1) * this.opts.pageSize, this.opts.pageIndex * this.opts.pageSize)
      }
    }
  },
  methods: {
    getTotal () {
      this.$api.getUserFinanceRedPackageTotal().then(data => {
        this.totaltRecord[0].count = data.redpacketbank
        this.totaltRecord[1].count = data.totalclear
        this.totaltRecord[2].count = data.totalredpacketbank
      })
    },
    getBalenceList () {
      let PI = this.opts.pageIndex
      let PS = this.opts.pageSize
      if (!this.redPackWithdrawList[(PI - 1) * PS]) {
        this.$vgo.openLoading()
        this.$api.getUserFinanceRedPackageWithdrawRecord(this.opts).then(data => {
          this.redPackWithdrawList.length = data.count
          this.redPackWithdrawList.splice((PI - 1) * PS, PS, ...data.list)
        })
      }
    },
    search () {
      this.opts.startTime = this.dateRange ? this.dateRange[0] : ''
      this.opts.endTime = this.dateRange ? this.dateRange[1] : ''
      this.opts.pageIndex = 1
      this.redPackWithdrawList = []
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
      if (this.withdrawNum > this.totaltRecord[0].count) {
        this.$vgo.tip('输入金额大于可提现金额!', 'warning')
        return
      }
      if (this.withdrawNum < 1) {
        this.$vgo.tip('提现金额不能少于1元!', 'warning')
        return
      }
      this.$api.applyRedPackageWithDraw(this.withdrawNum).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.showWithdrawMoney = false
      })
    },
    showWithdrawMoneyDialog () {
      if (Number(this.userInfo.rz_status) !== 4) {
        this.$vgo.tip('需要实名认证通过才能操作!', 'warning')
        this.$router.push({name: 'certificate'})
        return
      }
      if (this.totaltRecord[0].count <= 0) {
        this.$vgo.tip('暂无可提现金额!', 'warning')
        return
      }
      this.showWithdrawMoney = true
    },
    handlePageChange () {
      this.getBalenceList()
    }
  },
  components: {
    DataDisplay: () => import('@/components/DataDisplay')
  }
}
</script>

<style lang="stylus">
.finance-red-package
  width 100%

</style>
