<template lang="pug">
.share-modal
  el-dialog(title="作品分享" :visible.sync="isShow")
    .content-wrapper
      .QR-code
        img(:src="works.qrcodeUrl")
      .right
        .product-link.item
          label 作品地址
          el-input(size="small" :value="works.url")
            el-button(slot="append" icon="el-icon-document" @click='copyCode(works.url)')
        .iframe-code.item
          label 嵌入到网站
          el-input(size="small" :value='iframeCode')
            el-button(slot="append" icon="el-icon-document" @click='copyCode(iframeCode)')
        .tip.item
          p.red 如嵌入后显示异常，请在html页面的head里加入以下代码：
        .iframe-code.item
          label 代码
          el-input(size="small" :value='code')
            el-button(slot="append" icon="el-icon-document" @click='copyCode(code)')

</template>

<script>
import util from '@/plugins/util'

export default {
  data () {
    return {
      isShow: false,
      qrcodeUrl: window.$globalconfig.URLS.QRCODE,
      threeDModelUrl: window.$globalconfig.URLS.MODEL3D_VIEW_PREFIX,
      panoVideoUrl: window.$globalconfig.URLS.VIDEO_VIEW_PREFIX,
      works: {
        url: '',
        qrcodeUrl: ''
      },
      iframeCode: '',
      code: '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">'
    }
  },
  methods: {
    openModal (item) {
      if (item.pano_id) {
        this.works.url = item.panoview_url
        this.works.qrcodeUrl = this.qrcodeUrl + '?newpano=true&id=' + item.pano_id
      }
      if (item.modelid) {
        this.works.url = this.threeDModelUrl + item.modelid
        this.works.qrcodeUrl = this.qrcodeUrl + '?type=model&id=' + item.modelid
      }
      if (item.video_id) {
        this.works.url = this.panoVideoUrl + item.video_id
        this.works.qrcodeUrl = this.qrcodeUrl + '?type=newvideo&id=' + item.video_id
      }
      this.iframeCode = `<iframe src="${this.works.url}" frameborder ="no" border="0" style="width: 100%;height: 600px;"></iframe>`
      this.isShow = true
    },
    copyCode (val) {
      util.copyText(val)
    }
  }

}
</script>

<style lang="stylus">
.share-modal
  .el-dialog
    overflow-x hidden
    .el-dialog__header
      border-bottom 1px solid #f5f5ff
    .el-dialog__body
      padding 20px
      .content-wrapper
        display flex
        .QR-code
          text-align center
        .right
          flex 1
          margin 0 10px
          display flex
          flex-direction column
          justify-content center
          .item
            margin 15px 0
            label
              width 90px
              display inline-block
            .el-input
              width calc(100% - 90px)
</style>
