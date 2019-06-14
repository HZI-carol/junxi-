<template lang='pug'>
  .top-bar-box
    .top-header
      .menu-button(@click="$store.commit('TOGGLE_COLLAPSE')" :class='{active: isCollapse}')
        i.iconfont.iconmenu

      el-menu(:default-active="activeIndex" background-color="#2F3A4E"
      text-color="#bfcbd9" active-text-color="rgb(255, 208, 75)" mode="horizontal")
        template(v-for="(items, index) in $router.options.routes" v-if="!items.meta.hideMenu")
          template(v-if='!items.meta.dropMenu')
            router-link.fl(:to="{name: items.children[0].name}" :key="index")
              el-menu-item(:index="index + ''" :key="index")
                i.iconfont(:class="items.meta.icon")
                span(slot="title") {{items.meta.title}}

          template(v-else)
            //- 多个二级菜单显示二级分类
            el-submenu(:index='String(index)')
              template(slot="title")
                i.iconfont(:class="items.meta.icon")
                span(slot="title") {{items.meta.title}}
              router-link(v-for="(item, index) in getMenu(items.children)" :to="{name: item[0].name}" :key="index"
                v-if='!item[0].meta.hideModule')
                el-menu-item(:index="String(index)")
                  template(slot="title")
                    i.iconfont(:class="item[0].meta.groupIcon")
                    span(slot="title") {{item[0].meta.group}}

      .right-box
        el-button(@click='$router.push({name:"project-publish"})' type="primary" size="mini")
          i.el-icon-upload
          span 项目发布

        router-link.package-name(:to="{name: 'vip-package'}")
          el-dropdown
            .vip
              i.iconfont.iconvip1
              span {{userInfo.packagename}}
            el-dropdown-menu(slot="dropdown")
              router-link(:to="{name:'vip-package'}")
                el-dropdown-item 购买套餐
        .avatar
          .head-img
            el-badge.msg(:value="userUnReadMsg" :max="99" :hidden='!userUnReadMsg')
              img(:src="userInfo.avatar")

          .topbar-info-dropdown-memu
            .topbar-user-header
              img.head-img(:src="userInfo.avatar" )
              span.omit {{userInfo.nickname}}

            .topbar-user-body
              router-link(:to="{name: 'personal-message'}")
                i.el-icon-message
                el-badge.msg(:value="userUnReadMsg" :max="99" :hidden='!userUnReadMsg')
                  span 消息

              router-link(:to="{name: 'account-recharge'}")
                i.iconfont.iconchongzhi
                span 账户余额 / 充值

              router-link(:to="{name: 'finance-finance'}")
                i.iconfont.iconcaiwu
                span 收入/支出

              //- a(:href='pluginsUrl' target='_blank')
              //-   i.iconfont.icon-qiajuan1
              //-   span 我的卡券

              router-link(:to="{name: 'company-info'}")
                i.iconfont.iconsetup
                span 账户设置

              router-link(:to="{name: 'certificate'}")
                i.iconfont.iconrenzheng
                span 实名认证

              a(@click='exit')
                i.iconfont.iconclose
                span 退出
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      isH5Site: window.$globalconfig.MODULES.H5SITE,
      pluginsUrl: window.$globalconfig.URLS.PLUGIN_API,
      activeIndex: '0'
    }
  },
  created () {
    this.$store.dispatch('getUserUnReadMessage')
    setInterval(() => {
      this.$store.dispatch('getUserUnReadMessage')
    }, 1000 * 60)
  },
  computed: {
    ...mapGetters(['userInfo', 'isCollapse', 'userUnReadMsg'])
  },
  methods: {
    getMenu (list) {
      let handleList = []
      let flagArr = []
      list.map((item, i) => {
        if (!flagArr.includes(item.meta.group)) {
          flagArr.push(item.meta.group)
          handleList.push([item])
        } else {
          handleList[flagArr.indexOf(item.meta.group)].push(item)
        }
      })
      return handleList
    },
    exit () {
      this.$cookie.set('UserAccount', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
      this.$cookie.set('UserAccount', null, { expires: -1 })
      this.$cookie.set('userinfo', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
      this.$cookie.set('userinfo', null, { expires: -1 })
      this.$cookie.set('access_token', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
      this.$cookie.set('access_token', null, { expires: -1 })
      this.$auth.getToken()
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
.top-bar-box
  width 100%
  height 100%
  border-bottom 1px solid #e6e6e6
  .top-header
    background-color #2F3A4E
    width 100%
    height 50px
    overflow hidden
    border-bottom 1px solid #e6e6e6
    .menu-button
      float left
      display inline-block
      vertical-align top
      height 50px
      width 50px
      line-height 50px
      text-align center
      transition all 0.3s
      cursor pointer
      &.active
        transform rotateZ(90deg)
      &:hover
        background-color rgb(38,42,62)
        i
          color rgb(255, 208, 75)
      i
        font-size 24px
        color rgb(191, 203, 217)
    .el-menu
      margin-top -5px
      float left
      overflow hidden
      .router-link-active>.el-menu-item,.is-active,.el-menu-item:hover
        background-color rgb(38,42,62)!important
        span
          color rgb(255, 208, 75)
        i
          color rgb(255, 208, 75)!important
      .el-menu-item
        padding 0 10px
        i
          margin 0 5px
          color #bfcbd9
    .el-menu--horizontal
      border none
    .right-box
      vertical-align top
      float: right
      height: 49px
      line-height: 49px
      .package-name
        margin-left 20px
        height: 49px
        line-height 49px
        display inline-block
        .vip
          height: 49px
          line-height 49px
          display inline-block
          i
            vertical-align: -3px
            font-size 22px
            color #ffca00
          span
            padding-left 5px
            color #bfcbd9
      .avatar
        display inline-block
        height 100%
        width 68px
        &:hover
          .topbar-info-dropdown-memu
            display block
            animation fadeInRight 0.5s
        .head-img
          width 40px
          height 40px
          border-radius 50%
          margin 0 auto
          .msg
            .el-badge__content.is-fixed
              top 9px
              right 17px
            img
              border-radius 50%
              height 40px
              width 40px
        .topbar-info-dropdown-memu
          position fixed
          right 0
          top 49px
          display none
          border-top 1px solid #fff
          background-color #2F3A4E
          color #fff
          width 200px
          .topbar-user-header
            padding 5px 10px
            display flex
            align-items center
            justify-content center
            border-bottom 1px solid hsla(0,0%,100%,.1)
            img
              margin-right 10px
            span
              flex 1

          .topbar-user-body
            a
              color rgb(191, 203, 217)
              display block
              width 100%
              padding-left 20px
              height 36px
              line-height 40px
              .msg
                .el-badge__content.is-fixed
                  top 10px
                  right 0px
              &:hover
                background-color #21272b
                color #fff
                i
                  color #fff
              i
                color #afb0b2
                margin-right 10px

// @media only screen and (max-width: 1600px)
//   .top-bar-box
//     .top-header
//       .el-menu
//         .el-menu-item
//           padding 0 6px
@media only screen and (max-width: 1450px)
  .top-bar-box
    .top-header
      .el-menu
        .el-menu-item
          padding 0 4px
// @media only screen and (max-width: 1400px)
//   .top-bar-box
//     .top-header
//       .el-menu
//         .el-menu-item
//           padding 0 2px

</style>
