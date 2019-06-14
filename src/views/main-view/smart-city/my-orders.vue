<template lang='pug'>
.smart-city-orders
  .type-title 我的订单
  .content
    .tab-options
      .item
        .label 订单号:
        el-input(size='small' v-model="opts.orderNum" placeholder="请输入订单号" clearable)
      .item
        .label 订单状态:
        el-select(v-model="opts.orderStatus" size="small" placeholder="订单状态" )
          el-option(v-for="(item,index) in status"
            :key="index" :label="item.name" :value="item.code")
      .submit-button
        el-button(@click='search' size="mini" type="primary") 搜索

    .v-table
      .head
        .head-item 商品
        .head-item 单价(元)
        .head-item 数量
        .head-item 操作
      .order(v-for="item in orderList.list[opts.pageIndex]" :key="item.id")
        .order-head
          .time.omit.order-head-item {{item.created | dateFormat}}
          .orderNum.omit.order-head-item 订单号: {{item.orderno}}
          el-tooltip( :content="item.merchant_name" placement="top")
            .merchant.omit.order-head-item 商家: {{item.merchant_name}}
          .total-price.order-head-item 总金额: {{item.totalprice}} 元
          .status.order-head-item
            label 状态:
            span.red(v-if='item.status == 0 && item.is_expired') 已过期
            span.green(v-else) {{item.status_text}}
        .goods-wrap
          .goods-list
            .list(v-for="i in item.order_items" :key="i.id")
              el-tooltip( :content="i.product_name" placement="top")
                .title.omit.goods-item {{i.product_name}}
              .price.goods-item {{i.saleprice}}
              .amount.goods-item {{i.amount}}
          .order-options
            el-button(@click='$refs.myOrdersDetail.openModal(item)' size='mini' type='primary' plain) 详情
            el-button(v-if='item.status == 0 || item.status == 10' @click='delOrder(item)' size='mini' type='danger' plain) 删除
            el-button(v-if="item.status === 3" @click='receivedGoods(item)' size='mini' type='warning' plain) 确认收货
      .null(v-if='!orderList.list[opts.pageIndex]') 暂无数据

    el-pagination.fl.mb20(:total="orderList.count" v-if='orderList.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
      :page-size='opts.pageSize' background layout="prev, pager, next")

  MyOrdersDetail(ref='myOrdersDetail')

</template>

<script>
export default {
  data () {
    return {
      orderList: { list: {}, count: 0 },
      status: [{ name: '所有订单', code: -1 }, { name: '待发货', code: 2 }, { name: '已发货', code: 3 }, { name: '待使用', code: 4 }, { name: '已完成', code: 10 }],
      opts: {
        pageSize: 10,
        pageIndex: 1,
        orderNum: '',
        orderStatus: -1
      },
      curDetail: {},
      showDetail: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    handlePageChange (val) {
      this.getOrderList()
    },
    openOrderDetail (item) {
      this.showDetail = true
      this.curDetail = item
    },
    delOrder (item) {
      this.$vgo.open(() => this.$api.delSmartCityMyOrderList(item.id).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        for (const key in this.orderList.list) {
          if (key >= this.opts.pageIndex) {
            delete this.orderList.list[key]
          }
        }
        this.getOrderList()
      }))
    },
    getOrderList () {
      if (!this.orderList.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSmartCityMyOrderList(this.opts).then(data => {
          this.$set(this.orderList.list, this.opts.pageIndex, data.list)
          this.orderList.count = data.count
        })
      }
    },
    search () {
      this.opts.pageIndex = 1
      this.orderList.list = {}
      this.orderList.count = 0
      this.getOrderList()
    },
    receivedGoods (item) {
      this.$vgo.open(() => {
        this.$api.smartCityReceivedGoods(item.id).then(data => {
          this.$vgo.tip('操作成功!', 'success')
        })
      })
    }
  },
  components: {
    MyOrdersDetail: () => import('./comps/MyOrdersDetail.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl'
.smart-city-orders
  .content
    padding 0 20px
    .v-table
      .head
        display flex
        justify-content space-around
        // .head-item
        line-height 40px
        border-top 1px solid #fff
        background-color $table-head
        .head-item
          flex 1
          text-align center
          &:not(:first-child)
            border-left 1px solid #fff
      .order
        justify-content space-around
        display flex
        flex-wrap wrap
        .order-head
          flex 0 0 100%
          display flex
          background-color rgba($table-head, 0.6)
          .order-head-item
            line-height 40px
            text-align center
            color #999
          .time,.orderNum,.merchant
            flex 0 0 26%
          .total-price,.status
            flex 0 0 11%
        .goods-wrap
          display flex
          flex 1
          .goods-list
            display flex
            flex-direction column
            flex 0 0 75%
            border 1px solid $table-head
            .list
              display flex
              line-height 40px
              &:not(:first-child)
                border-top 1px solid $table-head
              &:hover
                background-color #f5f7fa
              &:nth-child(2n + 1)
                background-color #FAFAFA
              .goods-item
                box-sizing border-box
                padding 0 10px
                flex 1
                &:not(:first-child)
                  border-left 1px solid $table-head
          .order-options
            flex 0 0 25%
            border 1px solid $table-head
            border-left none
            justify-content center
            display flex
            align-items center
      .null
        line-height 40px
        color #999
        text-align center
        border 1px solid $table-head

</style>
