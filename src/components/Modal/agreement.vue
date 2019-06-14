<template lang="pug">
.agreement-modal
  el-dialog(:title="`${platformName}用户协议`" :visible.sync="isShow" width='1000px' v-if='type')
    iframe(v-show='type == 1' :src='userAgreementUrl')
    iframe(v-show='type == 2' :src='panoAgreementUrl')
</template>

<script>
export default {
  data () {
    return {
      platformName: window.$globalconfig.PLATFORM_NAME,
      isShow: false,
      type: 0,
      userAgreementUrl: window.$globalconfig.URLS.API + 'agreement/user?token=' + this.$auth.getToken(),
      panoAgreementUrl: window.$globalconfig.URLS.API + 'agreement/panosales?token=' + this.$auth.getToken()
    }
  },
  methods: {
    openModal (obj) {
      this.type = obj.data
      this.isShow = true
    }
  }
}
</script>

<style lang="stylus">
.agreement-modal
  .el-dialog
    iframe
      width 100%
      height 600px
      border none
    pre
      height 60vh
      padding 20px
      overflow-x hidden
      white-space pre-wrap!important
      word-wrap break-word!important
      *white-space normal!important
</style>
