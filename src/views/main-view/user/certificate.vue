<template lang="pug">
  .certificate
    .type-title 实名认证
    .tab-options(v-if='form.rzcert_id')
      .item
        .label 认证状态:
        span(:class='form.status == 4? "green" : "red"') {{form.status_text}}
        el-button(type="primary" @click='isManage = !isManage' size="mini" plain) {{!isManage ? '更新认证' : '取消更新'}}
      .item(v-if='form.status == 3')
        .label 原因:
        span.red {{form.remark}}

    .wrapper
      .form.mt20
        .form-item.name
          .label 姓 名:
          span(v-if='!isManage') {{form.legalman}}
          el-input(v-else v-model="formCopy.legalman" placeholder="请输入姓名" size="small")

        .form-item.tel
          .label 联系电话:
          span(v-if='!isManage') {{form.tel}}
          el-input(v-else v-model="formCopy.tel" placeholder="请输入联系电话" size="small")

        .form-item.auth(v-if='isManage')
          .label 验证码:
          el-input.auth(v-model="formCopy.vcode" placeholder="请输入验证码" size="small")
          el-button(@click='getVerifyCode' size="mini" type="primary" :disabled='!!phoneWait') 获取验证码{{phoneWait || ''}}

        .form-item.IDNumber
          .label 身份证号码:
          span(v-if='!isManage') {{form.cardno}}
          el-input(v-else v-model="formCopy.cardno" placeholder="请输入身份证号码"  size="small")

        .form-item.job
          .label 是否认证装企:
          span(v-if='!isManage') {{form.nature==2 ? '是': '否'}}
          template(v-else)
            el-radio(v-model="formCopy.nature" :label="2") 是
            el-radio(v-model="formCopy.nature" :label="1") 否

        .form-item.IDCard
          .label 身份证正面:
          .upload(v-if='!isManage')
            .el-upload
              img.logo(:src="form.cardfronturl")

          .upload(v-else)
            el-upload.pr(:action="uploadImgUrl"
            :before-upload='mixinBeforeUpload'
            :on-success="uploadSuccess1"
            :data='uploadData'
            :show-file-list="false"
            accept="image/*")
              img.logo(v-if="formCopy.cardfronturl" :src="formCopy.cardfronturl")
              i.el-icon-plus.pac(:class="{'hover-show': formCopy.cardfronturl}")
          .example(v-if='isManage') 示 例:
            img(src="static/images/timg.jpg")

        .form-item.IDCard
          .label 身份证反面:
          .upload(v-if='!isManage')
            .el-upload
              img.logo(:src="form.cardbackurl")

          .upload(v-else)
            el-upload.pr(:action="uploadImgUrl"
            :before-upload='mixinBeforeUpload'
            :on-success="uploadSuccess2"
            :data='uploadData'
            :show-file-list="false"
            accept="image/*")
              img.logo(v-if="formCopy.cardbackurl" :src="formCopy.cardbackurl")
              i.el-icon-plus.pac(:class="{'hover-show': formCopy.cardbackurl}")

      .submit(v-if='isManage')
        el-button(type="primary" @click='submit' size="mini") 提交申请
</template>

<script>
import { mapGetters } from 'vuex'
import uploadMixin from '@/mixins/upload'

export default {
  mixins: [uploadMixin],
  data () {
    return {
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      uploadData: {
        action: 'image.user.idcard'
      },
      phoneWait: 0,
      isManage: false,
      certificateInfo: {},
      formCopy: {
        rzcert_id: '',
        cardfronturl: '',
        cardbackurl: '',
        legalman: '',
        tel: '',
        vcode: '',
        cardno: '',
        nature: 2
      },
      form: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    uploadSuccess1 (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.formCopy.cardfronturl = res.data[0].fullurl
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    uploadSuccess2 (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.formCopy.cardbackurl = res.data[0].fullurl
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    submit () {
      if (this.formCopy.legalman.length <= 1) {
        this.$vgo.tip('请输入真实姓名!', 'warning')
        return
      }
      if (!this.formCopy.cardfronturl || !this.formCopy.cardbackurl) {
        this.$vgo.tip('请上传身份证!', 'warning')
        return
      }
      if (!this.$auth.verifyPhone(this.formCopy.tel)) return
      if (!this.$auth.verifyIDcard(this.formCopy.cardno)) return
      this.$api.addOrUpdateUserCertificateInfo(this.formCopy).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.isManage = false
        this.getCertificateInfo()
      })
    },
    getVerifyCode () {
      this.$auth.getVerifyCode('phoneWait', this.formCopy.tel, this)
    },
    getCertificateInfo () {
      this.$api.getUserCertificateInfo().then(data => {
        this.certificateInfo = data
        for (const key in data) {
          this.$set(this.form, key, data[key])
          this.formCopy[key] = data[key]
        }
      })
    }
  },
  watch: {
    userInfo: {
      handler (val) {
        if (val.rz_status > 1) {
          this.isManage = false
          this.getCertificateInfo()
        } else {
          this.isManage = true
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus">
.certificate
  .type-title
    margin 0
  .wrapper
    margin 0 20px
    .form-item
      display flex
      align-items center
      margin-bottom 20px
      .label
        font-weight 700
        width 90px
        margin-right 20px
        text-align right
      .el-input
        width 280px
      .auth
        width 140px
        margin-right 50px
    .IDCard
      .example
        margin-left 30px
        img
          margin-left 20px
          width 200px
          height 150px
      .upload
        display inline-block
        width 200px
        .el-upload
          width 200px
          height 150px
          border 1px dashed #999
          border-radius 10px
          overflow hidden
          &:hover
            .el-icon-plus.hover-show
              opacity 0.5
              color #fff
          .logo
            width 100%
            height 100%
          .el-icon-plus
            font-size 60px
            &.hover-show
              opacity 0
    .submit
      margin-left 110px
      margin-top 30px
      .el-button
        width 180px
</style>
