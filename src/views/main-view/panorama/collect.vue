<template lang='pug'>
  .pano-collect.pr
    .type-title 全景漫游收藏
    .wrapper
      .collect-item(v-for="item in collectList.list[curPage]" :key="item.id")
        .item-wrap.hover-scale
          .top
            .option
              .option-item.el-icon-delete(@click='delItem(item)')
              .option-item.iconfont.qrIcon.icon-erweima(@mouseenter='item.showQrcopde = !item.showQrcopde' @mouseleave='item.showQrcopde = !item.showQrcopde')
            a.product-link.pr(:href="item.panoview_url" target="_blank")
              img.img(:src="item.icon_src")
              transition(:duration="300", enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
                img.qrcode.pac(:src='qrCodeUrl + item.pano_id' v-show="item.showQrcopde")
              .info
                .views
                  i.iconfont.icon-browse
                  span {{item.seecount| amountFormat}}
                .praise
                  i.iconfont.icon-like1
                  span {{item.praisecount | amountFormat}}
          .bottom
            .title.omit {{item.pano_name}}
            .author
              img.avatar(:src="item.avatar")
              span.name {{item.nickname}}
    .null.pac(v-if='!collectList.count') 暂无收藏
    el-pagination(:total="collectList.count" v-if='collectList.count' @current-change="handlePageChange"
    :current-page.sync='curPage' :page-size='pageSize' background layout="prev, pager, next" size='small')
</template>

<script>
export default {
  data () {
    return {
      qrCodeUrl: window.$globalconfig.URLS.QRCODE + '?newpano=true&id=',
      curPage: 1,
      collectList: {list: {}, count: 0},
      pageSize: 20,
      modifiy: ''
    }
  },
  created () {
    this.getCollectList()
  },
  methods: {
    delItem (item) {
      this.$vgo.open(() => this.$api.delPanoCollection(item.id).then(data => {
        this.$vgo.tip('操作成功', 'success')
        // 删除后之后页面的数据对应不上 清空数据重新获取
        for (const key in this.collectList.list) {
          if (key >= this.curPage) {
            delete this.collectList.list[key]
          }
        }
        this.getCollectList()
      }))
    },
    handlePageChange (val) {
      this.getCollectList()
    },
    getCollectList () {
      if (!this.collectList.list[this.curPage]) {
        this.$vgo.openLoading()
        this.$api.getUserPanoCollection(this.curPage, this.pageSize).then(data => {
          if (data) {
            this.collectList.count = data.count
            data.list.map(item => { item.showQrcopde = false })
            this.$set(this.collectList.list, this.curPage, data.list)
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
$W = 320px
.pano-collect
  .collect-item
    display inline-block
    padding 0 10px
    width $W
    margin-bottom 20px
    .item-wrap
      border-radius 5px
      overflow hidden
      border 1px solid #f5f5f5
      .top
        topH = 175px
        width 100%
        height topH
        position relative
        .option
          position absolute
          left 10px
          top 10px
          border-radius 3px
          background-color rgba(0,0,0,0.6)
          z-index 888
          left auto
          right 10px
          .option-item
            display inline-block
            vertical-align top
            color $danger
            width 30px
            height 32px
            line-height 32px
            text-align center
            cursor pointer
          .qrIcon
            color #ffffff
            border-left 1px solid #999
        .product-link
          display inline-block
          width 100%
          height topH
          .img
            width 100%
            height topH
          .qrcode
            width topH
            height topH
            z-index 999
          .info
            position absolute
            width 100%
            height 30px
            line-height 30px
            bottom 0
            padding-left 10px
            color #fff
            font-size 12px
            background linear-gradient(transparent,rgba(0,0,0,.7))
            .views
              display inline-block
              i
                vertical-align -1px
            .praise
              margin-left 10px
              display inline-block
      .bottom
        padding 0 5px
        display flex
        .title
          flex 1
          line-height 50px
          font-size 18px
          font-weight bold
          color #666
        .author
          flex 0 -1 100px
          line-height 50px
          img
            margin-right 10px
            width 30px
            height 30px
            border-radius 50%
  .el-pagination
    margin-left 20px
    margin-bottom 20px

media-query('.pano-collect .collect-item', $W)

</style>
