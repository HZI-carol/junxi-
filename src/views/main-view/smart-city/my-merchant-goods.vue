<template lang='pug'>
.my-merchant-goods
  .type-title 商品列表
  .wrapper
    .tab-options
      el-button(size='mini',type="primary",@click="$refs.goodsEditor.openModal({fk_merchant_id: $route.params.id})") 添加商品
      .item
        .label 商品名称
        el-input.name(size='mini', v-model='opts.keyword' placeholder='请输入关键词' clearable)
      .item
        .label 是否上架
        el-select(size='mini',v-model='opts.isputaway', placeholder='请选择' )
          el-option(label='所有商品', :value='-1')
          el-option(label='是', :value='1')
          el-option(label='否', :value='0')
      .item
        .label 商品类型
        el-select(size='mini',v-model='opts.type', placeholder='请选择' )
          el-option(label='所有商品', :value='0')
          el-option(label='实物', :value='1')
          el-option(label='虚拟', :value='2')
      el-button.search(size='mini', type='primary', @click='searchGoods') 搜索

    .table1
      el-table(:data='goodsList.list[opts.pageIndex]' stripe)
        el-table-column(prop='imgPath', label='图片' align='center' width='100')
          template(slot-scope="scope")
            img(:src="scope.row.full_icon_url" style="width:40px;height:40px")
        el-table-column(prop='name', label='商品名称')
        el-table-column(prop='offerprice', label='进货价格(元)')
        el-table-column(prop='saleprice', label='销售价格(元)')
        el-table-column(prop='stock', label='库存量')
        el-table-column(prop='isputaway', label='是否上架' align='center' width='100')
          template(slot-scope="scope")
            span(:class='scope.row.isputaway? "green": "red"') {{scope.row.isputaway? '是' : '否'}}
        el-table-column(prop='time', label='添加时间' width='160')
          template(slot-scope="scope")
            span {{scope.row.created | dateFormat}}
        el-table-column(label='操作' width='210')
          template(slot-scope="scope")
            el-button(@click='$refs.goodsEditor.openModal(scope.row)', type='success', size='mini' plain) 更新
            el-button(@click='setSellerProductIsPutaway(scope.row)',
            :type='scope.row.isputaway? "warning" : "success"', size='mini' plain) {{scope.row.isputaway == 1 ? '下架' : '上架'}}
            el-button(@click='delSellerProduct(scope.row)', type='danger', size='mini' plain) 删除

      el-pagination.fl(:total="goodsList.count" v-if='goodsList.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
        :page-size='opts.pageSize' background layout="prev, pager, next")

    GoodsEditor(ref='goodsEditor')
</template>

<script>
export default {
  data () {
    return {
      goodsList: { list: {}, count: 0 },
      opts: {
        pageIndex: 1,
        pageSize: 10,
        type: 0,
        keyword: '',
        isputaway: -1,
        merchantId: ''
      }
    }
  },
  mounted () {
    if (!this.$route.params.hasOwnProperty('id')) this.$router.go(-1)
    this.goodsList.list = {}
    this.opts.merchantId = this.$route.params.id
    this.getSellerProduct()
  },
  methods: {
    getSellerProduct () {
      if (!this.goodsList.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSmartCityMerchantProduct(this.opts).then(data => {
          this.goodsList.count = data.count
          this.$set(this.goodsList.list, this.opts.pageIndex, data.list)
        })
      }
    },
    handlePageChange (val) {
      this.getSellerProduct()
    },
    setSellerProductIsPutaway (item) {
      this.$vgo.open(() => {
        this.$api.setSmartCityMerchantProductIsPutaway(item.id, !item.isputaway).then(data => {
          item.isputaway = !item.isputaway
          this.$vgo.tip('操作成功!', 'success')
        })
      })
    },
    delSellerProduct (item) {
      this.$vgo.open(() => {
        this.$api.delSmartCityMerchantProduct(item.id).then(data => {
          for (const key in this.goodsList.list) {
            if (key >= this.opts.pageIndex) {
              delete this.goodsList.list[key]
            }
          }
          this.getSellerProduct()
          this.$vgo.tip('操作成功!', 'success')
        })
      })
    },
    initGoodsList () {
      this.goodsList.list = {}
      this.opts.pageIndex = 1
      this.getSellerProduct()
    },
    searchGoods () {
      this.goodsList.list = {}
      this.goodsList.count = 0
      this.getSellerProduct()
      console.log(this.opts)
    }
  },
  components: {
    GoodsEditor: () => import('./comps/GoodsEditor.vue')
  }
}
</script>

<style lang="stylus">
.my-merchant-goods
  width 100%
  .table1
    .el-pagination
      margin-bottom 20px
</style>
