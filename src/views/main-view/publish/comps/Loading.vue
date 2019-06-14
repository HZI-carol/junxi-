<template lang="pug">
.publish-loading-page(v-if='isShow')
  .content
    el-progress(:text-inside="true" :stroke-width="18" :percentage="percentage" status="success")
    .text 作品正在云端处理, 预计需要3~10分钟, 请耐心等待, 该页面会自动跳转...

</template>

<script>
export default {
  data () {
    return {
      isShow: false,
      panoId: '',
      projectId: '',
      type: '',
      defaultGroup: ['毛坯', '效果图', '水电', '木工', '泥工', '实景'],
      percentage: 1
    }
  },
  methods: {
    openModal (type, projectId, panoId) {
      this.isShow = true
      this.projectId = projectId
      this.panoId = panoId
      this.type = type
      this.getStatus()
    },
    getStatus () {
      let nextProgress, serverProgress, cur, total
      this.timer = setInterval(() => {
        this.$api.checkPublishStatus(this.type, this.panoId).then(data => {
          cur = data.created_count
          total = data.total_count
          serverProgress = Number((cur / total).toFixed(2)) * 100
          if (serverProgress < 100) {
            nextProgress = Number(((cur + 1) / total).toFixed(2)) * 100
          }
          if (this.percentage < (nextProgress - 3)) {
            this.percentage += 1
          }
          if (this.percentage < serverProgress) {
            this.percentage = serverProgress
          }
          if (Number(serverProgress) === 100) {
            this.$api.projectConnectPano(this.projectId, this.panoId).then(data => { })
            // 给客户默认生成6个分组
            this.defaultGroup.map(item => {
              this.$api.addPanoSceneGroup(this.panoId, item).then(data => { })
            })
            let url = window.$globalconfig.URLS.PANO_EDITOR_PREFIX
            window.location.href = url + this.panoId

            setTimeout(() => {
              this.percentage = 0
              clearInterval(this.timer)
              this.timer = null
              this.isShow = false
            }, 2000)
          }
        })
      }, 3000)
    }
  }
}
</script>

<style lang="stylus">
.publish-loading-page
  position fixed
  z-index 999
  left 0
  top 0
  width 100vw
  height 100vh
  background-color rgba(#000, 0.7)
  .content
    position fixed
    left 50%
    top 50%
    width 50vw
    text-align center
    transform translate(-50%, -50%)
    .el-progress
      padding-top 10px
    .text
      margin-top 30px
      color #fff
</style>
