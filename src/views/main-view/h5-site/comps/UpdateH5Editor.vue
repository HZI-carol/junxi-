<template lang='pug'>
el-dialog.update-h5-editor(title="更新H5信息" width='560px' :visible.sync="isShow" v-if='Object.keys(infoCopy).length > 0')
  .dialog-content
    .upload
      el-upload.pr(:action="uploadImgUrl"
        :before-upload='mixinBeforeUpload'
        :on-success="uploadSuccess"
        :show-file-list="false"
        :data='uploadData'
        accept="image/*")
        img.logo(v-if="infoCopy.full_logo_url" :src="infoCopy.full_logo_url")
        i.el-icon-plus.pac(:class="{'hover-show': infoCopy.full_logo_url}")
      .tip 上传H5图标(32*32)
    el-form
      el-form-item(label="H5名称:" label-width="120px")
        el-input(placeholder="请输入H5名称" size="small" v-model="infoCopy.name" :maxlength='20')
          i.amount(slot="suffix") {{ infoCopy.name.length + '/20'}}
      el-form-item(label="H5链接:" label-width="120px")
        el-input(v-model="infoCopy.link_url" size="small" clearable placeholder="请输入H5链接")

  .dialog-footer(slot="footer")
    el-button(@click="sbumit" type='primary' size='mini') 确 定
    el-button(@click="isShow = false" size='mini') 取 消
</template>

<script>
import uploadMixin from '@/mixins/upload'
export default {
  mixins: [uploadMixin],
  data () {
    return {
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      uploadData: {
        action: 'user.h5site.mat.image'
      },
      isShow: false,
      infoCopy: {},
      info: {}
    }
  },

  methods: {
    openModal (item) {
      this.isShow = true
      this.info = item
      this.infoCopy = JSON.parse(JSON.stringify(item))
    },
    uploadSuccess (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.infoCopy.full_logo_url = res.data[0].fullurl
        this.infoCopy.logo_url = res.data[0].url
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    sbumit () {
      if (!this.infoCopy.name) {
        this.$vgo.tip('请填写名称!', 'warning')
        return
      }
      if (!this.infoCopy.full_logo_url) {
        this.$vgo.tip('请上传LOGO!', 'warning')
        return
      }
      this.$api.updateH5Site(this.infoCopy).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        this.isShow = false
        for (const key in this.infoCopy) {
          this.info[key] = this.infoCopy[key]
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';

.update-h5-editor
  .dialog-content
    display flex
    padding 20px 30px
    height auto
    box-sizing border-box
    .el-form
      .el-input
        width 250px
    .upload
      display inline-block
      width 120px
      .tip
        text-align center
      .el-upload
        width 120px
        height 120px
        border 1px dashed #999
        border-radius 10px
        overflow hidden
        &:hover
          .el-icon-plus.hover-show
            opacity 0.5
        .logo
          width 100%
          height 100%
        .el-icon-plus
          font-size 60px
          &.hover-show
            opacity 0
</style>
