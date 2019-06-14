<template lang='pug'>
  .vip-order
    .type-title 套餐订单
    .wrapper
      el-table(:data="orderList[curPage - 1]" stripe :style="{ border: '1px solid #f5f5f5' }")
        el-table-column(prop="orderno" label="订单号" )
        el-table-column(prop="package_name" label="商品" align='center')
        el-table-column(prop="price" label="订单金额(元)" align='center')
        el-table-column(prop="status" label="订单状态")
          template(slot-scope="scope")
            span(:class="scope.row.status == 3? 'green' : 'red'") {{scope.row.status_text}}
        el-table-column(prop="createddt" label="下单时间" )

      el-pagination.fl(:total="total" v-if='total' @current-change="handlePageChange" :current-page.sync='curPage'
        :page-size='pageSize' background layout="prev, pager, next")
</template>

<script>
export default {
  data () {
    return {
      orderList: [],
      orderType: '',
      total: 0,
      curPage: 1,
      pageSize: 10,
      account: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    handlePageChange () {
      this.getOrderList()
    },
    getOrderList () {
      if (!this.orderList[this.curPage - 1]) {
        this.$vgo.openLoading()
        this.$api.getUserPackageOrder(this.curPage, this.pageSize).then(data => {
          this.total = data.count
          this.orderList.push(data.list)
        })
      }
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.vip-order
  .content
    padding 0 10px
    .el-table
      img
        max-width 40px
</style>
