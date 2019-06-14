<template lang='pug'>
  .shoot
    .type-title 约拍管理
    .content
      .options
        el-button(size='mini' type='success' @click='setShootMessageStatus(selectedMsg)') 处理通过
      el-table(:data="userShootMessage.list[curPage]"
      @selection-change="selectAll" stripe :style="{ border: '1px solid #f5f5f5' }")
        el-table-column(type="selection" width="55" :selectable='row => !row.state')
        el-table-column(prop="personname" label="姓名" width="100")
        el-table-column(prop="contact" label="联系方式" width="150")
        el-table-column(prop="content" label="约拍内容" show-overflow-tooltip)
        el-table-column(prop="status" label="状态" width="100")
          template(slot-scope="scope")
            .green(v-if="scope.row.state") 已处理
            .red(v-else) 未处理
        el-table-column(label="申请时间" width='180')
          template(slot-scope="scope")
            span {{scope.row.addtime | dateFormat}}
        el-table-column(label="操作" align='center' width='100')
          template(slot-scope="scope")
            el-button(@click="setShootMessageStatus(scope.row)"
            v-if="!scope.row.state" type="success" size="mini" plain) 处理通过

      el-pagination.mb20(:total="userShootMessage.count" v-if='userShootMessage.count' @current-change="handlePageChange"
      :current-page.sync='curPage' :page-size='pageSize' background layout="prev, pager, next")
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showMsg: false,
      curPage: 1,
      pageSize: 10,
      selectedMsg: null
    }
  },
  computed: {
    ...mapGetters(['userShootMessage'])
  },
  created () {
    this.getShootMessage()
  },
  methods: {
    selectAll (val) {
      this.selectedMsg = val
    },
    handlePageChange (val) {
      this.getShootMessage()
    },
    getShootMessage () {
      this.$store.dispatch('getShootMessage', { pageIndex: this.curPage, pageSize: this.pageSize })
    },
    setShootMessageStatus (msg) {
      if (!msg) return
      this.$vgo.open(() => this.$store.dispatch('setShootMessageStatus', msg))
    },
    openMsg () {
      this.showMsg = !this.showMsg
    }
  },
  beforeDestroy () {
    this.$store.commit('INIT_SHOOT_MESSAGE')
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import "~@/assets/style/var.styl";
.shoot
  background-color #fff
  .content
    margin 0 20px
    .options
      line-height 40px
      padding 0 10px
      background-color #e8f1ff
    .el-pagination
      width 300px
</style>
