<template lang='pug'>
  .pano-loading-animation.pr
    .type-title 作品加载动画
    .add
      el-button(type='primary' size='mini' @click='$refs.loadingEditor.openModal()') 添加加载动画
    .wrapper
      .loading-item(v-for="item in loadingList.list[pageIndex]" :key="item.id")
        .item-wrap.hover-scale
          .top(@mouseover='$set(item, "hover", true)' @mouseout='$set(item, "hover", false)')
            .option
              .option-item.el-icon-delete(@click='delItem(item)')
            .product-link.pr(:style='{background: item.background_color}')
              .img-box.pac
                transition(name="el-zoom-in-center" mode='out-in')
                  img.mobile(:src='!item.hover ? item.full_load_img : item.full_pc_load_img' :key='item.hover')
              .info
                .time
                  i.iconfont.el-icon-time
                  span {{item.showtime }} 毫秒

    .null.pac(v-if='!loadingList.count') 暂无数据
    el-pagination(:total="loadingList.count" v-if='loadingList.count' @current-change="handlePageChange"
    :current-page.sync='pageIndex' :page-size='pageSize' background layout="prev, pager, next" size='small')

    LoadingEditor(ref='loadingEditor')

</template>

<script>
export default {
  name: 'panorama-loading',
  data () {
    return {
      pageIndex: 1,
      loadingList: { list: {}, count: 0 },
      pageSize: 27
    }
  },
  created () {
    this.getList()
  },
  methods: {
    delItem (item) {
      this.$vgo.open(() => this.$api.delPanoLoading(item.userpano_load_id).then(res => {
        this.$vgo.tip('操作成功', 'success')
        if (this.loadingList.list[this.pageIndex].length === 1 && this.pageIndex > 1) {
          this.pageIndex -= 1
        }
        this.loadingList.list = {}
        this.getList()
      }))
    },
    handlePageChange (val) {
      this.getList()
    },
    initList () {
      this.pageIndex = 1
      this.loadingList.list = {}
      this.getList()
    },
    getList () {
      if (!this.loadingList.list[this.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getLoadingList(this.pageIndex, this.pageSize).then(data => {
          this.loadingList.count = data.count
          this.$set(this.loadingList.list, this.pageIndex, data.list)
        })
      }
    }
  },
  components: {
    LoadingEditor: () => import('./comps/LoadingEditor.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
$W = 180px
.pano-loading-animation
  .add
    position absolute
    top 10px
    right 10px
  .loading-item
    display inline-block
    padding 0 10px
    width $W
    margin-bottom 20px
    .item-wrap
      border-radius 5px
      overflow hidden
      border 1px solid #f5f5f5
      .top
        width 100%
        height 160px
        position relative
        &:hover
          .option
            opacity 1
        .option
          position absolute
          left 10px
          top 10px
          border-radius 3px
          background-color rgba(0,0,0,0.6)
          z-index 888
          left auto
          right 10px
          opacity 0
          transition all 0.3s
          .option-item
            display inline-block
            vertical-align top
            color $danger
            width 30px
            height 32px
            line-height 32px
            text-align center
            cursor pointer
        .product-link
          display inline-block
          width 100%
          height 160px
          .img-box
            width 80px
            height 80px
            text-align center
            line-height 80px
            img
              max-width 100%
              max-height 100%
          .info
            position absolute
            width 100%
            height 30px
            line-height 30px
            bottom 0
            padding-left 10px
            color #fff
            font-size 12px
            .time
              text-shadow 0 0 10px #000
              display inline-block
              i
                margin-right 5px
                vertical-align -1px
  .el-pagination
    margin-left 20px
    margin-bottom 20px

media-query('.pano-loading-animation .loading-item', $W)

</style>
