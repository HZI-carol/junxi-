<template lang='pug'>
.side-bar
  ScrollBar
    a.logo(:class="{active: $store.getters.isCollapse}" :href='homeUrl')
      img(:src="logoUrl" title="首页")

    a.go-old-version.el-icon-caret-left(:href='oldUserUrl' v-if='!$store.getters.isCollapse && oldUserUrl') 回到旧版

    el-menu.side-menu(background-color="#2F3A4E" text-color="#bfcbd9"
    :default-openeds="['0','1','2','3','4','5','6','7','8']"
    active-text-color="#bfcbd9" default-active="0" :collapse="$store.getters.isCollapse")
      template(v-for="(items, index) in getMenu")
        //- 多个二级菜单显示二级分类
        el-submenu(:index="index+''" v-if="getMenu.length > 1 && !items[0].meta.hideModule")
          template(slot="title")
            i.iconfont(:class="items[0].meta.groupIcon")
            span(slot="title") {{items[0].meta.group}}
          router-link(v-for="(item, i) in items" :to="{name: item.name}"
            :key="i" v-if='!item.meta.hideMenu')
            el-menu-item(:index="i+''" :key="i")
              i.iconfont(:class="item.meta.icon")
              span(slot="title") {{item.meta.title}}
        //- 一个二级菜单显示直接显示子菜单
        router-link(v-for="(item, i) in items" :to="{name: item.name}"  :key="i"
          v-if='getMenu.length <= 1 && !item.meta.hideMenu')
          el-menu-item(:index="i+''" :key="i")
            i.iconfont(:class="item.meta.icon")
            span(slot="title") {{item.meta.title}}
</template>

<script>
export default {
  data () {
    return {
      logoUrl: window.$globalconfig.LOGO,
      homeUrl: window.$globalconfig.URLS.HOME,
      oldUserUrl: window.$globalconfig.OLDUSERURL,
      curIdx: 0
    }
  },
  computed: {
    getMenu () {
      let list = this.$router.options.routes.filter(item =>
        item.path === this.$route.matched[0].path)[0].children
      let handleList = []
      let flagArr = []
      list.map((item, i) => {
        if (flagArr.indexOf(item.meta.group) === -1) {
          flagArr.push(item.meta.group)
          handleList.push([item])
        } else {
          handleList[flagArr.indexOf(item.meta.group)].push(item)
        }
      })
      return handleList
    }
  },
  methods: {
    menuItemClick (idx) {
      this.curIdx = idx
    }
  },
  components: {
    ScrollBar: () => import('@/components/ScrollBar')
  }
}
</script>

<style lang='stylus'>
sideBarW = 180px
.side-bar
  background-color #2F3A4E
  .router-link-active
    li, li i
      color #00a0e9!important
      background-color rgb(38, 46, 62)!important
  .logo
    display block
    H = 50px
    width 100%
    height H
    text-align center
    line-height H
    overflow hidden
    transition all .3s ease-in-out
    &.active
      width 37px
      transform translateX(18px)
    img
      max-height 60%
  .go-old-version
    width 100%
    text-align center
    display inline-block
    cursor pointer
    color #666
    &:hover
      color #ccc
  .side-menu
    border none
  .el-menu--collapse
    min-height 100%
  .side-menu:not(.el-menu--collapse)
    width sideBarW
    min-height 100%
    .el-menu-item
      min-width sideBarW
  i
    margin-right: 5px;
    color #bfcbd9
    text-align: center;
    font-size: 18px;
    vertical-align: -2px;

</style>
