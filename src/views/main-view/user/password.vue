<template lang="pug">
  .password
    .type-title 我的密码
    .wrapper
      .form
        .form-item.tel
          .label 登录密码
          span.content **********
          el-button(size="mini" type="primary" @click="dialogVisible = true") 修 改

      el-dialog.upate-dialog(title="修改密码" :visible.sync="dialogVisible" width="430px" )
        .form
          .form-item
            .label 原密码:
            el-input(size="small" v-model="form.oldpwd" placeholder="请输入原密码" type="password" clearable)
          .form-item
            .label 新密码:
            el-input(size="small" v-model="form.newpwd" placeholder="请输入新密码" type="password" clearable)
          .form-item
            .label 再次输入:
            el-input(size="small" v-model="form.newpwdre" placeholder="再次输入新密码" type="password" clearable)
        span(slot="footer" class="dialog-footer")
          el-button( @click="dialogVisible = false" size="mini") 取 消
          el-button( type="primary" @click="submit" size="mini") 确 定

</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        oldpwd: '',
        newpwd: '',
        newpwdre: ''
      }
    }
  },
  methods: {
    submit () {
      if (this.form.oldpwd.length < 6 || this.form.oldpwd.length > 18) {
        this.$vgo.tip('原密码错误!', 'warning')
        return
      }
      if (this.form.newpwd.length < 6 || this.form.newpwd.length > 18) {
        this.$vgo.tip('新密码必须6-18位数字或字母!', 'warning')
        return
      }
      if (this.form.newpwd !== this.form.newpwdre) {
        this.$vgo.tip('两次输入新密码不一致!', 'warning')
        return
      }
      this.$api.updatePassword(this.form.oldpwd, this.form.newpwd).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.form.oldpwd = ''
        this.form.newpwd = ''
        this.form.newpwdre = ''
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="stylus">
  .password
    .wrapper
      margin 0 20px
      .form-item
        display flex
        align-items center
        margin-bottom 20px
        .label:first-child
          width 90px
        .content
          margin 0 60px
        .el-button
          width 80px
          margin-left 30px
      .upate-dialog
        .form
          margin-top 20px
          text-align center
          .el-input
            width 300px
      .tel
        padding-bottom 20px
        border-bottom 1px dashed #dcdcdc
</style>
