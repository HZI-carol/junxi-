<template lang='pug'>
.consult-unread
  .type-title 未处理咨询列表
  .content
    .tab-options
      .item
        el-input(v-model="opts.keyword" placeholder='请输入标题关键词' size="small")
      .submit-button
        el-button(@click='search' size="mini" type="primary") 搜索
        el-button(@click="updateItem('')" type="primary" size="mini" plain) 批量通过
        el-button(@click="delItem('')" type="danger" size="mini" plain) 批量删除

    el-table(:data="consultList.list[opts.page]" @selection-change="handleSelectionChange" stripe)
      el-table-column(type="selection" width="55")
      el-table-column(prop="name" label="客户名称")
      el-table-column(prop="phone" label="联系电话" )
      el-table-column(prop="content" label="咨询内容" show-overflow-tooltip)
      el-table-column(prop="status_text" label="状态")
        template(slot-scope='scope')
          span.red {{scope.row.status_text}}
      el-table-column(label="申请时间")
        template(slot-scope="scope")
          .time {{scope.row.created | dateFormat}}
      el-table-column(prop="status" label="操作" width='180')
        template(slot-scope="scope")
          el-button(@click="updateItem(scope.row)" type="primary" size="mini" plain) 处理通过
          el-button(@click="delItem(scope.row)" type="danger" size="mini" plain) 删除

    el-pagination.fl.mb20(:total="consultList.count" v-if='consultList.count' @current-change="handlePageChange"
      :current-page.sync='opts.page' :page-size='opts.pageSize' background layout="prev, pager, next")

</template>

<script>
export default {
  data () {
    return {
      consultList: {list: {}, count: -1},
      opts: {
        page: 1,
        pageSize: 10,
        keyword: '', // 关键字搜索 姓名或电话
        // day_type: '', // 选择天数类型 7天，14天，30天
        startdt: '', // 开始时间
        enddt: '', // 结束时间
        status: 0 // 状态 0 未处理 1 已处理（通过）
      },
      selectedItrm: []
    }
  },
  created () {
    this.getMessageList()
  },
  methods: {
    handlePageChange (val) {
      this.getMessageList()
    },
    handleSelectionChange (val) {
      this.selectedItrm = val
    },
    delItem (item) {
      let list = []
      if (item) {
        list.push(item.id)
      } else {
        this.selectedItrm.map(i => { list.push(i.id) })
      }
      if (!list.length) {
        this.$vgo.tip('请选择留言!', 'fail')
        return
      }
      this.$vgo.open(() => {
        this.$api.delMessage(list.join(',')).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.getMessageList(true)
        })
      })
    },
    updateItem (item) {
      let list = []
      if (item) {
        list.push(item.id)
      } else {
        this.selectedItrm.map(i => { list.push(i.id) })
      }
      if (!list.length) {
        this.$vgo.tip('请选择留言!', 'warning')
        return
      }
      console.log(this.selectedItrm)
      this.$vgo.open(() => {
        this.$api.passMessage(list).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.getMessageList(true)
        })
      })
    },
    search () {
      this.getMessageList(true)
    },
    getMessageList (init = false) {
      if (init) {
        if (this.consultList.list[this.opts.page].length === 1 && this.opts.page > 1) {
          this.opts.page -= 1
        }
        this.consultList.count = -1
        this.consultList.list = {}
      }
      if (this.consultList.count && !this.consultList.list[this.opts.page]) {
        this.$api.getMessageList(this.opts).then(data => {
          this.$set(this.consultList.list, this.opts.page, data.list)
          this.consultList.count = data.count
        })
      }
    }
  },
  components: {
    // BuyerOrdersDetail: () => import('./comps/BuyerOrdersDetail.vue')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.consult-unread
  .content
    padding 0 20px
    .options
      line-height 40px
      background-color $table-head
      border-bottom 1px solid #fff
      .el-button,.el-select
        margin-left 10px
    .el-table
      img
        max-width 40px
    .express
      .el-dialog__body
        padding-top 20px
      .el-input
        width 300px
      .null
        line-height 40px
        color #999
        text-align center
        border 1px solid $table-head

</style>
