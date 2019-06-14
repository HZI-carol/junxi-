<template lang="pug">
el-dialog.three-d-model-selector(title="选择360环物" :visible.sync="isShow" width='900px') 
  .dialog-content
    .three-d-model-list
      .three-d-model-item(v-for='(item, index) in threeDModelList.list[opts.pageIndex]'
      @click="selectedItem = item" :key='index')
        img(:src='item.full_imgurl')
        .title.omit {{item.title}}
        .select-item(:class='{selected: item.modelid == selectedItem.modelid}')
          i.iconfont.icon-roundcheck

  .dialog-footer(slot='footer')
    el-pagination.fl(:total="threeDModelList.count" v-if='threeDModelList.count' @current-change="handlePageChange" 
      :current-page.sync='opts.pageIndex' :page-size='opts.pageSize' background layout="prev, pager, next")
    el-button(@click='submit' size="mini" type="primary") 确定
    el-button(@click='isShow = false' size="mini" type="warning") 取消

</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isShow: false,
      selectedItem: {},
      opts: {
        pageIndex: 1,
        pageSize: 15,
      },
    }
  },
  computed: {
    ...mapGetters(['threeDModelList'])
  },
  methods: {
    openModal(type) {
      this.type = type
      this.$store.dispatch('getThreeDModelList', this.opts)
      this.isShow = true
    },
    handlePageChange() {
      this.$store.dispatch('getThreeDModelList', this.opts)
    },
    submit() {
      if (this.selectedItem.modelid) {
        this.$vgo.emit(this.type, this.selectedItem)
        this.isShow = false
      }else {
        this.$vgo.tip('未选择任何素材!', 'warning')
      }
    },
  },
}
</script>

<style lang="stylus">
.three-d-model-selector
  .dialog-content
    height 500px
    .three-d-model-list
      padding-top 20px
      padding-left 30px
      .three-d-model-item
        border 1px solid #eee
        width 150px
        height 145px
        border-radius 10px
        overflow hidden
        margin-right 20px
        margin-bottom 10px
        display inline-block
        position relative
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
