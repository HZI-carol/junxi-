<template lang='pug'>
.pano-publish
  .type-title 全景漫游发布
  .wrapper

    .upload
      el-upload(:action="uploadImgUrl"
      :before-upload='beforePanoUpload'
      ref='elUploadPano'
      :on-success="uploadSuccess"
      :show-file-list='false'
      :data='uploadData'
      :on-progress ='onProgress'
      accept=".jpg,.jpeg"
      multiple drag)
        i.el-icon-upload
        .el-upload__text 将文件拖到此处，或
          em 点击上传
        .el-upload__tip 请上传2:1全景图仅支持JPG、JPEG格式, 大小不超过100MB

    //- 上传列表
    transition-group.upload-img(name='upload-fade')
      .item(v-for='(item, index) in panoCache' :key='item.uid || item.id')
        .item-wrap
          .del.el-icon-delete(@click='delCache(item, index)' v-show='"id" in item')
          .name.omit {{item.title}}
          img(:src='item.full_thumb_image_url')
          el-progress.pac(v-if="item.uid && (item.uid in uploadProgress)" type="circle" color="#13ce66"
          :percentage="Number(uploadProgress[item.uid])" :width='80')

    .submit.mb30
      el-button(type="primary" size="mini" @click="submit" :disabled="!checked") 发 布
      el-checkbox(v-model="checked")
      span.accept 我已阅读并同意
        span.agreement(@click="$vgo.emit('showDialogModal', {name: 'agreement', data: 1})") {{`《${platformName}用户协议》`}}

  Loading(ref='loading')

</template>

<script>
import uploadMixin from '@/mixins/upload'

export default {
  name: 'panorama-publish',
  mixins: [uploadMixin],
  data () {
    return {
      platformName: window.$globalconfig.PLATFORM_NAME,
      uploadData: {
        action: 'image.user.pano'
      },
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      checked: true,
      panoCache: [],
      projectInfo: {},
      uploadProgress: {}
    }
  },
  created () {
    this.projectInfo = this.$route.query
    this.getPanoCache(true)
  },
  methods: {
    async beforePanoUpload (file) {
      if (file.size / 1024 / 1024 > 100) {
        this.$vgo.tip('大小不超过100MB!', 'warning')
        return Promise.reject(file.size)
      }
      this.$vgo.openLoading()
      let url = await this.toBase64(file)
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = url
        img.onload = () => {
          let imgwarp = img.width / img.height
          if (img.width < 1000) {
            this.$vgo.tip('上传的图片像素必须为大于1000像素!', 'warning')
            this.$vgo.closeLoading()
            return reject(img)
          }
          if (imgwarp < 1.998 || imgwarp > 2.002) {
            this.$vgo.tip('请上传2:1全景图仅支持JPG、JPEG格式!', 'warning')
            this.$vgo.closeLoading()
            return reject(img)
          }
          this.toThumb(img).then(url => {
            this.$vgo.closeLoading()
            this.panoCache.push({
              full_thumb_image_url: url,
              title: file.name.slice(0, file.name.lastIndexOf('.')),
              uid: file.uid
            })
          })
          this.$set(this.uploadProgress, file.uid, 0)
          // 限制同时上传 4个
          let timer = setInterval(() => {
            let index = Object.keys(this.uploadProgress).indexOf(file.uid + '')
            if (index !== -1 && index < 4) {
              clearInterval(timer)
              timer = null
              return resolve()
            }
          }, 500)
        }
      })
    },
    uploadSuccess (res, file, fileList) {
      if (res.code === 100) {
        let data = res.data[0]
        file.name = file.name.slice(0, file.name.lastIndexOf('.'))
        this.$api.uploadPano(data.url, data.thumburl, file.name).then(res => {
          this.$vgo.tip('上传成功!', 'success')
          this.progressOff(file)
        }).catch(() => {
          this.progressOff(file)
        })
      } else {
        this.progressOff(file)
        this.$vgo.tip(res.msg, 'warning')
      }
    },
    onProgress (event, file, fileList) {
      let percentage = file.percentage.toFixed(0)
      if (percentage <= 99) {
        this.uploadProgress[file.uid] = percentage
      }
    },
    progressOff (file) {
      this.$delete(this.uploadProgress, file.uid)
      if (Object.keys(this.uploadProgress).length === 0) {
        this.getPanoCache()
      }
    },
    submit () {
      if (!this.panoCache.length) {
        this.$vgo.tip('请上传全景!', 'fail')
        return
      }
      this.$api.publishPanorama(this.projectInfo).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.$refs.loading.openModal('panos', this.projectInfo.id, data)
        this.panoCache = []
      })
    },
    getPanoCache (isInit = false) {
      this.$api.getPanoUpdateCache().then(data => {
        if (isInit) {
          this.panoCache = data
        } else {
          this.panoCache.map((item, index) => {
            if ('id' in data[index]) {
              this.$set(item, 'id', data[index].id)
            }
          })
        }
      })
    },
    delCache (item, index) {
      this.$vgo.open(() => {
        this.$vgo.openLoading()
        this.$api.delPanoCache(item.id).then(res => {
          this.$vgo.tip('操作成功!', 'success')
          this.panoCache.splice(index, 1)
        })
      })
    },
    toBase64 (file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (res) => {
          resolve(res.target.result) // 图片的src
        }
      })
    },
    toThumb (img) {
      return new Promise((resolve, reject) => {
        // canvas对图片进行缩放
        let originWidth = img.width
        let originHeight = img.height
        // 最大尺寸限制
        let maxWidth = 300
        let maxHeight = 300
        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
          } else {
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
          }
        }
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')
        canvas.width = targetWidth
        canvas.height = targetHeight
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight)
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        // canvas转为blob并上传
        canvas.toBlob(blob => {
          resolve(URL.createObjectURL(blob))
        }, 'image/jpg')
      })
    }
  },
  components: {
    Loading: () => import('./comps/Loading.vue')
  }
}
</script>

<style lang="stylus">
@import "~@/assets/style/index"
$W = 220px

.pano-publish
  min-height 100%
  .wrapper
    .upload
      width 100%
      margin-bottom 20px
      .el-upload
        width 100%
        .el-upload-dragger
          width 100%
      .el-upload-list
        display flex
        flex-wrap wrap
        .el-upload-list__item
          flex 0 0 300px
          margin-right 20px
          img
            width 140px

    .upload-img
      margin-bottom 10px
      .item
        transition all 0.7s
        display inline-block
        padding 0 10px
        margin-bottom 20px
        .item-wrap
          position relative
          border-radius 5px
          overflow hidden
          height 100px
          &:hover
            .del
              opacity 1
          .del
            opacity 0
            cursor pointer
            position absolute
            top 0
            right 0
            width 30px
            height 30px
            color #fff
            line-height 30px
            text-align center
            background-color rgba(#000, 0.5)
            transition all 0.3s
            &:hover
              color red
          .name
            position absolute
            bottom  0
            left 0
            color #fff
            padding 10px 5px 0
            line-height 20px
            height 30px
            width 100%
            font-size 12px
            background-image: linear-gradient( 0deg, rgba(#000, 0.5) 0%, rgba(#000, 0) 100%)
          img
            width 100%
            height 100%
          .el-progress
            position absolute!important
            .el-progress__text
              color #fff
              text-shadow 0 0 3px #000

    .submit
      width 100%
      text-align center
      .el-button
        width 200px
      .el-checkbox
        margin 0 10px 0 100px
      .accept
        display inline-block
        .agreement
          cursor pointer
          color $blue

media-query(".pano-publish .upload-img .item", $W)

.upload-fade-enter, .upload-fade-leave-to
  opacity: 0
  transform: translateY(30px)

.upload-fade-leave-active
  position: absolute

</style>
