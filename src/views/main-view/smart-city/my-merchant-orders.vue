<template lang='pug'>
  .smart-city-merchant-orders
    .type-title 我的商户订单
    .content
      .tab-options.clearfix
        .item
          .label 订单号
          el-input(size='small' v-model="opts.orderNum" placeholder="订单号" clearable)
        .item
          .label 订单状态
          el-select(v-model="opts.orderStatus" size="small" placeholder="订单状态" )
            el-option(v-for="item in status"
              :key="item.code" :label="item.name" :value="item.code")
        .item
          .label 所属商户
          el-select(v-model="opts.merchantId" size="small" placeholder="所属商户" clearable)
            el-option(v-for="item in smartCityMerchantList"
              :key="item.id" :label="item.name" :value="item.id")
        el-button(@click='search' size="mini" type="primary") 搜索
        .item.fr
          .label 订单验证码
          el-input(size='small' v-model="verifyCode" placeholder="订单验证码" clearable)
          el-button(@click='verifyOrder' size="mini" type="primary") 完成验证

      el-table(:data="merchantOrderList.list[opts.pageIndex]" stripe)
        el-table-column(prop="orderno" label="订单号" min-width='200')
        el-table-column(prop="merchant_name" label="商户名称" min-width='100')
        el-table-column(prop="buyer_nickname" label="买家名称" min-width='100' align='center')
        el-table-column(prop="totalprice" label="订单总额(元)" min-width='120' align='center')
        el-table-column(prop="status" label="订单状态" min-width='100' align='center')
          template(slot-scope="scope")
            span.red(v-if='scope.row.status == 0 && scope.row.is_expired') 已过期
            span.green(v-else) {{scope.row.status_text}}

        el-table-column(prop="content" label="创建时间" min-width='200' align='center')
          template(slot-scope="scope")
            span {{scope.row.created | dateFormat}}

        el-table-column(prop="status" label="操作" width='150')
          template(slot-scope="scope")
            el-button(@click="$refs.merchantOrdersDetail.openModal(scope.row)" type="primary" size="mini" plain) 详情
            el-button(@click="setExpress(scope.row)" v-if="scope.row.status == 2" type="success" size="mini" plain) 发货

      el-pagination.fl.mb20(:total="merchantOrderList.count" v-if='merchantOrderList.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
        :page-size='opts.pageSize' background layout="prev, pager, next")

    //- 快递信息输入对话框
    el-dialog.express(title="输入快递信息" :visible.sync="showExpressInput" width='500px')
      el-form.mt20(:model="expressInfo")
        el-form-item(label="快递名称" label-width="120px")
          el-input(v-model="expressInfo.expressName" size='small' placeholder='请输入快递名称')
        el-form-item(label="快递单号" label-width="120px")
          el-input(v-model="expressInfo.expressNo" size='small' placeholder='请输入快递单号')
      .dialog-footer(slot="footer")
        el-button(@click="submitExpress" type='primary' size='mini') 确 定
        el-button(@click="showExpressInput = false" size='mini') 取 消

    MerchantOrdersDetail(ref='merchantOrdersDetail')

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      merchantList: [],
      merchantDetail: {},
      status: [{ name: '所有订单', code: -1 }, { name: '待发货', code: 2 }, { name: '已发货', code: 3 }, { name: '待使用', code: 4 }, { name: '已完成', code: 10 }],
      merchantOrderList: { list: {}, count: 0 },
      verifyCode: '',
      showExpressInput: false,
      curOrder: {},
      expressInfo: {
        expressName: '',
        expressNo: ''
      },
      opts: {
        pageSize: 10,
        pageIndex: 1,
        orderNum: '',
        orderStatus: -1,
        merchantId: ''
      }
    }
  },
  created () {
    this.getMyMerchantOrderList()
  },
  computed: {
    ...mapGetters(['smartCityConfig', 'smartCityMerchantList'])
  },
  methods: {
    getMyMerchantOrderList () {
      if (!this.merchantOrderList.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSmartCityMyMerchantOrderList(this.opts).then(data => {
          this.$set(this.merchantOrderList.list, this.opts.pageIndex, data.list)
          this.merchantOrderList.count = data.count
        })
      }
    },
    search () {
      this.opts.pageIndex = 1
      this.merchantOrderList.list = {}
      this.merchantOrderList.count = 0
      this.getMyMerchantOrderList()
    },
    handlePageChange (val) {
      this.getMyMerchantOrderList()
    },
    setExpress (item) {
      this.curOrder = item
      this.showExpressInput = true
    },
    submitExpress () {
      if (!this.expressInfo.expressName) {
        this.$vgo.tip('未填写快递名称!', 'warning')
        return
      }
      if (!this.expressInfo.expressNo) {
        this.$vgo.tip('快递单号有误!', 'warning')
        return
      }
      this.$api.setSmartCityMyMerchantOrderStatus(this.curOrder.id, this.expressInfo.expressNo, this.expressInfo.expressName).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.curOrder.status = 3
        this.curOrder.status_text = '已发货'
        this.curOrder.expressno = this.expressInfo.expressNo
        this.curOrder.expressname = this.expressInfo.expressName
        this.expressInfo.expressNo = ''
        this.expressInfo.expressName = ''
      })
      this.showExpressInput = false
    },
    verifyOrder () {
      if (this.verifyCode.length < 14) {
        this.$vgo.tip('请输入14位验证码!', 'warning')
        return
      }
      this.$api.verifySmartCityOrder(this.verifyCode).then(data => {
        this.$vgo.tip('操作成功!', 'success')
      })
    }
  },
  components: {
    MerchantOrdersDetail: () => import('./comps/MerchantOrdersDetail.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.smart-city-merchant-orders
  .content
    padding 0 20px
    .el-table
      img
        width 40px
        height 40px
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
    .express
      .el-input
        width 350px
</style>
