<template lang='pug'>
  .weapp-create
    .type-title 1 完善小程序信息
    .upload
      el-upload.pr(:action="uploadImgUrl"
        :before-upload='mixinBeforeUpload'
        :on-success="uploadSuccess"
        :show-file-list="false"
        :data='uploadData'
        accept="image/*")
        img.logo(v-if="fullLogoUrl" :src="fullLogoUrl")
        i.el-icon-plus.pac(:class="{'hover-show': fullLogoUrl}")
      .tip.mt10 上传小程序图标(32*32)

    .form
      .name.form-item
        .label 小程序名称：
        el-input(placeholder="请输入小程序名称" size="small" v-model="name" :maxlength='20')
          i.amount(slot="suffix") {{ name.length + '/20'}}
      .desc.form-item.mt30
        .label 小程序简介：
        el-input(placeholder="请输入小程序简介" type="textarea" v-model="desc" clearable)

    .type
      .type-title 2 选择小程序模板
      .type-item.pr(v-for='item in template' @click='templateId = item.miniapp_id'
        :class='{active: templateId == item.miniapp_id}' :key='item.miniapp_id')
        img(:src="apiUrl + item.logo")
        i.el-icon-success.pac
        .title {{item.navbar_title}}

    .create
      el-button(type="primary" size="mini" @click="sublimt" :disabled="!checked") 创建小程序
      el-checkbox(v-model="checked")
      span.accept 我已阅读并同意
        span.agreement(@click="$vgo.emit('showDialogModal', {name: 'agreement', data: 1})") {{`《${platformName}用户协议》`}}
</template>

<script>
import uploadMixin from '@/mixins/upload'
export default {
  name: 'weapp-create',
  mixins: [uploadMixin],
  data () {
    return {
      platformName: window.$globalconfig.PLATFORM_NAME,
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      apiUrl: window.$globalconfig.URLS.API,
      fullLogoUrl: '',
      logoUrl: '',
      checked: true,
      uploadData: {
        action: 'image.user.miniapp.icon'
      },
      name: '',
      desc: '',
      templateId: 1,
      template: []
    }
  },
  created () {
    this.$api.getWeappTemplate().then(res => {
      this.template = res.data
    })
  },
  methods: {
    uploadSuccess (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.fullLogoUrl = res.data[0].fullurl
        this.logoUrl = res.data[0].url
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    sublimt () {
      if (this.name.length < 2) {
        this.$vgo.tip('名称不少于2个字!', 'warning')
        return
      }
      if (this.fullLogoUrl === '') {
        this.$vgo.tip('请上传LOGO!', 'warning')
        return
      }
      this.$api.createWeapp(this.name, this.desc, this.logoUrl, this.templateId).then(data => {
        this.$vgo.tip('创建成功!', 'success')
        this.name = ''
        this.desc = ''
        this.fullLogoUrl = ''
        window.open(window.$globalconfig.URLS.MINI_EDITOR_PREFIX + data)
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.weapp-create
  .type
    border-top 10px solid #f5f5f5
    .type-item
      cursor pointer
      display inline-block
      width 120px
      text-align center
      margin 0 0 20px 40px
      &:hover,&.active
        i
          display inline-block
        img
          box-shadow: 2px 2px 5px $success;
      img
        width 100%
        border 1px solid rgba(0, 0, 0, 0.1)
      i
        font-size 20px
        color $success
        text-shadow: 2px 2px 5px #fff;
        display none
      .title
        line-height 30px
  .upload
    display inline-block
    width 150px
    margin 0 0 30px 30px
    .tip
      text-align center
    .el-upload
      width 150px
      height 150px
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
  .form
    margin 10px 0 0 60px
    display inline-block
    min-width 500px
    vertical-align top
    .form-item
      .el-input,.el-textarea,.el-select
        width 300px
      .label
        vertical-align top
        line-height 30px
        display inline-block
    .desc
      min-height 75px
      .el-textarea
        margin-bottom 20px
        textarea
          height 75px
  .create
    margin 30px 0 30px 60px
    .el-button
      width 200px
    .el-checkbox
      margin-left 60px
      display inline-block
    .accept
      display inline-block
      margin-left 10px
      .agreement
        cursor pointer
        color $blue
</style>
