<template lang="pug">
.layout(:class='{active: $store.getters.isCollapse}')
  .side-bar
    SideBar
  .top-bar
    TopBar
  .router-view
    transition(name="fade-transform" mode="out-in")
      keep-alive(:include="keepAliveList")
        router-view
    span.copyright(v-html='copyright')
  //- modal
  Agreement(ref="agreement")
  PanoTagSelector(ref="panoTagSelector")

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      keepAliveList: [],
      copyright: window.$globalconfig.COPYRIGHT
      // isCollapse: false
    }
  },
  created () {
    this.$store.dispatch('getUserInfo').then(res => {
      this.verify(res)
      if (res.is_require_subscribe_mp && !res.is_subscribe_mp) {
        this.$router.push({ name: 'account-bind' })
      }
    })
    this.getkeepAliveList()
  },
  mounted () {
    this.$vgo.on('showDialogModal', obj => {
      this.showModal(obj)
    })
  },
  computed: {
    ...mapGetters(['userInfo', 'companyInfo'])
  },
  methods: {
    showModal (obj) {
      if (!obj.isManage) {
        obj.isManage = false
      }
      if (!obj.data) {
        obj.data = ''
      }
      this.$refs[obj.name].openModal({ isManage: obj.isManage, data: obj.data })
    },
    verify (userInfo) {
      if (Number(userInfo.rz_status) !== 4 && this.$route.meta.needVerify) {
        this.$vgo.tip('此页面需要实名认证通过才能访问!', 'warning')
        this.$router.push({ name: 'certificate' })
      }
    },
    getkeepAliveList () {
      this.$router.options.routes.map(item => {
        if (item.children) {
          item.children.map(i => {
            if (i.meta.keepAlive) {
              this.keepAliveList.push(i.name)
            }
          })
        }
      })
    }
  },
  components: {
    SideBar: () => import('./side-bar'),
    TopBar: () => import('./top-bar'),
    // modal
    Agreement: () => import('@/components/Modal/Agreement'),
    PanoTagSelector: () => import('@/components/Modal/PanoTagSelector')
  },
  watch: {
    '$route' (to, from) {
      this.verify(this.userInfo)
      if (this.userInfo.rz_status !== 4) return
      if (to.name === 'ad-income' || to.name === 'apply-ads') {
        this.$store.dispatch('getCert', 'adsCert').then(res => {
          if (Number(res.status) !== 1) {
            this.$router.push({ name: 'apply-ads' })
          }
        })
      }
      if (to.name === 'ad-manage' || to.name === 'ad-expend' || to.name === 'ad-publish' || to.name === 'apply-adz') {
        this.$store.dispatch('getCert', 'adzCert').then(res => {
          if (Number(res.status) !== 1) {
            this.$router.push({ name: 'apply-adz' })
          }
        })
      }
      if (to.name === 'works-market-seller-goods' || to.name === 'works-market-seller-orders' || to.name === 'apply-works-market') {
        this.$store.dispatch('getCert', 'worksMarketCert').then(res => {
          if (Number(res.status) !== 1) {
            this.$router.push({ name: 'apply-works-market' })
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus">
topBarH = 50px

.layout
  sideBarW = 180px
  width 100vw
  height 100%
  min-width 1366px
  position relative
  .side-bar
    position absolute
    left 0
    top 0
    height 100%
    width sideBarW
    transition all .3s ease-in-out
  .top-bar
    position absolute
    overflow hidden
    right 0
    top 0
    height topBarH
    width calc(100% - 180px)
    transition all .3s ease-in-out
    z-index 999
  .router-view
    overflow-x hidden
    overflow-y auto
    height calc(100% - 50px)
    box-sizing border-box
    position absolute
    background-color #f5f5f5
    right 0
    top topBarH
    width calc(100% - 180px)
    padding 20px
    padding-bottom 0
    transition all .3s ease-in-out
    &>div
      background-color #fff
      min-height calc(100% - 30px)
      overflow hidden
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
    .copyright
      line-height 30px
      color #aaa
      font-size 12px
      display block
      text-align center
.layout.active
  sideBarW = 64px
  .side-bar
    width sideBarW
  .top-bar
    width calc(100% - 64px)
  .router-view
    width calc(100% - 64px)

</style>
