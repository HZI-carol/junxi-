<template lang="pug">
  .finance-recharge
    .type-title 账户余额/积分
    .data-display
      DataDisplay(:info="getTotalData")

    .type-title 账户充值
    <el-form label-width='120px' @submit.native.prevent>
      el-form-item(label='充值金额(元)' required)
        el-input(size="small" v-model='recharge.totalfee' @change='getToltalFee')
      el-form-item(label='支付类型' required)
        el-radio-group(v-model='recharge.paytype')
          el-radio(:label='1') 支付宝
          el-radio(:label='2') 微信
      el-form-item
        el-button(size="small", type='primary', @click='onSubmit') 确认充值
    </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      recharge: {
        totalfee: '',
        paytype: 1,
        ordertype: 2,
        return_url: window.location.href + '?reload=true'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    getTotalData () {
      if (this.userInfo.user_id) {
        return [{
          count: this.userInfo.bank,
          title: '账户余额(元)'
        }, {
          count: this.userInfo.integral,
          title: '账户积分'
        } ]
      }
      return []
    }
  },
  mounted () {
    // if (this.$route.query.reload) {
    this.$vgo.openLoading()
    this.$store.dispatch('getUserInfo')
    // this.$router.push({name: 'account-recharge'})
    // }
  },
  methods: {
    getToltalFee (val) {
      if (isNaN(val) || val <= 0) {
        this.recharge.totalfee = 0
        return
      }
      this.recharge.totalfee = Number(val).toFixed(2)
    },
    onSubmit () {
      if (!this.recharge.totalfee) {
        this.$vgo.tip('请输入正确的金额!', 'warning')
        return
      }
      this.recharge.totalfee *= 100
      this.$api.createPayOrder(this.recharge).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        window.location.href = data
      })
      this.recharge.totalfee = 0
    }
  },
  components: {
    DataDisplay: () => import('@/components/DataDisplay')
  }
}
</script>

<style lang="stylus">
.finance-recharge
  width 100%
  .type-title
    &~.type-title
      box-sizing content-box
      border-top 10px solid #eee
</style>
