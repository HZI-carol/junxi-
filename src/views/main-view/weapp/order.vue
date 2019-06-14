<template lang='pug'>
.works-market-buyer
  .type-title 小程序订单
  .content
    .tab-options
      .item
        .label 订单状态:
        el-select(v-model="opts.status" size="small" placeholder="选择订单状态")
          el-option(v-for="(item,index) in status"
            :key="index" :label="item.name" :value="item.code")
        el-button(size="mini" type="primary" @click='search') 搜索

    el-table(:data="ordersList.list[opts.pageIndex]" stripe)
      el-table-column(prop="orderno" label="订单号" )
      el-table-column(prop="buyer_nickname" label="买家昵称" width="100")
      el-table-column(prop="totalprice" label="订单总额" width="100")
      el-table-column(prop="status_text" label="订单状态" width="100")
      el-table-column(prop="expressname" label="快递名称" )
      el-table-column(prop="expressno" label="快递号" )
      el-table-column(prop="content" label="创建时间" )
        template(slot-scope="scope")
          .time {{scope.row.created | dateFormat}}
      el-table-column(prop="status" label="操作" width='150')
        template(slot-scope="scope")
          el-button(@click="$refs.ordersDetail.openModal(scope.row)" type="success" size="mini" plain) 详情
          el-button(@click="setExpress(scope.row)" v-if="scope.row.status == 2" type="danger" size="mini" plain) 发货

    el-pagination.fl(:total="ordersList.count" v-if='ordersList.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
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

    OrdersDetail(ref='ordersDetail')

</template>

<script>
export default {
  data () {
    return {
      status: [{ name: '所有订单', code: -1 }, { name: '待发货', code: 2 }, { name: '已发货', code: 3 }, { name: '已完成', code: 10 }],
      opts: {
        pageIndex: 1,
        pageSize: 10,
        status: -1,
        orderno: ''
      },
      showExpressInput: false,
      curOrder: {},
      expressInfo: {
        expressName: '',
        expressNo: ''
      },
      ordersList: { list: {}, count: 0 }
    }
  },
  created () {
    this.getWeappOrder()
  },
  methods: {
    submitExpress () {
      if (this.expressInfo.expressName === '') {
        this.$vgo.tip('未填写快递名称!', 'warning')
        return
      }
      if (!this.expressInfo.expressNo) {
        this.$vgo.tip('快递单号有误!', 'warning')
        return
      }
      this.$api.setWeappOrderStatus(this.curOrder.id, 2, this.expressInfo.expressNo, this.expressInfo.expressName).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        this.curOrder.status = 3
        this.curOrder.status_text = '已发货'
      })
      this.showExpressInput = false
    },
    setExpress (item) {
      this.curOrder = item
      this.showExpressInput = true
    },
    handlePageChange (val) {
      this.getWeappOrder()
    },
    search () {
      this.opts.pageIndex = 1
      this.ordersList.list = {}
      this.ordersList.count = 0
      this.getWeappOrder()
    },
    getWeappOrder () {
      if (!this.ordersList.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getWeappOrder(this.opts).then(data => {
          this.ordersList.count = data.count
          this.$set(this.ordersList.list, this.opts.pageIndex, data.list)
        })
      }
    }
  },
  components: {
    OrdersDetail: () => import('./comps/OrdersDetail.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.works-market-buyer
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
