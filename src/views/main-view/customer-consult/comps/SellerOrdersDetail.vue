<template lang='pug'>
el-dialog.detail-dialog.business-seller-orders-detail(title="商品订单详情" width='900px' :visible.sync="isShow")
  .order-info
    .item
      span.label 订单号: 
      span {{curDetail.productorderno}}
    .item
      span.label 订单总额: 
      span {{curDetail.totalprice}} 元
    .item
      span.label 订单状态: 
      span.green {{curDetail.status_text}}
    .item
      span.label 订单支付时间: 
      span {{curDetail.paytime | dateFormat}}
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
      span {{curDetail.name}}
    .item
      span.label 收货人手机号: 
      span {{curDetail.mobile}}
    .item
      span.label 收货邮编: 
      span {{curDetail.postcode}}
    .item
      span.label 收货地址:
      el-tooltip(:content="curDetail.province + curDetail.city + curDetail.address" placement="top")
        span.omit {{curDetail.province + curDetail.city + curDetail.address}}
    .item
      span.label 创建时间:
      span {{curDetail.addtime | dateFormat}}
  el-table(:data="curDetail.orderitems" stripe)
    el-table-column(prop="" label="商品图片" )
      template(slot-scope="scope")
        .goods-name
          img(:src='scope.row.thumburl')
          span {{scope.row.productname}}
    el-table-column(prop="price" label="单价(元)" width="100")
    el-table-column(prop="num" label="数量" width="100")
    el-table-column(label="金额(元)" width="100")
      template(slot-scope="scope")
        span {{(scope.row.price * scope.row.num).toFixed(2)}}
        
</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      curDetail: {},
    }
  },
  created() {
  },
  computed:{
  },
  methods: {
    openModal(item) {
      this.isShow = true
      this.curDetail = item
    },
  },

}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
</style>

