<template lang='pug'>
  .personal-message
    .type-title 我的消息
    .content
      el-table(:data="userMessage.list[curPage]" stripe :style="{ border: '1px solid #f5f5f5' }")
        el-table-column(prop='contents' label="标题")
        el-table-column(prop="date" label="时间" width="220" align='center')
          template(slot-scope="scope")
            span {{scope.row.addtime|dateFormat}}
        el-table-column(label="状态" width='120' align='center')
              template(slot-scope="scope")
                span(:class="scope.row.status ? 'green': 'red'") {{scope.row.status ? '已读': '未读'}}
        el-table-column(prop="status" label="操作" width='120' align='center')
          template(slot-scope="scope")
            .a(@click="markRead(scope.row)" type='text' v-if="!scope.row.status") 标记为已读

      el-pagination.mb20(:total="userMessage.count" v-if='userMessage.count' @current-change="handlePageChange" 
      :current-page.sync='curPage' :page-size='pageSize' background layout="prev, pager, next")
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data () {
    return {
      showMsg: false,
      curPage: 1,
      pageSize: 10,
      content: {},
    }
  },
  created() {
    this.getUserMessage()
  },
  computed: {
    ...mapGetters(['userMessage'])
  },
  methods: {
    markRead(msg) {
      this.$store.dispatch('setUserMessageStatus', msg)
    },
    handlePageChange(val) {
      this.getUserMessage()
    },
    getUserMessage() {
      this.$store.dispatch('getUserMessage', {pageIndex: this.curPage, pageSize: this.pageSize})
    },
  },
  beforeDestroy() {
    this.$store.commit('INIT_PERSONAL_MESSAGE')
  },
}
</script>

<style lang="stylus">
.personal-message
  background-color #fff
  .content
    margin 0 20px
    .el-pagination
      width 300px
</style>
