<template lang='pug'>
el-dialog.detail-dialog.smart-city-orders-detail(title="订单详情" :visible.sync="isShow" width='900px')
  .order-info
    .item
      span.label 订单号:
      span {{curDetail.orderno}}
    .item
      span.label 商家名称:
      span {{curDetail.merchant_name}}
    .item
      span.label 订单类型:
      span {{curDetail.type_text}}
    .item
      span.label 订单总额:
      span {{curDetail.totalprice}}
    .item
      span.label 订单状态:
      span.red(v-if='curDetail.status == 0 && curDetail.is_expired') 已过期
      span.green(v-else) {{curDetail.status_text}}
    .item
      span.label 订单支付时间:
      span {{curDetail.endpaytime | dateFormat}}
    template(v-if='curDetail.type == 1')
      .item
        span.label 快递名称:
        span {{curDetail.expressname}}
      .item
        span.label 快递号:
        span {{curDetail.expressno}}
      .item
        span.label 收货人姓名:
        span {{curDetail.consignee_name}}
      .item
        span.label 收货人手机号:
        span {{curDetail.consignee_phone}}
      .item
        span.label 收货邮编:
        span {{curDetail.consignee_postcode}}
      .item
        span.label 收货地址:
        el-tooltip(:content="curDetail.consignee_province + curDetail.consignee_city + curDetail.consignee_address" placement="top")
          span.omit {{curDetail.consignee_province + curDetail.consignee_city + curDetail.consignee_address}}
    .item(v-if='curDetail.verify_code')
        span.label 订单验证码:
        span {{curDetail.verify_code}}
    .item
      span.label 创建时间:
      span {{curDetail.created | dateFormat}}

</template>

<script>
export default {
  data () {
    return {
      curDetail: {},
      isShow: false
    }
  },
  methods: {
    openModal (item) {
      this.isShow = true
      this.curDetail = item
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl'

</style>
