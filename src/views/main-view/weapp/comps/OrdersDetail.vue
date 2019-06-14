<template lang='pug'>
el-dialog.detail-dialog.weapp-orders-detail(title="商品订单详情" width='900px' :visible.sync="isShow")
  .dialog-content
    .order-info
      .item
        .label 订单号:
        span {{curDetail.orderno}}
      .item
        .label 订单总额:
        span {{curDetail.totalprice}} 元
      .item
        .label 订单状态:
        span.green {{curDetail.status_text}}
      .item
        .label 订单支付时间:
        span {{curDetail.endpaytime | dateFormat}}
      .item
        .label 快递名称:
        span {{curDetail.expressname}}
      .item
        .label 快递号:
        span {{curDetail.expressno}}
      .item
        .label 买家昵称:
        span {{curDetail.buyer_nickname}}
      .item
        .label 收货人姓名:
        span {{curDetail.consignee_name}}
      .item
        .label 收货人手机号:
        span {{curDetail.consignee_phone}}
      .item
        .label 收货邮编:
        span {{curDetail.consignee_postcode}}
      .item
        .label 收货地址:
        el-tooltip(:content="curDetail.consignee_province + curDetail.consignee_city + curDetail.consignee_address" placement="top")
          span.omit {{curDetail.consignee_province + curDetail.consignee_city + curDetail.consignee_address}}
      .item
        .label 创建时间:
        span {{curDetail.created | dateFormat}}
    el-table(:data="curDetail.order_items" stripe)
      el-table-column(prop="product_name" label="商品名称" )
        template(slot-scope="scope")
          .goods-name
            img(:src='scope.row.product_icon_url')
            span {{scope.row.product_name}}
      el-table-column(prop="saleprice" label="单价(元)" width="100")
      el-table-column(prop="amount" label="数量" width="100")
      el-table-column(prop="" label="金额(元)" width="100")
        template(slot-scope="scope")
          span {{scope.row.saleprice * scope.row.amount}}

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
@import '~@/assets/style/index.styl';
.weapp-orders-detail
  .dialog-content
    height 600px
    .order-info
      display flex
      flex-wrap wrap
      background-color rgba($table-head, 0.41)
      .item
        width 50%
        padding  5px 20px
        border-bottom 1px solid #ddd

</style>
