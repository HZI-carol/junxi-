<template lang='pug'>
  .project-manage
    .haed-options
      template
        el-checkbox(:value='selectAllFlag' label="全选" @change='selectAll' size='mini' border)

        //- el-badge(:value="getSelectedIdList.length")
        //-   el-button(type='success' size='mini' @click='moveProject("")' :disabled='opts.status == "-1"' plain) 移动项目
        el-badge(:value="getSelectedIdList.length")
          el-button(type='danger' size='mini' @click='delProject("")' plain) 删除

    el-tabs(type="border-card"  @tab-click="switchTab")
      el-tab-pane.clearfix(v-for='i in Object.keys(project)' :label='project[i].title' :key='i' lazy)
        .project-item(v-for="(item, index) in project[i].list[project[i].page]" :key='index')
          .item-wrap.hover-scale
            a.top(:href='item.fk_pano_id ? item.panoview_url : "javascript:;"')
              .img-box.pr
                img.pac(:src="item.full_image_url")
                .null.pac(v-if="!item.fk_pano_id") 无全景
                i.el-icon-circle-check(@click.stop.prevent="selectProject(item)" :class="item.selected ? 'selected' : ''")
              .info
                el-tooltip(:content="item.project_name" placement="top" effect="light" :disabled='item.project_name.length < 10')
                  .name.omit {{item.project_name}}
                .row
                  i.iconfont ¥
                  .price.red.omit {{item.total_price ? item.total_price + '万' : '面议'}}
                el-tooltip(:content="item.province + item.city + item.area + item.address" placement="top" effect="light")
                  .row
                    i.iconfont.iconlocation
                    .text.omit {{item.province + item.city + item.area + item.address}}
                .row
                  i.iconfont.iconfangjian
                  span {{item.room_count}}室{{item.hall_count}}厅{{item.bathroom_count}}卫{{item.floorage}}平
                .row
                  i.iconfont.iconzhuangxiu1
                  span {{item.style_text}}

            .option
              el-button(@click='$router.push({name: "project-update", query: item})' type="primary" size="mini" plain) 信息

              a(v-if='item.fk_pano_id' :href='PANO_EDITOR_PREFIX + item.fk_pano_id')
                el-button(type="primary" size="mini" plain @click='') 编辑
              el-button(v-else type="primary" size="mini" plain @click='$router.push({name: "panorama-publish", query: item})') 全景

              el-button(type="success" size="mini" plain @click='moveProject(item)') 移动
              el-button(type="danger" size="mini" plain @click='delProject(item)') 删除

        .null.pac(v-if='project[opts.status].count <= 0') 暂无数据

      el-pagination.fl.mb20(v-show='project[opts.status].count > 0' :total="project[opts.status].count" @current-change="handlePageChange"
      :current-page.sync='project[opts.status].page' :page-size='opts.pageSize' background layout="prev, pager, next")
    moveProject(ref='moveProject')
</template>

<script>

export default {
  name: 'project',
  components: {
    moveProject: () => import('./comps/moveProject')
  },
  data () {
    return {
      PANO_EDITOR_PREFIX: window.$globalconfig.URLS.PANO_EDITOR_PREFIX,
      showMove: false,
      selectAllFlag: false,
      opts: {
        page: 1,
        pageSize: 10,
        keyword: '',
        status: 0 // 项目状态0 在建项目 1 竣工项目 2 完工项目 3 停工项目 4 暂停 5 未开工项目（暂时只用到0 2 如有项目为 -1）
      },
      project: {
        '0': { list: {}, count: -1, title: '在装项目', page: 1 },
        '2': { list: {}, count: -1, title: '完工项目', page: 1 },
        '-1': { list: {}, count: -1, title: '所有项目', page: 1 }
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    getSelectedIdList () {
      let list = this.project[this.opts.status].list[this.opts.page]
      let arr = []
      if (list) {
        list.map(i => {
          if (i.selected) arr.push(i.id)
        })
      }
      return arr
    }
  },
  methods: {
    // 切换tab
    switchTab (tab) {
      switch (Number(tab.index)) {
        case 0:
          this.opts.status = 0
          break
        case 1:
          this.opts.status = 2
          break
        case 2:
          this.opts.status = -1
          break
      }
      if (this.project[this.opts.status].count === -1) {
        this.getList()
      }
    },
    getList (init = false) {
      let listObj = this.project[this.opts.status]
      if (init) {
        for (const key in this.project) {
          this.project[key].list = {}
          this.project[key].count = -1
          this.project[key].page = this.opts.page = 1
        }
      }
      this.opts.page = listObj.page
      if (listObj.count && !listObj.list[listObj.page]) {
        this.$api.getUserProjiectList(this.opts).then(data => {
          this.$set(this.project[this.opts.status].list, this.opts.page, data.list)
          this.project[this.opts.status].count = data.count
        })
      }
    },
    moveProject (item) {
      let idStr = ''
      let status = this.opts.status
      if (item) {
        idStr = item.id
        status = item.status
      } else idStr = this.getSelectedIdList.join(',')
      if (!idStr) {
        this.$vgo.tip('未选择项目!', 'warning')
        return
      }
      this.$refs.moveProject.openModal(idStr, Number(status))
    },
    delProject (item) {
      let idStr = ''
      if (item) idStr = item.id
      else idStr = this.getSelectedIdList.join(',')
      if (!idStr) {
        this.$vgo.tip('未选择项目!', 'warning')
        return
      }
      this.$vgo.open(() => {
        this.$api.delProject(idStr).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.getList(true)
        })
      })
    },
    // 选中/取消选中全景
    selectProject (item) {
      this.$set(item, 'selected', !item.selected)
      let list = this.project[this.opts.status].list[this.opts.page]
      let arr = list.filter(i => i.selected)
      if (arr.length === list.length) {
        this.selectAllFlag = true
      } else {
        this.selectAllFlag = false
      }
    },
    // 全选此页
    selectAll (val) {
      this.selectAllFlag = !this.selectAllFlag
      let list = this.project[this.opts.status].list[this.opts.page]
      list.map(i => {
        this.$set(i, 'selected', this.selectAllFlag)
      })
    },
    // 分页切换
    handlePageChange (val) {
      this.getList()
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';

$W = 300px

.project-manage
  position relative
  .haed-options
    z-index 1
    height 39px
    padding-top 5px
    padding-left 20px
    background-color #f5f7fa
    border-bottom: 1px solid #e4e7ed
    position absolute
    right 0px
    top 0px
    .input-new-cate
      width 200px
    &>.el-badge,&>.el-button,&>.el-checkbox,&>.el-input
      margin-right 10px
      .el-badge__content.is-fixed
        top 4px
        z-index 1
  .el-tabs
    &.is-move
      .el-tabs__header
        width calc(100% - 318px)
    .el-tabs__header
      width calc(100% - 160px)
    .el-tab-pane
      .project-item
        width $W
        margin-bottom 20px
        padding 0 10px
        display inline-block
        .item-wrap
          border 1px solid #f5f5f5
          .top
            width 100%
            height 150px
            background #e3dfea
            display flex
            align-items center
            .img-box
              width 40%
              height 100%
              text-align center
              img
                width 100%
                border 5px solid rgba(#fff, 0)
                height 100%
              i.el-icon-circle-check
                position absolute
                left 10px
                top 10px
                color $success
                font-size 26px
                border-radius 50%
                background-color #fff
                color #aaa
                opacity .5
                &.selected
                  opacity 1
                  color $success

            .info
              width 65%
              border-left 1px dashed #fff
              line-height 26px
              padding 0 20px
              .name
                color #666
                font-size 16px
                width 100%
                font-weight 700
              .time
                font-size 14px
                color #999
              .row
                display flex
                i
                  color #aaa
                  margin-right 5px
                  width 15px
                  text-align center
          .option
            height 40px
            line-height 40px
            text-align center
            a
              margin 0 10px

media-query('.project-manage .el-tabs .el-tab-pane .project-item', $W)

</style>
