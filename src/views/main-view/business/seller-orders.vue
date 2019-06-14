<template lang='pug'>
.business-seller-orders
  .type-title 销售订单
  .content
    .tab-options
      .item
        span.label 订单状态
        el-select(v-model="curStatus" size="small" ref='status')
          el-option(v-for="item in status"
            :key="item.code" :label="item.name" :value="item.code")
      .submit-button
        el-button(@click='search' size="mini" type="primary") 搜索

    el-table(:data="getCurList.list[getCurList.pageIndex]" stripe)
      el-table-column(prop="productorderno" label="订单号" min-width='210')
      el-table-column(prop="buyer_nickname" label="买家昵称" min-width="100")
      el-table-column(prop="totalprice" label="订单总额" min-width="100")
      el-table-column(prop="status_text" label="订单状态" min-width="100")
        template(slot-scope='scope')
          span.green(v-if='scope.row.status >= 3') {{scope.row.status_text}}
          span.red(v-else) {{scope.row.status_text}}
      el-table-column(prop="expressname" label="快递名称" min-width="100")
      el-table-column(prop="expressno" label="快递号" min-width="170")
      el-table-column(label="创建时间" min-width='170')
        template(slot-scope="scope")
          .time {{scope.row.addtime | dateFormat}}
      el-table-column(prop="status" label="操作" width='150')
        template(slot-scope="scope")
          el-button(@click="$refs.sellerOrdersDetail.openModal(scope.row)" type="success" size="mini" plain) 详情
          el-button(@click="setExpress(scope.row)" v-if="scope.row.status == 2" type="danger" size="mini" plain) 发货

    el-pagination.fl.mb20(:total="getCurList.count" v-if='getCurList.count' @current-change="handlePageChange" :current-page.sync='getCurList.pageIndex'
      :page-size='opts.pageSize' background layout="prev, pager, next")

    //- 快递信息输入对话框
    el-dialog.express(title="输入快递信息" :visible.sync="showExpressInput" width='500px')
      el-form(:model="expressInfo")
        el-form-item(label="快递名称" label-width="120px")
          el-input(v-model="expressInfo.expressName" size='small' placeholder='请输入快递名称')
        el-form-item(label="快递单号" label-width="120px")
          el-input(v-model="expressInfo.expressNo" size='small' placeholder='请输入快递单号')
      .dialog-footer(slot="footer")
        el-button(@click="submitExpress" type='primary' size='mini') 确 定
        el-button(@click="showExpressInput = false" size='mini') 取 消

    SellerOrdersDetail(ref='sellerOrdersDetail')

</template>

<script>
export default {
  data () {
    return {
      status: [{ name: '所有订单', code: -1 }, { name: '待发货', code: 2 }, { name: '已发货', code: 3 }, { name: '已完成', code: 4 }],
      curStatus: -1,
      showExpressInput: false,
      curOrder: null,
      opts: {
        pageIndex: 1,
        status: -1,
        pageSize: 10,
        orderno: ''
      },
      expressInfo: {
        orderId: '',
        status: 3,
        expressName: '',
        expressNo: ''
      },
      orderList: {
        '-1': { list: {}, count: 0, pageIndex: 1 },
        '2': { list: {}, count: 0, pageIndex: 1 },
        '3': { list: {}, count: 0, pageIndex: 1 },
        '4': { list: {}, count: 0, pageIndex: 1 }
      }
    }
  },
  created () {
    this.getSellerOrders()
  },
  computed: {
    getCurList () {
      return this.orderList[this.opts.status]
    }
  },
  methods: {
    submitExpress () {
      if (!this.expressInfo.expressName) {
        this.$vgo.tip('未填写快递名称!', 'warning')
        return
      }
      let reg = /^[a-z0-9]+$/i
      if (!this.expressInfo.expressNo || !reg.test(this.expressInfo.expressNo)) {
        this.$vgo.tip('快递单号有误!', 'warning')
        return
      }
      this.expressInfo.orderId = this.curOrder.productorderid
      this.$api.setSellerOrdersStatus(this.expressInfo).then(data => {
        this.$vgo.tip('操作成功!', 'success')

        this.curOrder.status = 3
        this.curOrder.expressname = this.expressInfo.expressName
        this.curOrder.expressno = this.expressInfo.expressNo
        this.curOrder.status_text = '已发货'

        this.expressInfo.expressName = ''
        this.expressInfo.expressNo = ''
      })
      this.showExpressInput = false
    },
    setExpress (item) {
      this.curOrder = item
      this.showExpressInput = true
    },
    handlePageChange (val) {
      this.getSellerOrders()
    },
    search () {
      this.opts.status = this.curStatus
      this.getSellerOrders()
    },
    getSellerOrders () {
      let order = this.orderList[this.opts.status]
      this.opts.pageIndex = order.pageIndex
      if (!order.list[order.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSellerOrders(this.opts).then(data => {
          order.count = data.count
          this.$set(order.list, order.pageIndex, data.list)
        })
      }
    }
  },
  components: {
    SellerOrdersDetail: () => import('./comps/SellerOrdersDetail.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.business-seller-orders
  .content
    padding 0 20px
    .options
      line-height 40px
      background-color $table-head
      border-bottom 1px solid #fff
      .el-button,.el-select
        margin-left 10px
    .el-table
      img
        max-width 40px
    .express
      .el-dialog__body
        padding-top 20px
      .el-input
        width 300px

</style>
