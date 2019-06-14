<template lang='pug'>
  .smart-city-my-appraise
    .type-title 我的评价
    .content
      el-table(:data="appraiseList.list[pageIndex]" stripe)
        el-table-column(prop="tel" label="用户信息" width="160" show-overflow-tooltip)
          template(slot-scope="scope")
            img(:src='scope.row.full_avatar')
            span {{scope.row.nickname}}
        el-table-column(prop="name" label="商户名称" show-overflow-tooltip width='200')
        el-table-column(prop="typename" label="评评价等级" width="150" )
          template(slot-scope="scope")
            span.rate(v-for='i in 5' :key='i') {{i <= scope.row.rate ? '★' : '☆'}}
        el-table-column(prop="content" label="评价内容")
        el-table-column(prop="date" label="创建时间" width="160")
          template(slot-scope="scope")
            span {{scope.row.created | dateFormat}}

      el-pagination.fl(:total="appraiseList.count" v-if='appraiseList.count' @current-change="handlePageChange" :current-page.sync='pageIndex'
        :page-size='pageSize' background layout="prev, pager, next")
</template>

<script>
export default {
  data () {
    return {
      appraiseList: { list: {}, count: 0 },
      pageIndex: 1,
      pageSize: 10
    }
  },
  created () {
    this.getAppraiseList()
  },
  methods: {
    getAppraiseList () {
      if (!this.appraiseList.list[this.pageIndex]) {
        this.$vgo.openLoading()
        this.$api.getSmartCityMyAppraiseList(this.pageIndex, this.pageSize).then(data => {
          this.$set(this.appraiseList.list, this.pageIndex, data.list)
          this.appraiseList.count = data.count
        })
      }
    },
    handlePageChange () {
      this.getAppraiseList()
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.smart-city-my-appraise
  .content
    padding 0 20px 20px
    .el-table
      img
        width 40px
        height 40px
      .rate
        font-size 22px
        color #f80

</style>
