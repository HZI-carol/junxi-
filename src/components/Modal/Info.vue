<template lang="pug">
.info-modal
  el-dialog(:title="content.title"  :visible.sync="isShow" center width='1100px') 
    .dialog-content(v-html="content.desc")
    //- pre.clearfix {{content}}
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
      content: ''
    }
  },
  methods: {
    openModal(content) {
      this.isShow = true
      this.content = content
    },
  },
}
</script>

<style lang="stylus">
.info-modal
  .el-dialog
    .dialog-content
      padding 10px
      height 600px
      width 100%
  //   border-bottom 1px solid #f5f5ff
</style>

