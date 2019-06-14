<template lang='pug'>
  .login(v-loading="loading"
    element-loading-text="正在登录..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)")
    .form
      .logo
        img(src="/static/images/logo.png")
      .username.row
        el-input(v-model="form.username" size='small' placeholder="请输入用户名"
        @blur="username" max="20" type="text" autofocus clearable autoComplete='on'
        @keyup.enter.native='submitForm')
          template(slot="prepend")
            i.iconfont.iconuser
        .error(v-show="uFlag") 用户名不正确!
      .pwd.row
        el-input(v-model="form.password" size='small' placeholder="请输入密码"
        @blur="password" max="20" type="password" clearable
        @keyup.enter.native='submitForm')
          template(slot="prepend")
            i.iconfont.icon-wt-lock
        .error(v-show="pFlag") 密码不正确!
      .auth.row
        el-input(v-model="form.auth" size='small' placeholder="请输入验证码"
        @blur="auth" max="10" type="text" clearable
        @keyup.enter.native='submitForm')
          template(slot="prepend")
            i.iconfont.icon-yanzhengma2-copy
        .img
          img(src="/static/images/ValidateCode.jpg")
        .error(v-show="aFlag") 验证码不正确!
      .options
        el-button(type="primary" size='small' @click="submitForm") 登录
        a.logup(href="#") 快速注册→
        a.find-pwd(href="#") 忘记密码?

</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        auth: ''
      },
      uFlag: false,
      pFlag: false,
      aFlag: false,
      loading: false
    }
  },
  mounted () {
    console.log(123)

    this.$cookie.remove('access_token')
  },
  methods: {
    submitForm () {
      this.loading = true
      if (this.username() && this.password()) {
        this.loading = false
      } else {
        this.$vgo.tip('请填写正确的用户名和密码!', 'warning')
        this.loading = false
        return
      }
      this.$api.login(this.form.username, this.form.password).then(data => {
        this.$vgo.tip('登陆成功!', 'success')
        let expires = { expires: data.expires_in / 60 / 60 / 24 }
        let str = []
        for (const key in data) {
          str.push(key + '=' + data[key])
        }
        this.$cookie.set('UserAccount', str.join('&'), expires) // 兼容老版本

        this.$cookie.set('userinfo', data, expires)
        this.$cookie.set('access_token', data.access_token, expires)

        this.$router.push({ name: 'home' })
      })
    },
    username () {
      if (this.form.username.length < 4) {
        this.uFlag = true
        return false
      } else {
        this.uFlag = false
        return true
      }
    },
    password () {
      if (this.form.password.length < 6) {
        this.pFlag = true
        return false
      } else {
        this.pFlag = false
        return true
      }
    },
    auth () {
      if (this.form.auth.length < 4) {
        this.aFlag = true
        return false
      } else {
        this.aFlag = false
        return true
      }
    }
  }

}
</script>

<style lang="stylus">
@import "~@/assets/style/index.styl";
.login
  width 100%
  height 100%
  background-image url('/static/images/login-bg.jpg')
  background-size cover
  background-position center
  position relative
  .form
    position absolute
    right 160px
    top 50%
    transform translateY(-60%)
    width 300px
    background-color #fff
    border-radius 5px
    .logo
      text-align center
      height 60px
      margin-bottom 20px
      width 100%
      line-height 60px
      border-bottom 1px solid #ddd
      img
        height 30px
    .row
      margin-bottom 25px
      position relative
      text-align center
      .el-input
        width 90%
        margin 0 auto
        .el-input-group__prepend
          padding 0 10px
      .error
        position absolute
        bottom -20px
        font-size 12px
        left 20px
        color $danger
    .auth
      text-align left
      .el-input
        margin-left 5%
        width 65%
      .img
        margin-right 5%
        height 35px
        line-height 45px
        float right
        img
          display block
          height 100%
    .options
      text-align center
      padding 0 10px
      .el-button
        width 100%
      .logup
        float left
        color $blue
        height 40px
        line-height 40px
      .find-pwd
        height 40px
        line-height 40px
        color $blue
        float right
</style>
