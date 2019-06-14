<template lang="pug">
el-dialog.pano-integration-ditor(title="添加作品" :visible.sync="isShow" width='900px' v-if='isShow') 
  .dialog-content.pr
    .pano-list
      .pano-item(v-for='(item, index) in getCurList.list[opts.groupPageIndex[opts.groupId]]'
      @click="select(item)" :key='index')
        img(:src='item.full_icon_src')
        .title.omit {{item.pano_name}}
        .select-item(:class='{selected: selectedItem[item.pano_id]}')
          i.iconfont.icon-roundcheck

    router-link.null.pac(v-if='!getCurList.count') 暂无可添加的作品,
      el-button(size="mini" type="primary" plain) 去发布
      
  .dialog-footer(slot='footer')
    el-pagination.fl(:total="getCurList.count" v-if='getCurList.count' @current-change="handlePageChange" 
      :current-page.sync='opts.groupPageIndex[opts.groupId]' :page-size='opts.pageSize' background layout="prev, pager, next")
    el-button(@click='submit' size="mini" type="primary") 确定
    el-button(@click='isShow = false' size="mini") 取消

</template>

<script>

import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isShow: false,
      selectedItem: {},
      opts: {
        groupId: -1,
        groupPageIndex: {},
        pageSize: 10,
      },
    }
  },
  computed: {
    ...mapGetters(['panoIntegrationUnAdd']),
    getCurList() {
      if (this.panoIntegrationUnAdd[this.opts.groupId]) {
        return this.panoIntegrationUnAdd[this.opts.groupId]
      }
      return {}
    },
  },
  methods: {
    openModal(opts) {
      this.opts = JSON.parse(JSON.stringify(opts))
      this.$store.dispatch('getPanoIntegrationUnAdd', this.opts)
      this.isShow = true
    },
    select(item) {
      if (this.selectedItem[item.pano_id]) {
        this.$delete(this.selectedItem, item.pano_id)
      }else {
        this.$set(this.selectedItem, item.pano_id, true)
      }
    },
    handlePageChange() {
      this.$store.dispatch('getPanoIntegrationUnAdd', this.opts)
    },
    submit() {
      let panoIds = Object.keys(this.selectedItem)
      if (!panoIds.length) {
        this.$vgo.tip('未选择任何作品!', 'warning')
        return
      }
      this.$store.dispatch('updatePanoIntegration', {groupId: this.opts.groupId, panoIds}).then(() => {
        this.$parent.opts.groupPageIndex[this.$parent.opts.groupId] = 1
        
        // 重新获取当前作品集分组作品
        this.$store.commit('CLEAR_PANO_INTEGRATION', this.$parent.opts)
        this.$store.dispatch('getPanoIntegration', this.$parent.opts)

        // 清除当前作品集分组未添加的作品列表
        this.opts.groupPageIndex[this.opts.groupId] = 1
        this.$store.commit('CLEAR_PANO_INTEGRATION_UNADD', this.opts)

        this.selectedItem = {}
        this.isShow = false
      })
    },
  },
}
</script>

<style lang="stylus">
.pano-integration-ditor
  .dialog-content
    padding-left 20px
    .pano-list
      padding-top 30px
      .pano-item
        border 1px solid #ddd
        width 160px
        height 160px
        float left
        position relative
        margin-right 10px
        margin-bottom 25px
        cursor pointer
        &:hover
          .select-item
            opacity 1
        .select-item
          position absolute
          top 50%
          left 50%
          transform translate(-50%, -50%)
          color #666
          background-color rgba(250,250,250, 0.7)
          border-radius 50%
          height 40px
          width 40px
          line-height 40px
          opacity 0
          &.selected
            color #099
            opacity 1
          i
            vertical-align -10px
            font-size 40px
            line-height 40px
        img
          width 100%
          height 100%
        .title
          position absolute
          bottom 0
          left 0
          color #fff
          width 100%
          background-image linear-gradient(0deg, rgba(#000, 0.5) 0%, rgba(#000, 0) 100%)
  .upload-img
    margin-left 20px
    display inline-block
</style>
