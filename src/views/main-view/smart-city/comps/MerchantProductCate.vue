<template lang="pug">
.merchant-product-cate-modal(v-if='isShow')
  el-dialog.cate-list(title="商品分类" :visible.sync="isShow" width='900px' center)
    .dialog-content
      .options
        el-button(:disabled='smartCityConfig.max_merchant_product_category_count <= cateList.length'
          @click="addOrUpdateCate" size="mini" type="primary") 添加分类
        .item(v-if='smartCityConfig.max_merchant_product_category_count <= cateList.length') {{`商户数量已达到上限(${cateList.length} /${smartCityConfig.max_merchant_product_category_count})`}}

      el-table(:data="cateList" stripe height="450")
        el-table-column(prop="name" label="分类名称")
        el-table-column(prop="sort" label="排序" show-overflow-tooltip)
        el-table-column( label="创建时间" )
          template(slot-scope="scope")
            span {{scope.row.created | dateFormat}}
        el-table-column(prop="status" label="操作" )
          template(slot-scope="scope")
            el-button(@click="addOrUpdateCate(scope.row)" type="success" size="mini" plain) 更新
            el-button(@click="delCate(scope.row, scope.$index)" type="danger" size="mini" plain) 删除

  el-dialog.editor-dialog(title="编辑分类" :visible.sync="isShowAdd" width='400px')
    .add-content
      el-form(label-position="right" label-width="80px" :model="form")
        el-form-item(label="名称" required)
          el-input(v-model="form.name" size="small" placeholder='请输入名称')
        el-form-item(label="排序" )
          el-input(v-model="form.sort" size="small" placeholder='请输入非负整数')
    .dialog-footer(slot='footer')
      .options
        el-button(size="mini" @click="isShowAdd = false") 取 消
        el-button(type="primary" size="mini" @click="submitAddOrUpdateCate") 确 定
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      cateList: [],
      isUpdate: false,
      form: {
        merchantId: '',
        name: '',
        sort: '',
        cateId: ''
      },
      isShow: false,
      isShowAdd: false
    }
  },
  computed: {
    ...mapGetters(['smartCityConfig'])
  },
  methods: {
    submitAddOrUpdateCate () {
      if (!this.form.name) {
        this.$vgo.tip('请输入名称!', 'warning')
        return
      }
      if (isNaN(this.form.sort) || this.form.sort < 0 || String(this.form.sort).includes('.')) {
        this.$vgo.tip('排序为非负整数!', 'warning')
        return
      }
      let apiName = this.isUpdate ? 'uapdateSmartCityMerchantProductCategory' : 'addSmartCityMerchantProductCategory'
      this.$vgo.openLoading('.editor-dialog .el-dialog')
      this.$api[apiName](this.form).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.isShowAdd = false
        this.getCate()
      })
    },
    addOrUpdateCate (item) {
      this.isShowAdd = true
      if ('id' in item) {
        this.form.merchantId = item.fk_merchant_id
        this.form.cateId = item.id
        this.form.name = item.name
        this.form.sort = item.sort
        this.isUpdate = true
      } else {
        this.form.cateId = ''
        this.form.name = ''
        this.form.sort = ''
        this.isUpdate = false
      }
    },
    delCate (item, index) {
      this.$vgo.open(() => {
        this.$vgo.openLoading('.cate-list .el-dialog')
        this.$api.delSmartCityMerchantProductCategory(item.id).then(data => {
          this.cateList.splice(index, 1)
          this.$vgo.tip('操作成功!', 'success')
        })
      })
    },
    openModal (item) {
      this.isShow = true
      this.form.merchantId = item.fk_merchant_id || item.id
      this.$nextTick(() => {
        this.getCate()
      })
    },
    getCate () {
      this.$vgo.openLoading('.cate-list .el-dialog')
      this.$api.getSmartCityMerchantProductCategory(this.form.merchantId).then(data => {
        this.cateList = data
        // 添加商品时 更新分类
        this.$vgo.emit('addOrUpadteScityGoodsCate', data)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../~@/assets/style/index.styl';
.merchant-product-cate-modal
  .el-dialog
    overflow-x hidden
    overflow-y auto
    .el-dialog__body
      .dialog-content
        height auto
        margin 0
        padding 0
        .item
          margin-bottom 20px
          line-height 32px
        &>.options
          line-height 40px
          border-bottom 1px solid #fff
          background-color $table-head
          padding 0 10px
  .add-content
    padding-top 10px
    .el-input
      width 300px

</style>
