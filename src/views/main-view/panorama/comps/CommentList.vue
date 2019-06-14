<template lang="pug">
el-dialog.comment-modal(:title="`${works.pano_name} - 管理说一说`" width="900px" :visible.sync="isShow")
  .dialog-content
    el-table(:data="commentList.list[pageIndex]" style="width: 100%" stripe)
      el-table-column(prop="nickname" label="评论人" width='150' show-overflow-tooltip)
        template(slot-scope="scope")
          img(:src='scope.row.avatar')
          span {{scope.row.nickname}}
      el-table-column(prop="contents" label="评论内容" show-overflow-tooltip)
      el-table-column(prop="status_type_text" label="状态" width="100")
        template(slot-scope="scope")
          .red(v-if='!scope.row.status') {{scope.row.status_type_text}}
          .green(v-else) {{scope.row.status_type_text}}
      el-table-column(prop="addtime" label="时间" width="200")
        template(slot-scope="scope")
          span {{scope.row.addtime | dateFormat}}
      el-table-column(label="操作" :width="commentFlag ? '200' : '100'" align='center')
        template(slot-scope="scope")
          el-button(type="success" @click='passComment(scope.row)' v-if='commentFlag && !scope.row.status' size="mini" plain) 审核通过
          el-button(type="danger" @click='delComment(scope.row)' size="mini" plain) 删除
  .dialog-footer(slot="footer")
    el-pagination.fl(:total="commentList.count" v-if='commentList.count' @current-change="handleCommentPageChange" small
    :current-page.sync='pageIndex' :page-size='pageSize' background layout="prev, pager, next")

</template>

<script>
export default {
  data () {
    return {
      commentFlag: window.$globalconfig.MODULES.COMMENT_REVIEW,
      isShow: false,
      pageIndex: 1,
      works: {},
      pageSize: 10,
      commentList: { list: {}, count: 0 }
    }
  },
  methods: {
    openModal (item) {
      this.works = item
      this.pageIndex = 1
      this.commentList.list = {}

      this.isShow = true
      this.getPanoComment()
    },
    passComment (item) {
      this.$vgo.open(() => {
        this.$vgo.openLoading('.comment-modal')
        this.$api.updateUserPanoCommentStatus(item.comment_id).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          item.status = 1
          item.status_type_text = '审核通过'
        })
      })
    },
    delComment (item) {
      this.$vgo.open(() => {
        this.$vgo.openLoading('.comment-modal')
        this.$api.delUserPanoComment(item.comment_id).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          if (this.commentList.list[this.pageIndex].length < 2) {
            this.pageIndex -= 1
          }
          this.commentList.list = {}
          this.getPanoComment()
        })
      })
    },
    getPanoComment () {
      if (!this.commentList.list[this.pageIndex]) {
        this.$nextTick(() => this.$vgo.openLoading('.comment-modal'))
        this.$api.getUserPanoComment(this.pageIndex, this.pageSize, this.works.pano_id).then(data => {
          this.$set(this.commentList.list, this.pageIndex, data.list)
          this.commentList.count = data.count
        })
      }
    },
    handleCommentPageChange (val) {
      this.getPanoComment()
    }
  }
}
</script>

<style lang="stylus">
.comment-modal
  .dialog-content
    height 64vh
    img
      margin-right 10px
      width 30px
      height 30px
</style>
