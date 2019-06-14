<template lang='pug'>
  .personal-info
    .type-title 个人资料
    .wrapper
      .form
        .form-item.avatar
          label 头 像
          .upload
            el-upload.pr(:action="uploadImgUrl"
              :before-upload='mixinBeforeUpload'
              :on-success="uploadSuccess"
              :show-file-list="false"
              :data='uploadData'
              accept="image/*")
              img.logo(v-if="userInfoCopy.avatar" :src="userInfoCopy.avatar")
              i.el-icon-plus.pac(:class="{'hover-show': userInfoCopy.avatar}")

        .form-item.nackname
          label 昵 称
          el-input(v-model="userInfoCopy.nickname" size="small" placeholder="请输入昵称" clearable)
        .form-item.combo
          label 套 餐
          span {{userInfoCopy.packagename}}
        .form-item.tag.select-none
          label 行业标签
          el-select(v-model="userInfoCopy.tag" multiple placeholder="请选择行业标签" size="small")
            el-option(v-for="item in tradeCate" :key="item.tagid"
              :label="item.tagname" :value="item.tagname")
        .form-item.deadline
          label 过期时间
          span {{userInfoCopy.overtdt | dateFormat('date')}}
        .form-item.tel
          label 联系电话
          el-input(v-model="userInfoCopy.tel" size="small" placeholder="请输入联系电话" clearable)
        .form-item.qq
          label Q Q
          el-input(v-model="userInfoCopy.qq" size="small" placeholder="请输入qq号码" clearable)
        .form-item.area
          label 居住城市
          el-cascader(:options="cityData" v-model="area" @change='setArea' ref='areaSelector'
            size="small" expand-trigger="hover" )
          span 当前: {{userInfoCopy.areatext}}
        .form-item.desc
          label 简 介
          el-input(v-model="userInfoCopy.dec" type="textarea" placeholder="请输入简介" clearable)
      .submit.mb20
        el-button(@click="submit" type="primary" size="mini") 保 存

</template>

<script>
import cityData from '@/mixins/city-data.js'
import uploadMixin from '@/mixins/upload'
import { mapGetters } from 'vuex'
export default {
  mixins: [cityData, uploadMixin],
  data () {
    return {
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      uploadData: {
        action: 'image.user.avatar'
      },
      avatarFile: null,
      area: [],
      userInfoCopy: {}
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'tradeCate'])
  },
  methods: {
    uploadSuccess (res, file, fileList) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.userInfoCopy.avatar = res.data[0].fullurl
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    setArea () {
      this.userInfoCopy.areatext = this.$refs.areaSelector.currentLabels.join('')
    },
    submit () {
      if (!this.userInfoCopy.nickname) {
        this.$vgo.tip('请填写昵称!', 'warning')
        return
      }
      let obj = JSON.parse(JSON.stringify(this.userInfoCopy))
      obj.tag = obj.tag.join(',')
      if (this.area.length) {
        obj.area = this.area[2]
      }
      this.$api.upateUserInfo(obj).then(res => {
        this.$vgo.tip('操作成功!', 'success')
        this.$store.commit('SAVE_USER_INFO', obj)
      })
    }
  },
  watch: {
    userInfo: {
      handler (val) {
        if (val.user_id) {
          this.userInfoCopy = JSON.parse(JSON.stringify(val))
          this.userInfoCopy.tag = this.userInfoCopy.tag ? this.userInfoCopy.tag.split(',') : []
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
      .form-item
        display flex
        align-items center
        margin-bottom 20px
        label:first-child
          width 70px
          margin-right 10px
        .el-input
          width 300px
        .el-textarea
          width 500px
          textarea
            min-height 100px!important
        .el-cascader
          margin-right 10px
      .avatar
        .upload
          display inline-block
          width 150px
          .el-upload
            width 150px
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
      margin-left 90px
      .el-button
        width 200px
</style>
