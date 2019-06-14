<template lang="pug">
.apply-page(v-if='getCert')
  .type-title {{$route.meta.title}}
  .item.tac.mt20(v-if='getCert.status == 0') 申请已提交, 等待审核, 请耐心等待
  .item.tac.mt20.red(v-if='getCert.status == 2')  审核不通过, 原因: {{getCert.remark}}
  .item.tac.mt20.red(v-if='getCert.status == 3')  申请驳回, 原因: {{getCert.remark}}
  template(v-if='getCert.status')
    iframe(:src="$route.name == 'apply-works-market' ? panoAgreementUrl : userAgreementUrl")
    .bottom
      el-button(@click="submit" type='primary' size='mini' :disabled="!checked") {{getCert.status != -1 ? '再次':''}}申请
      el-checkbox(v-model="checked")
      span.accept 我已阅读并同意
        span.agreement {{`《${platformName}用户协议》`}}
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      platformName: window.$globalconfig.PLATFORM_NAME,
      checked: true,
      userAgreementUrl: window.$globalconfig.URLS.API + 'agreement/user?token=' + this.$auth.getToken(),
      panoAgreementUrl: window.$globalconfig.URLS.API + 'agreement/panosales?token=' + this.$auth.getToken()
    }
  },
  computed: {
    ...mapGetters(['adsCert', 'adzCert', 'worksMarketCert']),
    getCert () {
      if (this.$route.name === 'apply-works-market') {
        return this.worksMarketCert
      } else if (this.$route.name === 'apply-ads') {
        return this.adsCert
      } else if (this.$route.name === 'apply-adz') {
        return this.adzCert
      }
    }
  },
  mounted () {
    if (this.getCert && Number(this.getCert.status) === 1) {
      if (this.$route.name === 'apply-works-market') {
        this.$router.push({ name: 'works-market-seller-goods' })
      } else if (this.$route.name === 'apply-ads') {
        this.$router.push({ name: 'ad-income' })
      } else if (this.$route.name === 'apply-adz') {
        this.$router.push({ name: 'ad-publish' })
      }
    }
  },
  methods: {
    submit () {
      if (this.$route.name === 'apply-works-market') {
        this.apply('applyWorksMarket').then(() => {
          this.$store.commit('CLAER_CERT', 'worksMarketCert')
        })
      } else if (this.$route.name === 'apply-ads') {
        this.apply('applyADMerchant').then(() => {
          this.$store.commit('CLAER_CERT', 'adsCert')
        })
      } else if (this.$route.name === 'apply-adz') {
        this.apply('applyADOwn').then(() => {
          this.$store.commit('CLAER_CERT', 'adzCert')
        })
      }
    },
    apply (name) {
      return this.$api[name]().then(res => {
        this.$vgo.tip('操作成功!', 'success')
      })
    }
  }
}
</script>

<style lang="stylus">
.apply-page
  .type-title
    margin-bottom 0
  .item
    font-size 16px
  iframe
    width 100%
    height 600px
    border none
  .bottom
    box-sizing border-box
    width 100%
    margin-top 30px
    margin-left 150px
    .el-button
      width 200px
    .el-checkbox
      margin 0 10px 0 100px
    .accept
      display inline-block
      .agreement
        cursor pointer
        color $blue
</style>
