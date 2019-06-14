<template lang='pug'>
  .vip-package
    .type-title 套餐列表
    .wrapper
      el-table(:data="packageList.list" stripe :style="{ border: '1px solid #f5f5f5' }")
        el-table-column(prop="name" label="套餐名称" width='100')
        el-table-column(prop="price" label="套餐价格(元)" width="80" align='center')
        el-table-column(prop="num" label="周期" width="80" align='center')
          template(slot-scope='scope')
            span {{scope.row.num}} {{unit[scope.row.unit-1]}}
        el-table-column(label="权限")
          el-table-column(prop="funs[0]" label="编辑器" )
          el-table-column(prop="funs[1]" label="基础插件" )
          el-table-column(prop="funs[2]" label="广告" width="80" )
          el-table-column(prop="funs[3]" label="行业插件")
        el-table-column(label="操作" width="100" align='center')
          template(slot-scope="scope")
            el-button(@click="buyVip(0,scope.row)" v-if="scope.row.canbuy && !scope.row.canrenew" type="primary" size="mini" plain) 开通
            el-button(@click="buyVip(1,scope.row)" v-if="scope.row.canrenew" type="success" size="mini" plain) 续费

</template>

<script>
export default {
  name: 'vip-package',
  data () {
    return {
      isShowBuy: false,
      unit: ['年', '月', '天'],
      packageList: {},
      curPage: 1,
      pageSize: 15,
      opts: {
        ordertype: 1,
        paytype: 3,
        productid: ''
      }
    }
  },
  created () {
    this.getPackage()
  },
  methods: {
    getPackage () {
      this.$api.getUserPackage().then(data => {
        data.list.map(items => {
          let handleList = []
          let flagArr = []
          items.funs.map((item, i) => {
            if (flagArr.indexOf(item.parentid) === -1) {
              flagArr.push(item.parentid)
              handleList.push([item.funname])
            } else {
              handleList[flagArr.indexOf(item.parentid)] += '，' + item.funname
            }
          })
          items.funs = handleList
        })

        this.packageList = data
      })
    },
    buyVip (type, item) {
      if (this.$store.getters.userInfo.bank < item.price) {
        this.$vgo.tip('余额不足,请充值!', 'warning')
        return
      }
      this.$vgo.open(() => {
        this.opts.productid = item.package_id
        this.$vgo.openLoading()
        this.$api.createPayOrder(this.opts).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.$store.dispatch('getUserInfo')
          this.getPackage()
        })
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.vip-package
  .content
    padding 0 10px
    .el-table
      img
        max-width 40px
</style>
