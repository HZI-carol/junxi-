<template lang="pug">
.merchant-info-modal(v-if='isShow')
  el-dialog(title="商户详情" :visible.sync="isShow" width='1000px' center )
    .dialog-content
      .item
        .item-label 商户名称:
        span {{merchant.name}}
      .item
        .item-label 联系电话:
        .list.el-icon-mobile-phone(v-if='merchant.phone') {{' ' + merchant.phone}}
        .list.el-icon-phone-outline(v-if='merchant.telephone') {{' ' + merchant.telephone}}
      .item
        .item-label 商户LOGO:
        img(:src='merchant.full_logourl')
      .item
        .item-label 公众号二维码:
        img.qrcode(:src='merchant.full_qrcodeurl')
      .item.banner
        .item-label Banner图片:
        img(:src='merchant.full_bannerurl')
      .item
        .item-label 全景地址:
        .iframe(v-if='merchant.panourl')
          iframe(:src='merchant.panourl' width='700' height='400')
          a(:href='merchant.panourl' target='_blank')
            el-button(type='primary' size='mini') 在新窗口中打开
        span.null(v-else) 未设置全景地址
      .item
        .item-label 评分:
        span {{merchant.rate}}
      .item
        .item-label 人气值:
        span {{merchant.seecount}}
      .item
        .item-label 地址:
        span {{merchant.province + merchant.city + merchant.address}}
      .item
        .item-label 营业时间:
        span {{merchant.start_opentime + ' - ' + merchant.end_opentime}}
      .item
        .item-label 状态:
        span(v-if='merchant.status == 0') 未审核
        span.green(v-if='merchant.status == 1') 审核通过
        span.red(v-if='merchant.status == 2') 审核不通过
      .item
        .item-label 是否推荐:
        span {{merchant.isrecommond ? '是' : '否'}}
      .item
        .item-label 创建时间:
        span {{merchant.created | dateFormat}}
      .item
        .item-label 商户简介:
        .dec {{merchant.description}}

</template>

<script>

export default {
  data () {
    return {
      isShow: false,
      merchant: {}
    }
  },
  methods: {
    openModal (item) {
      this.isShow = true
      this.$nextTick(() => {
        this.$vgo.openLoading('.el-dialog')
        this.$api.getSmartCityMerchantInfo(item.id).then(res => {
          this.merchant = res.data
        })
      })
    }
  }
}
</script>

<style lang="stylus">
.merchant-info-modal
  .el-dialog
    overflow hidden
    .el-dialog__header
      width 100%
      z-index 999
    .el-dialog__body
      .dialog-content
        height 600px
        padding-top 20px
        .banner
          img
            max-width 700px
        .item
          margin-bottom 20px
          line-height 32px
          .item-label
            display inline-block
            margin 0 10px
            text-align right
            font-weight 700
            width 100px
            line-height 32px
            vertical-align top
          .dec
            display inline-block
            width 800px
          .list
            margin-right 10px
          img
            border 1px solid #ddd
          .qrcode
            width 150px
            height 150px
          .iframe
            display inline-block
            position relative
            a
              position absolute
              top 0
              right 0

</style>
