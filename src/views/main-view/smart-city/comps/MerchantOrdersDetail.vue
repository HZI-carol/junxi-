<template lang='pug'>
el-dialog.detail-dialog.smart-city-merchant-orders-detail(title="商品订单详情" :visible.sync="isShow" width='900px')
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
      span {{curDetail.totalprice}} (元)
    .item
      span.label 订单状态:
      span.green {{curDetail.status_text}}
    .item
      span.label 订单支付时间:
      span {{curDetail.endpaytime | dateFormat}}
    template(v-if='curDetail.type == 1')
      .item
        span.label 订单发货时间:
        span {{curDetail.endpaytime | dateFormat}}
      .item
        span.label 订单完成时间:
        span {{curDetail.endpaytime | dateFormat}}
      .item
        span.label 快递名称:
        span {{curDetail.expressname}}
      .item
        span.label 快递号:
        span {{curDetail.expressno}}
      .item
        span.label 买家昵称:
        span {{curDetail.buyer_nickname}}
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
          span.omit  {{curDetail.consignee_province + curDetail.consignee_city + curDetail.consignee_address}}
    .item
      span.label 创建时间:
      span {{curDetail.created | dateFormat}}
  el-table(:data="curDetail.order_items" stripe)
    el-table-column(prop="product_name" label="商品名称" show-overflow-tooltip)
      template(slot-scope="scope")
        .goods-name
          img(:src='scope.row.full_product_icon_url')
          span.omit {{scope.row.product_name}}
    el-table-column(prop="saleprice" label="单价(元)" width="100" align='center')
    el-table-column(prop="amount" label="数量" width="100" align='center')
    el-table-column(prop="" label="金额(元)" width="100" align='center')
      template(slot-scope="scope")
        span {{scope.row.saleprice * scope.row.amount}}

</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      curDetail: {}
    }
  },
  methods: {
    openModal (item) {
      this.curDetail = item
      this.isShow = true
    }
  }

}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.smart-city-merchant-orders-datail
  .order-detail
    .order-info
      display flex
      flex-wrap wrap
      background-color rgba($table-head, 0.41)
      .item
        width 50%
        padding  5px 10px
        border-bottom 1px solid #ddd
        line-height 30px
        .label
          display inline-block
          font-weight 700
          margin-right 10px
          width 90px
          text-align right
    .goods-name
      display flex
      align-items center
      img
        margin-right 10px

</style>
