
<template lang="pug">
  .account-bind
    .type-title 账户绑定
    .wrapper
      .form
        .form-item.tel
          .label 手机号
          span.content(:class='userInfo.phone? "green":"red"') {{userInfo.phone || '未绑定'}}
          el-button(size="mini" type="primary" @click="openDialog(1)") {{userInfo.phone ? '修 改' : '绑 定'}}
        .form-item.email
          .label 邮箱
          span.content(:class='userInfo.email? "green":"red"') {{userInfo.email || '未绑定'}}
          el-button(size="mini" type="primary" @click="openDialog(2)") {{userInfo.email ? '修 改' : '绑 定'}}
        .form-item.email(v-if='isOPenWxLogin')
          .label 微信
          span.content(:class='userInfo.wx_openid? "green":"red"') {{userInfo.wx_openid ? '已绑定' : '未绑定'}}
          el-button(size="mini" type="primary" @click="openDialog(3)") {{userInfo.wx_openid ? '解 绑' : '绑 定'}}
        .form-item.card
          .label 提现卡号
          span.content(:class='userInfo.bindcard? "green":"red"') {{userInfo.bindcard || '未绑定'}}
          .tip(v-if='userInfo.rz_status != 4') 您还未通过实名认证，无法绑定；
            router-link.a(:to="{name: 'certificate'}") 立即去实名认证>>
          el-button(size="mini" type="primary" v-else @click="openDialog(4)") {{userInfo.bindcard ? '修 改' : '绑 定'}}

      //- 信息输入对话框
      el-dialog.dialog(title="账户绑定" :visible.sync="showDialog" width='500px')
        el-form.mt20(label-width="120px")

          template(v-if='type === 1')
            el-form-item(label="手机号:" required)
              el-input(v-model="phone" size='small' placeholder='请输入手机号' clearable)
            el-form-item.verify(label="验证码:" required)
              el-input(v-model="phoneVerifyCode" size='small' placeholder='请输入验证码' clearable)
              el-button(@click="getVerifyCode(1)" type='primary' size='mini' :disabled='!!phoneWait') 获取验证码{{phoneWait || ''}}

          template(v-if='type === 2')
            el-form-item(label="邮箱账号:" required)
              el-input(v-model="email" size='small' placeholder='请输入邮箱账号' clearable)
            el-form-item.verify(label="验证码:" required)
              el-input(v-model="emailVerifyCode" size='small' placeholder='请输入验证码' clearable)
              el-button(@click="getVerifyCode(2)" type='primary' size='mini' :disabled='!!emailWait') 获取验证码{{emailWait || ''}}

          template(v-if='type === 3')
            el-form-item(label="手机号:" required)
              el-input(v-model="phone" size='small' placeholder='请输入手机号' clearable)
            el-form-item.verify(label="验证码:" required)
              el-input(v-model="phoneVerifyCode" size='small' placeholder='请输入验证码' clearable)
              el-button(@click="submit" type='primary' size='mini') 获取验证码

          template(v-if='type === 4')
            el-form-item(label="登录密码:" required)
              el-input(v-model="password" size='small' type='password' placeholder='请输入登录密码' clearable)
            el-form-item(label="银行:" required)
              el-select(v-model="bankName" placeholder="请选择银行" size='small')
                el-option(v-for="item in options" :key="item"
                  :label="item" :value="item")
            el-form-item(label="卡号:" required)
              el-input(v-model="cardId" size='small' placeholder='请输入卡号' clearable)

        .dialog-footer(slot="footer")
          el-button(@click="submit" type='primary' size='mini') 确 定
          el-button(@click="showDialog = false" size='mini') 取 消

      //- 限制- 未绑定微信 - 未关注微信公众号
      el-dialog.dialog-GZH(title="为获取更好的体验, 请关注平台微信公众号" :visible.sync="showGZH" width='450px')
        img(:src='gzhQrcodeUrl')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      gzhQrcodeUrl: window.$globalconfig.GZH_QRCODE_RUL,
      isOPenWxLogin: window.$globalconfig.WECHATOPEN_LOGIN_ISOPEN,
      showDialog: false,
      showGZH: false,
      phone: '',
      email: '',
      phoneVerifyCode: '',
      emailVerifyCode: '',
      phoneWait: 0,
      emailWait: 0,
      type: 0,
      bankName: '中国农业银行',
      password: '',
      cardId: '',
      options: ['中国农业银行', '中国建设银行', '中国工商银行', '交通银行', '中国邮政储蓄银行', '中国银行', '中国光大银行', '招商银行', '浦发银行', '中信银行', '华夏银行', '中国民生银行', '广发银行', '平安银行', '兴业银行']
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    openDialog (type) {
      this.type = Number(type)
      this.phone = ''
      this.email = ''
      this.cardId = ''
      this.password = ''
      this.phoneVerifyCode = ''
      this.emailVerifyCode = ''
      if (this.type === 3) {
        let token = this.$auth.getToken()
        let isbind = !this.userInfo.wx_openid
        window.location.href = `${window.$globalconfig.URLS.API}user/bind/wechat?token=${token}&isbind=${isbind}&redirect_uri=${encodeURIComponent(window.location.href)}`
        return
      }
      this.showDialog = true
    },
    submit () {
      if (this.type === 1 && this.$auth.verifyPhone(this.phone)) {
        if (this.phoneVerifyCode.length !== 5 || !/^\d+$/.test(this.phoneVerifyCode)) {
          this.$vgo.tip('请输入正确的验证码!', 'warning')
          return
        }
        this.handleBind({ phone: this.phone, vcode: this.phoneVerifyCode, type: 1 }, { phone: this.phone })
      }
      if (this.type === 2 && this.$auth.verifyEmail(this.email)) {
        if (this.emailVerifyCode.length !== 5 || !/^\d+$/.test(this.emailVerifyCode)) {
          this.$vgo.tip('请输入正确的验证码!', 'warning')
          return
        }
        this.handleBind({ email: this.email, vcode: this.emailVerifyCode, type: 2 }, { email: this.email })
      }
      if (this.type === 4 && this.$auth.verifyBank(this.cardId)) {
        if (this.password.length < 6 || this.password.length > 18) {
          this.$vgo.tip('密码错误!', 'warning')
          return
        }
        this.handleBind({ bindcard: this.cardId, bindcardname: this.bankName, vcode: this.password, type: 4 },
          { bindcard: this.cardId, bindcardname: this.bankName })
      }
    },
    handleBind (opts, localData) {
      this.$vgo.openLoading('.account-bind .el-dialog')
      this.$api.upateUserBind(opts).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        if (localData) {
          this.$store.commit('UPDATE_USER_INFO', localData)
        }
        this.showDialog = false
      })
    },
    getVerifyCode (type) {
      if (type === 1) {
        this.$auth.getVerifyCode('phoneWait', this.phone, this)
      }
      if (type === 2) {
        this.$auth.getVerifyCode('emailWait', this.email, this)
      }
    }
  },
  watch: {
    userInfo: {
      handler (newV, oldV) {
        if (Object.keys(newV).length && newV.is_require_subscribe_mp) {
          this.$nextTick(() => {
            if (!newV.wx_openid) {
              this.$vgo.open(() => {
                this.openDialog(3)
              }, '为获取更好的体验, 绑定微信并关注平台微信公众号')
            } else if (!newV.is_subscribe_mp) {
              this.showGZH = true
            }
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus">
  .account-bind
    .wrapper
      margin 0 20px
      .form-item
        display flex
        align-items center
        padding-bottom 20px
        margin-bottom 20px
        border-bottom 1px dashed #dcdcdc
        .label
          width 60px
          margin-right 40px
        .content
          width 300px
        .el-button
          width 80px
          margin-left 30px
      .card
        .tip
          margin-left 30px
      .dialog
        .el-input
          width 250px
        .verify
          .el-input
            width 150px
            margin-right 10px
    .dialog-GZH
      text-align center
</style>
