<template lang='pug'>
  .personal-info
    .type-title 公司资料
    .wrapper
      .form
        el-form(label-width="80px")
          el-form-item(label="公司名称" required)
            el-input(v-model="opts.company_name" placeholder="请输入公司名称" size='small' clearable :disabled='disabled')
          el-form-item(label="昵称" )
            el-input(v-model="nickname" placeholder="请输入昵称" size='small' clearable :disabled='disabled')
          el-form-item(label="联系人" )
            el-input(v-model="opts.contact_name" placeholder="请输入联系人姓名" size='small' clearable :disabled='disabled')
          el-form-item(label="联系电话" )
            el-input(v-model="opts.contact_phone" placeholder="请输入联系电话" size='small' clearable :disabled='disabled')
          el-form-item(label="公司地址" required)
            el-cascader(:options="cityData" v-model="area" @change='setArea' ref='areaSelector'
            size="small" expand-trigger="hover" :disabled='disabled')
          el-form-item(label="详细地址" )
            el-input(v-model="opts.address" placeholder="请输入详细地址" size='small' clearable :disabled='disabled')
          el-form-item(label="官网链接" )
            el-input(v-model="opts.site_url" placeholder="请输入官网链接" size='small' clearable :disabled='disabled')
          el-form-item(label="公司类型" required)
            el-select(v-model="opts.type_id" placeholder="请选择活动区域" size='small' :disabled='disabled')
              el-option(v-for="item in companyTypes" :key="item.id" :label="item.name" :value="item.id")
          el-form-item(label="公司简介")
            el-input(v-model="opts.description" type='textarea' :autosize="{ minRows: 3 }" placeholder="请输入公司简介" size='small' clearable :disabled='disabled')

        el-form(label-width="100px")
          el-form-item.form-logo(label="公司LOGO")
            el-upload(:action="uploadImgUrl" :before-upload='mixinBeforeUpload' :disabled='disabled'
              :on-success="uploadSuccessLogo" :show-file-list="false" :data='uploadDataLogo' accept="image/*")
              i.el-icon-plus.pac(:class="{'hover-show': opts.full_logo}")
              img.logo(v-if="opts.full_logo" :src="opts.full_logo")

          el-form-item.form-qrcode(label="微信二维码" )
            el-upload(:action="uploadImgUrl" :before-upload='mixinBeforeUpload' :disabled='disabled'
              :on-success="uploadSuccessQrcode" :show-file-list="false" :data='uploadDataQrcode' accept="image/*")
              i.el-icon-plus.pac(:class="{'hover-show': opts.full_qrcode_url}")
              img.logo(v-if="opts.full_qrcode_url" :src="opts.full_qrcode_url")

          el-form-item.form-license(label="公司资质" )
            el-upload(:action="uploadImgUrl" :before-upload='mixinBeforeUpload' :disabled='disabled'
              :on-success="uploadSuccessLicense" :show-file-list="false" :data='uploadDataLicense' accept="image/*")
              i.el-icon-plus.pac(:class="{'hover-show': opts.full_license_image_url}")
              img.logo(v-if="opts.full_license_image_url" :src="opts.full_license_image_url")
      .submit(v-if="!disabled")
        el-button(type='primary' size='mini' @click='submit') 保存
</template>

<script>
import cityData from '@/mixins/city-data.js'
import uploadMixin from '@/mixins/upload'
import { mapGetters } from 'vuex'
export default {
  mixins: [cityData, uploadMixin],
  data () {
    return {
      disabled: true,
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      uploadDataLogo: { action: 'user.zaigou.company.logo' },
      uploadDataQrcode: { action: 'user.zaigou.company.qrcode' },
      uploadDataLicense: { action: 'user.zaigou.company.businesslicense' },
      area: [],
      opts: {
        company_name: '',
        nickname: '',
        type_id: '',
        contact_name: '',
        contact_phone: '',
        area: '',
        area_id: '',
        city: '',
        city_id: '',
        address: '',
        province_id: '',
        province: '',
        logo: '',
        full_logo: '',
        qrcode_url: '',
        full_qrcode_url: '',
        license_image_url: '',
        full_license_image_url: '',
        description: '',
        site_url: ''
      },
      nickname: ''
    }
  },
  computed: {
    ...mapGetters(['companyInfo', 'companyTypes', 'userInfo']),
    getData () {
      if (this.companyTypes[0] !== -1 && typeof this.opts.type_id === 'number') {
        return 1
      }
      return 0
    }
  },
  methods: {
    setArea () {
      let arr = this.$refs.areaSelector.currentValue
      let arr1 = this.$refs.areaSelector.currentLabels
      this.opts.province_id = arr[0]
      this.opts.city_id = arr[1]
      this.opts.area_id = arr[2]
      this.opts.province = arr1[0]
      this.opts.city = arr1[1]
      this.opts.area = arr1[2]
    },
    uploadSuccessLogo (res) {
      if (res.code === 100) {
        this.opts.logo = res.data[0].url
        this.opts.full_logo = res.data[0].fullurl
        this.$vgo.tip('上传成功!', 'success')
      } else {
        this.$vgo.tip('上传失败!', 'warning')
      }
      this.$vgo.closeLoading()
    },
    uploadSuccessQrcode (res) {
      if (res.code === 100) {
        this.opts.qrcode_url = res.data[0].url
        this.opts.full_qrcode_url = res.data[0].fullurl
        this.$vgo.tip('上传成功!', 'success')
      } else {
        this.$vgo.tip('上传失败!', 'warning')
      }
      this.$vgo.closeLoading()
    },
    uploadSuccessLicense (res) {
      if (res.code === 100) {
        this.opts.license_image_url = res.data[0].url
        this.opts.full_license_image_url = res.data[0].fullurl
        this.$vgo.tip('上传成功!', 'success')
      } else {
        this.$vgo.tip('上传失败!', 'warning')
      }
      this.$vgo.closeLoading()
    },
    submit () {
      if (!this.opts.company_name) {
        this.$vgo.tip('请填写公司名称!', 'fail')
        return
      }
      if (this.opts.type_id === '') {
        this.$vgo.tip('请选择公司类型!', 'fail')
        return
      }
      if (!this.opts.area_id) {
        this.$vgo.tip('请选择地址!', 'fail')
        return
      }
      let api = 'user_id' in this.opts ? 'updateCompanyInfo' : 'addCompanyInfo'
      this.opts.nickname = this.nickname
      this.$api[api](this.opts).then(data => {
        this.$store.dispatch('getUserInfo')
        this.$vgo.tip('操作成功!', 'success')
        this.$store.dispatch('getCompanyInfo')
      })
    }
  },
  watch: {
    getData: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.companyTypes.map(i => {
            if (i.id === Number(this.opts.type_id)) this.typeName = i.name
          })
        }
      },
      immediate: true
    },
    companyInfo: {
      handler (newValue, oldValue) {
        if (Object.keys(newValue).length) {
          this.opts = JSON.parse(JSON.stringify(newValue))
          this.area = [this.opts.province_id, this.opts.city_id, this.opts.area_id]
        }
      },
      immediate: true
    },
    userInfo: {
      handler (newValue, oldValue) {
        if (newValue) {
          this.nickname = newValue.nickname
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="stylus">
.personal-info
  .wrapper
    margin 0 20px
    .form
      display flex
      .el-input
        width 300px
      .el-upload
        width 120px
        height 120px
        border 1px dashed #999
        border-radius 10px
        overflow hidden
        position relative
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
      .form-logo
        .el-upload
          width 240px
      .form-license
        .el-upload
          width 150px
          height 200px
    .submit
      margin-left 90px
      .el-button
        width 200px
</style>
