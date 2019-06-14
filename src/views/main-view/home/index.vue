<template lang='pug'>
  .home
    .overview-info
      .type-title 个人信息
      .top
        .user-info
          .item
            .left
              i.iconfont.icondaifukuan
            .right
              .top
                .title 余额:
                  span.text {{userInfo.bank}}元
              .center
                router-link(:to="{name:'account-recharge'}")
                  el-button(size='mini' type='text') 充值
                a
                  el-button(size='mini' type='text' @click='withdraw') 提现

          .item
            .left
              i.iconfont.iconshuju
            .right
              .top
                .title 作品:
                  span.text {{userInfo.panonum}}个/{{userInfo.limit_panocount == -1 ? '无限': userInfo.limit_panocount + '个'}}
              .bottom
                .title 空间:
                  span.text {{(userInfo.now_space/1024).toFixed(2)}}G/{{userInfo.limit_panospace == -1 ? '无限': userInfo.limit_panospace/1024 + 'G' }}
          .item
            .left
              i.iconfont.iconvip1
            .right
              .title 套餐:
                span.text {{userInfo.packagename}}
              p.expires 过期时间: {{userInfo.overtdt | dateFormat('date')}}
              .options
                router-link(:to="{name:'vip-package'}")
                  el-button(size='mini' type='success' plain) 购买 / 升级

          .item(v-if='serverQQ || serverTel')
              .left
                i.iconfont.iconlianxikefu
              .right
                .title(v-if='serverQQ') 客服QQ:
                  span.text {{serverQQ}}
                .title(v-if='serverTel') 客服电话:
                  span.text {{serverTel}}
                .options(v-if='serverQQ')
                  a(:href='`http://wpa.qq.com/msgrd?v=3&uin=${serverQQ}&site=qq&menu=yes`' target='blank')
                    el-button(size='mini' type='success' plain) 联系客服QQ
          //- 已认证显示  rz_status 未填写 = 1,待审核 = 2,审核不通过 = 3,审核通过 = 4
          //- template(v-if="userInfo.rz_status == 4")

          //- .item
          //-   .left
          //-     i.iconfont.iconinfo-copy
          //-   .right
          //-     .title 我的订单
          //-     .options
          //-       router-link(:to="{name: 'seller-orders'}")
          //-         el-button(size='mini' type='success' plain) 管理
          //- 未认证显示(v-else)
          .item(v-if="userInfo.rz_status != 4")
            .left
              i.iconfont.iconrenzheng
            .right
              .title(v-if="userInfo.rz_status == 1 || userInfo.rz_status == 0") 未实名认证
              .title(v-if="userInfo.rz_status == 2") 认证信息待审核
              .title.red(v-if="userInfo.rz_status == 3") 认证审核不通过
              .options
                router-link(:to="{name: 'certificate'}")
                  el-button(v-if="userInfo.rz_status == 1 || userInfo.rz_status == 0" size='mini' type='success' plain) 去认证
                  el-button(v-if="userInfo.rz_status == 2 || userInfo.rz_status == 3" size='mini' type='success' plain) 更新认证
        //- .gzh(v-if='gzhSwitch')
        //-   .qrcode
        //-     .title  关注我们
        //-     img(:src='gzhQrcodeUrl')
        //-     .text 关注微信公众号,
        //-       p 第一时间获取最新资讯
      .form
        .record
          .from-title 最近账单
          el-table(:data="recentBill" stripe :style="{ border: '1px solid #f5f5f5' }")
            el-table-column(prop="typeText" label="标题" show-overflow-tooltip)
            el-table-column(prop="money" label="金额(元)" width="120" align='center')
            el-table-column(prop="content" label="时间" width="160")
              template(slot-scope="scope")
                span {{scope.row.createddt|dateFormat}}

          router-link(:to="{name:'finance-finance'}")
            el-button.more(type='text') 查看更多>>

        .message
          .from-title 最近消息
          el-table(:data="recentMessage" stripe :style="{ border: '1px solid #f5f5f5' }")
            el-table-column(prop='contents' label="标题" show-overflow-tooltip)
            el-table-column(label="时间" width='160')
              template(slot-scope="scope")
                span {{scope.row.addtime|dateFormat}}
            el-table-column(label="状态" width='70')
              template(slot-scope="scope")
                span(:class="scope.row.status ? 'green': 'red'") {{scope.row.status ? '已读': '未读'}}
            el-table-column( label="选项" width='100')
              template(slot-scope="scope")
                .a(@click="markRead(scope.row)" type='text' v-if='!scope.row.status') 标记为已读

          router-link(:to="{name:'personal-message'}")
            el-button.more(type='text') 查看更多>>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      serverQQ: window.$globalconfig.SERVICE_QQ,
      isPanoMarket: window.$globalconfig.MODULES.PANOMARKET,
      serverTel: window.$globalconfig.SERVICE_HOTLINE,
      gzhSwitch: window.$globalconfig.GZH_SWITCH,
      gzhQrcodeUrl: window.$globalconfig.GZH_QRCODE_RUL,
      recentMessage: [],
      recentBill: []
    }
  },
  created () {
    this.$api.getUserMessage(1, 5).then(data => {
      this.recentMessage = data.list
    })
    this.$vgo.openLoading()
    this.$api.getUserFinance({ pageIndex: 1, pageSize: 5 }).then(data => {
      this.recentBill = data.list
    })
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    markRead (msg) {
      this.$store.dispatch('setUserMessageStatus', msg)
    },
    checkin () {
      this.$vgo.openLoading()
      this.$api.checkin().then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.$store.commit('UPDATE_USER_INFO', { is_integral: 1, integral: Number(this.userInfo.integral) + Number(data) })
      })
    },
    withdraw () {
      switch (this.userInfo.rz_status) {
        case 4:
          this.$router.push({ name: 'finance-balance' })
          break
        case 3:
          this.$vgo.tip('提现需要实名认证, 当前认证信息审核不通过, 请更新认证信息!', 'warning')
          this.$router.push({ name: 'certificate' })
          break
        case 2:
          this.$vgo.tip('认证信息待审核, 请等待审核通过, 再提现!', 'warning')
          break
        default:
          this.$vgo.tip('提现需要实名认证, 当前未实名认证!', 'warning')
          this.$router.push({ name: 'certificate' })
          break
      }
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/var'
.home
  .overview-info
    .top
      display flex
      .user-info
        display flex
        flex-wrap wrap
        width 100%
        .item
          width 25%
          display flex
          padding 10px 0 10px 30px
          .left
            width 70px
            height 70px
            line-height 70px
            text-align center
            border-radius 50%
            background-color #eff6ff
            margin-right 10px
            i
              color #409EFF
              font-size 30px
          .right
            display flex
            flex-direction column
            justify-content space-around
            min-width 80px
            .top
              display flex
              .el-button
                margin-left 10px
            .title
              font-size 12px
              line-height 20px
              color #999
            .center
              a
                margin-right 5px
            .expires
              color #999
              line-height 12px
              font-size 12px
              margin-bottom 5px
            .text
              font-size 14px
              line-height 30px
              color #f85
      .gzh
        width 210px
        text-align center
        padding-right 40px
        .qrcode
          .title
            color #666
            font-size 14px
          img
            width 150px
            height 150px
          .text
            font-size 12px
            color #999
    .form
      display flex
      justify-content space-around
      margin-top 20px
      .record,.message
        width 45%
        .from-title
          margin 10px 0
          height 30px
          line-height 30px
          padding-left 10px
          font-size 20px
          border-left 3px solid $blue
        .more
          float right
</style>
