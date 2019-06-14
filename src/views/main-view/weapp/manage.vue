<template lang='pug'>
  .weapp-manage.clearfix
    .type-title 管理小程序
    .wrapper
      .weapp-item(v-for="(item, index) in weappList" :key='item.miniapp_id')
        .item-wrap.hover-scale
          .top
            .logo.pr
              img.pac(:src="item.logo")
            .info
              .name.omit {{item.navbar_title}}
              .time {{item.addtime.substr(0, 10)}}
          .option
            a.editor(:href="`${minieditorUrl}${item.miniapp_id}`" target="_blank")
              el-button(type="warning" size="mini" plain) 高级编辑
            el-button(type="danger" size="mini" plain @click='delWeapp(item, index)') 删除
            el-button(type="success" size="mini" plain @click='downloadWeapp(item)') 下载安装包
</template>

<script>
export default {
  data () {
    return {
      minieditorUrl: window.$globalconfig.URLS.MINI_EDITOR_PREFIX,
      weappList: []
    }
  },
  created () {
    this.$api.getUserWeapp().then(data => {
      this.weappList = data
    })
  },
  methods: {
    downloadWeapp (item) {
      window.open(`${window.$globalconfig.URLS.API}api/mini/user/miniapps/${item.miniapp_id}/download?token=${this.$auth.getToken()}`)
    },
    delWeapp (item, index) {
      this.$vgo.open(() => {
        this.$vgo.openLoading()
        this.$api.delWeapp(item.miniapp_id).then(res => {
          this.$vgo.tip('操作成功!', 'success')
          this.weappList.splice(index, 1)
        })
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
$W = 280px

.weapp-manage
  .weapp-item
    width $W
    margin-bottom 20px
    padding 0 10px
    display inline-block
    .item-wrap
      border 1px solid #f5f5f5
      .top
        width 100%
        height 100px
        background #e3dfea
        display flex
        align-items center
        .logo
          width 35%
          text-align center
          img
            width 60px
            height 60px
            border-radius 50%
            background-color #fff
            border 2px solid #fff
        .info
          width 65%
          border-left 1px dashed #fff
          line-height 40px
          padding 0 20px
          .name
            color #666
            font-size 16px
            width 100%
          .time
            font-size 14px
            color #999
      .option
        height 40px
        line-height 40px
        text-align center
        .editor
          margin-right 10px

media-query('.weapp-manage .weapp-item', $W)

</style>
