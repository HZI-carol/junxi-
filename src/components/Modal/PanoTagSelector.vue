<template lang="pug">
  el-dialog.tags-select(
  title='选择标签(最多选择3个)',
  :visible.sync='showModal'
  width='800px')
    .content
      .title 推荐标签
      .system
        span.el-tag.select-none.el-tag--success(v-for='item in systemTag'
          @click='selectTag(item)' :key="item.id") {{item.text}}
      .title 自定义标签
        .add.fr
          el-input(size="mini" v-model="tagName" placeholder="请输入标签名称")
          el-button(size="mini" type="primary" @click="addTag" plain) 添 加
      .custom.pr
        .el-tag.select-none.el-tag--primary(v-for='(item,index) in customTag'
          @click='selectTag(item)' :key="index") {{item.tagname}}
          i.el-tag__close.el-icon-close(@click.stop='delCustomTag(item, index)')
        .null.pac(v-if='!customTag.length') 暂无数据
    .dialog-footer(slot='footer')
      .selected.fl
        span.label 当前已选({{selectedTag.length}}/3):
        el-tag.select-none(type="success" v-for='(item,index) in selectedTag'
          @close='delSelectedTag(index)' :key="index" closable) {{item}}
      el-button(size="mini" type="primary" @click="submit") 确定
      el-button(size="mini"  @click="showModal = false") 取消

</template>

<script>
export default {
  data () {
    return {
      showModal: false,
      selectedTag: [],
      customTag: [],
      systemTag: [],
      tagName: ''
    }
  },
  methods: {
    openModal (obj) {
      this.showModal = true
      this.selectType = obj.data.type
      this.selectedTag = JSON.parse(JSON.stringify(obj.data.tags))
      if (this.systemTag.length === 0) {
        this.getUserPanoTag()
      }
    },
    getUserPanoTag () {
      this.$api.getUserPanoTag().then(data => {
        this.systemTag = data.systemtag
        this.customTag = data.customizetag
      })
    },
    selectTag (item) {
      if (this.selectedTag.length >= 3) {
        this.$vgo.tip('已添加3个标签! 请删除后再添加', 'warning')
        return
      }
      let arr = this.selectedTag.filter(i => item.text === i || item.tagname === i)
      if (arr.length > 0) {
        this.$vgo.tip('已添加相同标签!', 'warning')
        return
      }
      this.selectedTag.push(item.text || item.tagname)
    },
    addTag () {
      if (!this.tagName) {
        this.$vgo.tip('请输入标签名称!', 'warning')
        return
      }
      if (this.tagName.length > 10) {
        this.$vgo.tip('标签名称不超过10个字符!', 'warning')
        return
      }
      this.$vgo.openLoading('.tags-select .content')
      this.$api.addUserPanoTag(this.tagName).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.getUserPanoTag()
        this.tagName = ''
      })
    },
    delCustomTag (item, index) {
      this.$vgo.open(() => {
        this.$vgo.openLoading('.tags-select .content')
        this.$api.delUserPanoTag(item.tagid).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.customTag.splice(index, 1)
          this.selectedTag.map((i, index) => {
            if (i === item.tagname) {
              this.selectedTag.splice(index, 1)
            }
          })
        })
      })
    },
    delSelectedTag (index) {
      this.selectedTag.splice(index, 1)
    },
    submit () {
      this.$vgo.emit(this.selectType, JSON.parse(JSON.stringify(this.selectedTag)))
      this.showModal = false
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/style/index";
.tags-select
  .title
    height: 36px;
    background-color #f0f3f4
    line-height: 36px;
    border-top: 1px solid #fff;
    font-size: 15px;
    color: #999;
    padding 0 10px
    margin-bottom 10px
    .add
      &>.el-input
        width 200px!important
        margin 0 20px
  .custom,.system
    min-height 100px
    padding-left 10px
    .el-tag
      margin-right 10px
      margin-bottom 10px
      cursor pointer
      &:hover
        background-color #fff
  .dialog-footer
    .selected
      display inline-block
      .label
        color #999
      .label,.el-tag
        margin-right 10px

</style>
