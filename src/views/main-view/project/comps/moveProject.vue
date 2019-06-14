<template lang="pug">
el-dialog.move-project-modal(title="移动项目" width="350px" :visible.sync="isShow")
  .dialog-content

    el-select(v-model="id" placeholder="请选择项目类别")
      el-option(v-for="item in statusActions"
        :key="item.id" :label="item.name" :value="item.id" :disabled='item.disabled')

  .dialog-footer(slot="footer")
    el-button(type="primary" @click='submit' size="mini" ) 确认
    el-button(@click='isShow = false' size="mini" ) 取消

</template>

<script>
export default {
  data () {
    return {
      idStr: '',
      isShow: false,
      id: '',
      statusActions: [{ name: '在装项目', id: 0, disabled: false }, { name: '完工项目', id: 2, disabled: false }]
    }
  },
  methods: {
    openModal (idStr, status) {
      this.id = ''
      this.statusActions[0].disabled = status === 0
      this.statusActions[1].disabled = status === 2
      this.idStr = idStr
      this.isShow = true
    },
    submit () {
      this.$api.updateProjectStatus(this.idStr, this.id).then(data => {
        this.isShow = false
        this.$vgo.tip('操作成功!', 'success')
        this.$parent.getList(true)
      })
    }
  }
}
</script>

<style lang="stylus">
.move-project-modal
  .dialog-content
    height 150px
    text-align center
    padding-top 50px
</style>
