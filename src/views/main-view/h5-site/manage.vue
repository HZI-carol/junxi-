<template lang='pug'>
  .H5-manage
    .type-title 管理H5
    .wrapper
      .H5-item(v-for="(item, index) in H5List" :key='item.id')
        .item-wrap.hover-scale
          .top.pr
            .logo
              img(:src="item.full_logo_url")
            .info
              .name.omit {{item.name}}
              .time {{item.created.substr(0, 10)}}
          .option
            a.editor(:href="viewUrl + item.id" target="_blank")
              el-button(type="primary" size="mini" plain) 预览
            el-button(type="primary" size="mini" plain @click='$refs.updateH5Editor.openModal(item)') 修改
            a.editor(:href="editorUrl + item.id" target="_blank")
              el-button(type="warning" size="mini" plain) 编辑
            el-button(type="danger" size="mini" plain @click='delH5(item, index)') 删除

      router-link.null.pac(v-if='!H5List.length' :to="{name:'h5-create'}") 暂无数据,
        el-button(size="mini" type="primary" plain) 去创建

    UpdateH5Editor(ref='updateH5Editor')
</template>

<script>
export default {
  data () {
    return {
      editorUrl: window.$globalconfig.URLS.H5_EDITOR_PREFIX,
      viewUrl: window.$globalconfig.URLS.H5_VIEW_PREFIX,
      H5List: []
    }
  },
  created () {
    this.$api.getH5SiteList().then(data => {
      this.H5List = data
    })
  },
  methods: {
    delH5 (item, index) {
      this.$vgo.open(() => {
        this.$vgo.openLoading()
        this.$api.deleteH5Site(item.id).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.H5List.splice(index, 1)
        })
      })
    }
  },
  components: {
    UpdateH5Editor: () => import('./comps/UpdateH5Editor.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
$W = 290px

.H5-manage
  .H5-item
    width $W
    margin-bottom 20px
    padding 0 10px
    display inline-block
    .item-wrap
      border 1px solid #f5f5f5
      .top
        width 100%
        height 100px
        background #f1f1f1
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
        height 50px
        line-height 50px
        text-align center
        &>*
          margin 0 5px

media-query('.H5-manage .H5-item', $W)

</style>
