<template lang="pug">
.loading-editor-modal
  el-dialog(title="添加作品加载动画" :visible.sync="isShow" width='700px')
    .left
      .upload-cover
        el-upload.upload-wrap(:action="uploadImgUrl"
        :before-upload='mixinBeforeUpload'
        :on-success="uploadMobileSuccess"
        :show-file-list="false"
        :data='uploadData'
        accept="image/*")
          img.logo(v-if="opts.full_load_img" :src="opts.full_load_img")
          i.el-icon-plus.pac(:class="{'hover-show': opts.full_load_img}")
        .tip 手机图片
      .upload-cover
        el-upload.upload-wrap(:action="uploadImgUrl"
        :before-upload='mixinBeforeUpload'
        :on-success="uploadPCSuccess"
        :show-file-list="false"
        :data='uploadData'
        accept="image/*")
          img.logo(v-if="opts.full_pc_load_img" :src="opts.full_pc_load_img")
          i.el-icon-plus.pac(:class="{'hover-show': opts.full_pc_load_img}")
        .tip PC图片

    el-form.right(label-width="100px")
      el-form-item(label="展示时间")
        el-input(size='small' v-model='opts.showtime')
          el-button(slot="append") 毫秒
      el-form-item(label="背景颜色")
        el-color-picker(v-model="opts.background_color")
      el-form-item(label="上传提示")
        span.red 手机满屏尺寸分辨率为：750*1334像素上传的图片为了打开速度尽量不要超过500kb，不能大于2000*2000像素
    .dialog-footer(slot='footer')
      el-button(type="primary" @click="submit" size="mini") 保 存
      el-button(size="mini" @click="isShow = false") 取 消

</template>

<script>
import uploadMixin from '@/mixins/upload'

export default {
  mixins: [uploadMixin],
  data () {
    return {
      uploadData: {
        action: 'user.loading.pano'
      },
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      isShow: false,
      opts: {
        load_img: '',
        full_load_img: '',
        pc_load_img: '',
        full_pc_load_img: '',
        background_color: '#409EFF',
        showtime: 3000
      }
    }
  },
  mounted () {

  },
  methods: {
    uploadMobileSuccess (res, file, fileList) {
      this.handleSuccess('load_img', res)
    },
    uploadPCSuccess (res, file, fileList) {
      this.handleSuccess('pc_load_img', res)
    },
    handleSuccess (attr, res) {
      if (res.code === 100) {
        let data = res.data[0]
        this.opts[attr] = data.url
        this.opts['full_' + attr] = data.fullurl
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    openModal () {
      this.isShow = true
    },
    submit () {
      if (!this.opts.load_img) {
        this.$vgo.tip('请上传手机图片!', 'warning')
        return
      }
      if (!this.opts.pc_load_img) {
        this.$vgo.tip('请上传手机图片!', 'warning')
        return
      }
      if (!this.opts.background_color) {
        this.$vgo.tip('请选择颜色!', 'warning')
        return
      }
      if (!this.opts.showtime || this.opts.showtime < 0) {
        this.$vgo.tip('请输入时间!', 'warning')
        return
      }

      this.$vgo.openLoading('.el-dialog')
      this.$api.addPanoLoading(this.opts).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.isShow = false
        this.opts.load_img = ''
        this.opts.full_load_img = ''
        this.opts.pc_load_img = ''
        this.opts.full_pc_load_img = ''
        this.$parent.initList()
      })
    }
  }
}
</script>

<style lang="stylus">
.loading-editor-modal
  .el-dialog
    .el-dialog__body
      display flex
      padding 20px
      padding-bottom 0
    .left
      padding-left 10px
      display inline-block
      display flex
      flex-direction column
      .upload-cover
        display inline-block
        width 120px
        .tip
          width 100%
          font-size 12px
          line-height 40px
          text-align center
        .upload-wrap
          .el-upload
            width 120px
            height 120px
            border 1px dashed #999
            border-radius 10px
            position relative
            overflow hidden
            &:hover
              .el-icon-plus.hover-show
                opacity 0.5
            .logo
              width 100%
              height 100%
              vertical-align top
            .el-icon-plus
              font-size 60px
              &.hover-show
                opacity 0
    .right
      display inline-block

</style>
