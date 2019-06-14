<template lang='pug'>
  .business-seller-goods
    .type-title 商品列表
    .wrapper
      .tab-options
        .add-goods-button
          el-button(size='mini',type="primary",@click="$refs.goodsEditor.openModal('add')") 添加商品
        .item
          .label 是否上架
          el-input.name(size='mini', v-model='opts.name' placeholder='请输入商品名称' clearable)
        .item
          .label 是否上架
          el-select(size='mini',v-model='opts.isputaway', placeholder='请选择' clearable)
            el-option(label='是', value='1')
            el-option(label='否', value='0')
        .item
          .label 库存量
          el-select(size='mini',v-model='opts.isfullstock', placeholder='请选择' clearable)
            el-option(label='充足', value='1')
            el-option(label='不足', value='0')
        .submit-button
          el-button.search(size='mini', type='primary', @click='searchGoods') 搜索

      .table1
        el-table(:data='goodsList.list[opts.pageIndex]' stripe)
          el-table-column(prop='imgPath', label='图片' align='center' width='100')
            template(slot-scope="scope")
              img(:src="scope.row.full_icon_url" style="width:40px;height:40px")
          el-table-column(prop='name', label='商品名称' show-overflow-tooltip)
          el-table-column(prop='cmpprice', label='进货价格(元)')
          el-table-column(prop='price', label='销售价格(元)')
          el-table-column(prop='stock', label='库存量')
          el-table-column(prop='isputaway', label='是否上架' align='center' width='100')
            template(slot-scope="scope")
              span(:class='scope.row.isputaway == 1 ? "green": "red"') {{scope.row.isputaway == 1 ? '是' : '否'}}
          el-table-column(prop='time', label='添加时间' width='160')
            template(slot-scope="scope")
              span {{scope.row.addtime | dateFormat}}
          el-table-column(label='操作' width='220')
            template(slot-scope="scope")
              el-button(@click='$refs.goodsEditor.openModal(scope.row)', type='success', size='mini' plain) 更新
              el-button(@click='setSellerProductIsPutaway(scope.row)',
              :type='scope.row.isputaway == 1 ? "warning" : "success"', size='mini' plain) {{scope.row.isputaway == 1 ? '下架' : '上架'}}
              el-button(@click='delSellerProduct(scope.row)', type='danger', size='mini' plain) 删除

        el-pagination.fl.mb20(:total="goodsList.count" v-if='goodsList.count' @current-change="handlePageChange" :current-page.sync='opts.pageIndex'
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
        name: '',
        isputaway: '',
        isfullstock: ''
      }
    }
  },
  created () {
    this.getSellerProduct()
  },
  methods: {
    getSellerProduct () {
      if (!this.goodsList.list[this.opts.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSellerProduct(this.opts).then(data => {
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
        this.$api.setSellerProductIsPutaway(item.productid, (item.isputaway ? 0 : 1)).then(data => {
          item.isputaway = item.isputaway ? 0 : 1
          this.$vgo.tip('操作成功!', 'success')
        })
      })
    },
    delSellerProduct (item) {
      this.$vgo.open(() => {
        this.$api.delSellerProduct(item.productid).then(data => {
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
    }
  },
  components: {
    GoodsEditor: () => import('./comps/GoodsEditor.vue')
  }
}
</script>

<style lang="stylus">
.business-seller-goods
  width 100%
</style>
