<template lang='pug'>
  .system-message
    .type-title 系统消息
    .content
      el-table(:data="userNotice.list[curPage]" stripe :style="{ border: '1px solid #f5f5f5' }")
        el-table-column(prop="title" label="标题")
          template(slot-scope="scope")
            .a(@click="$refs.infoModal.openModal(scope.row)") {{ scope.row.title }}
        el-table-column(prop="noticedt" label="日期" width="100")

      el-pagination.mb20(:total="userNotice.count" v-if='userNotice.count' @current-change="handlePageChange"
      :current-page.sync='curPage' :page-size='pageSize' background layout="prev, pager, next")

    Info(ref='infoModal')

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showMsg: false,
      curPage: 1,
      content: {},
      pageSize: 10
    }
  },
  created () {
    this.getUserNotice()
  },
  computed: {
    ...mapGetters(['userNotice'])
  },
  methods: {
    handlePageChange (val) {
      this.getUserNotice()
    },
    getUserNotice () {
      this.$store.dispatch('getUserNotice', { pageIndex: this.curPage, pageSize: this.pageSize })
    }
  },
  beforeDestroy () {
    this.$store.commit('INIT_NOTICE_MESSAGE')
  },
  components: {
    Info: () => import('@/components/Modal/Info')
  }
}
</script>

<style lang="stylus">
@import "~@/assets/style/var.styl";
.system-message
  background-color #fff
  .content
    margin 0 20px
</style>
