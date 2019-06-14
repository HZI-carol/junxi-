<template lang="pug">
.goods-editor-modal
  el-dialog(title="更新商品" :visible.sync="isShow" width='1000px' center :close-on-click-modal='false')
    .content
      .scroll-wrap
        .item
          .item-label 商品名称
          el-input(v-model="goods.name" size='small' placeholder='请输入商品名称' clearable)
        .item
          .item-label 商品分类
          el-select(v-model="goods.fk_category_id" size='small' placeholder="请选择" )
            el-option(v-for='item in cateList' :key='item.id' :label='item.name' :value='item.id')

          el-button(@click="$refs.merchantProductCate.openModal(goods)" type="primary" size="mini" plain) 编辑分类

        .item
          .item-label 商品进价(元)
          el-input(v-model="goods.offerprice" size='small' placeholder='请输入商品进货价格' clearable)
        .item
          .item-label 商品售价(元)
          el-input(v-model="goods.saleprice" size='small' placeholder='请输入商品销售价格' clearable)
        .item
          .item-label 商品库存量
          el-input(v-model="goods.stock" size='small' placeholder='请输入商品库存量' clearable)
        .item
          .item-label 是否上架
          el-select(v-model="goods.isputaway" size='small' placeholder="请选择" )
            el-option(key='1' label='是' :value='1')
            el-option(key='0' label='否' :value='0')
        .item
          .item-label 商品类型
          el-select(v-model="goods.type" size='small' placeholder="请选择")
            el-option(key='0' label='实物' :value='1')
            el-option(key='1' label='虚拟' :value='2')
        .item
          .item-label 商品封面图
          el-upload.upload-img(
            :action="uploadImgUrl"
            :data='uploadCoverData'
            accept="image/*"
            :show-file-list="false"
            :before-upload='beforeUpload'
            :on-success="uploadSuccess")
            el-button(size="mini" type="primary" ) 点击上传
          span.tip.red (商品最少有1张图片，不超过5张, 图片分辨率<=600*450, 大小<=1M)
        .item(v-show='goods.image_url_list.length')
          .item-label 已上传封面图
          .img-list
            .img-item.pr(v-for='(item, index) in goods.image_url_list' :key='index')
              .del.pa.el-icon-close(@click='delImg(item, index)')
              img(:src='item.full_thumb_image_url')
        .item
          .item-label 商品描述
          QuillEditor.quill-editor(v-model="goods.description" :action='decAction')
    .dialog-footer(slot="footer")
      el-button(size="small" type="primary"  @click='handleSave') 保 存
      el-button(size="small" @click='isShow = false') 取 消

  MerchantProductCate(ref='merchantProductCate')

</template>

<script>

export default {
  data () {
    return {
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      uploadCoverData: {
        action: 'user.scity.product'
      },
      decAction: 'user.common.editor.image',
      cateList: [],
      isShow: false,
      goods: {
        saleprice: '',
        offerprice: '',
        description: '',
        fk_merchant_id: '',
        // catepory_name: '',
        fk_category_id: '',
        image_url_list: [],
        isputaway: 1,
        name: '',
        id: '',
        stock: '',
        type: 1 // 1-实物 2-虚拟
      }
    }
  },
  mounted () {
    this.$vgo.on('addOrUpadteScityGoodsCate', data => {
      this.cateList = data
    })
  },
  methods: {
    getGoodsCate () {
      this.$vgo.openLoading('.el-dialog')
      this.$api.getSmartCityMerchantProductCategory(this.goods.fk_merchant_id).then(res => {
        this.cateList = res.data
      })
    },
    openModal (item) {
      this.isShow = true

      if (!item.hasOwnProperty('id')) {
        this.goods = {
          saleprice: '',
          offerprice: '',
          description: '',
          full_icon_url: '',
          fk_merchant_id: '',
          // catepory_name: '',
          fk_category_id: '',
          image_url_list: [],
          isputaway: 1,
          name: '',
          id: '',
          stock: '',
          type: 1 // 1-实物 2-虚拟
        }
      } else {
        this.$api.getSmartCityProductDetail(item.id).then(data => {
          for (const key in data) {
            if (key === 'isputaway') {
              this.goods[key] = data[key] ? 1 : 0
            } else {
              this.goods[key] = data[key]
            }
          }
        })
      }

      this.goods.fk_merchant_id = item.fk_merchant_id
      this.getGoodsCate()
    },
    delImg (item, index) {
      this.$vgo.open(() => {
        this.$vgo.tip('操作成功!', 'success')
        this.goods.image_url_list.splice(index, 1)
      })
    },
    beforeUpload (file) {
      if (this.goods.image_url_list && this.goods.image_url_list.length >= 5) {
        this.$vgo.tip('商品图片不超过5张! 请删除后上传!', 'warning')
        return false
      }
      this.$vgo.openLoading()
    },
    uploadSuccess (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        res.data.map(item => {
          item.full_image_url = item.fullurl
          item.full_thumb_image_url = item.fullthumburl
          item.image_url = item.url
          item.thumb_image_url = item.thumburl
        })
        this.goods.image_url_list = this.goods.image_url_list.concat(res.data)
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    handleSave () {
      if (!this.goods.name) {
        this.$vgo.tip('请输入商品名称!', 'warning')
        return
      }
      if (!this.goods.description) {
        this.$vgo.tip('请输入商品描述!', 'warning')
        return
      }
      if (isNaN(this.goods.saleprice) || this.goods.saleprice <= 0) {
        this.goods.saleprice = ''
        this.$vgo.tip('请输入商品价格!', 'warning')
        return
      }
      if (isNaN(this.goods.offerprice) || this.goods.offerprice <= 0) {
        this.goods.offerprice = ''
        this.$vgo.tip('请输入商品进货价格!', 'warning')
        return
      }
      if (isNaN(this.goods.offerprice) || this.goods.stock <= 0) {
        this.goods.stock = ''
        this.$vgo.tip('请输入商品库存!', 'warning')
        return
      }
      if (!this.goods.image_url_list.length) {
        this.$vgo.tip('请输上传商品封面!', 'warning')
        return
      }

      this.goods.saleprice = Number(this.goods.saleprice).toFixed(2)
      this.goods.offerprice = Number(this.goods.offerprice).toFixed(2)

      let method = this.goods.id ? 'updateSmartCityMerchantProduct' : 'addSmartCityMerchantProduct'
      this.$vgo.openLoading('.el-dialog')
      this.$api[method](this.goods).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        this.isShow = false
        this.$parent.initGoodsList()
      })
    }
  },
  components: {
    QuillEditor: () => import('@/components/Quill'),
    MerchantProductCate: () => import('./MerchantProductCate')
  }
}
</script>

<style lang="stylus">
#ueditor
  width 800px
  display inline-block
  height 400px
.goods-editor-modal
  .el-dialog
    overflow-x hidden
    overflow-y auto
    .el-dialog__header
      width 100%

    .el-dialog__body
      .content
        height 600px
        overflow-y auto
        .scroll-wrap
          margin 20px 0
          .item
            margin-bottom 20px
            &>*
              margin-right 10px
            .item-label
              display inline-block
              margin 0 10px
              text-align right
              width 100px
              font-weight 700
              line-height 32px
              vertical-align top
            .link.el-input
              width 400px
            .el-input
              width 200px
            .upload-img
              display inline-block
              .el-upload-list
                display flex
                li
                  width 100px
                  .el-upload-list__item-name
                    width 0
                    margin 0
                    display none
              .tip
                line-height 32px
                vertical-align top
                margin-left 20px

            .quill-editor
              display inline-block
              width calc(100% - 150px)
              strong
                font-weight bold
              i,em
                font-style italic

            .img-list
              display inline-block
              .img-item
                width 100px
                height 100px
                margin-right 10px
                display inline-block
                border 1px solid #ddd
                &:hover
                  .del
                    opacity 1
                .del
                  opacity 0
                  transition all 0.3s
                  right 0
                  top 0
                  cursor pointer
                  width 20px
                  height 20px
                  line-height 20px
                  text-align center
                  color #fff
                  background-color #ff7171
                img
                  width 100%
                  height 100%
  .el-dialog__footer
    width 100%
    bottom 0
</style>
