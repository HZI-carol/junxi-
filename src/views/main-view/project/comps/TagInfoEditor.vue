<template lang="pug">
.tag-info-modal
  el-dialog(title="编辑标签" :visible.sync="isShow" width='700px')
    .form(v-if='panoCopy.pano_id')
      .type.form-item
        label 选择行业：
        el-select(size="small" v-model="panoCopy.trade")
          el-option(v-for="item in panoTradeCate" :label="item.tagname" :value="item.tagname" :key="item.tagid")
      .tag.form-item
        label 作品标签：
        el-tag(v-for="tag in panoCopy.tag_id" :key="tag" size="small") {{tag}}
        el-button.el-icon-edit(@click="showTagSelect" size="mini" type="success" plain) 添加标签
      .area.form-item
        label 作品地区：
        el-cascader(:options="cityData" size="small" v-model='area'
          @change='selectArea' :props="{value:'label'}" expand-trigger="hover")
      .area.form-item(v-if='panoCopy.area')
        label 当前选择：
        span {{panoCopy.pro +'-'+ panoCopy.city +'-'+ panoCopy.area}}
      .publish-time.form-item
        label 发布时间：
        el-date-picker(size="small" v-model="panoCopy.addtime" type="date"
          value-format="yyyy-MM-dd" placeholder="请选择发布时间")
      .expiration-date.form-item
        label 有效期：
        el-input(size="small" v-model="panoCopy.limitdate" placeholder="请填写整数,不填写代表不过期")
        el-select(size="small" v-model="dateType")
          el-option(:value="0" label="天")
          el-option(:value="1" label="年")
    .dialog-footer(slot='footer')
      el-button(type="primary" @click="submit" size="mini") 保 存
      el-button(size="mini" @click="isShow = false") 取消

</template>

<script>
import cityData from '@/mixins/city-data.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [cityData],
  data () {
    return {
      isShow: false,
      tagSelectIsShow: false,
      dateType: 0,
      area: [],
      pano: {},
      panoCopy: {}
    }
  },
  mounted () {
    this.$vgo.on('updatePanoTag', data => {
      this.panoCopy.tag_id = data
    })
  },
  computed: {
    ...mapGetters(['panoTradeCate'])
  },
  methods: {
    submit () {
      if (!this.panoCopy.tag_id.length) {
        this.$vgo.tip('请添加作品标签!', 'warning')
        return
      }
      if (this.panoCopy.limitdate) {
        if (Number(this.dateType) === 1) {
          this.panoCopy.limitdate = this.panoCopy.limitdate * 365
        }
      }
      this.$vgo.openLoading('.tag-info-modal .el-dialog')
      let obj = JSON.parse(JSON.stringify(this.panoCopy))
      obj.tag_id = obj.tag_id.join(',')
      this.$api.updateUserPanoTagInfo(obj).then(data => {
        this.$store.commit('UPDATE_PANO_PICTURE', { val: this.pano, newVal: this.panoCopy })
        this.$vgo.tip('操作成功!', 'success')
        this.isShow = false
      })
    },
    selectArea (area) {
      this.panoCopy.pro = area[0]
      this.panoCopy.city = area[1]
      this.panoCopy.area = area[2]
    },
    openModal (item) {
      this.area = []
      this.pano = item
      this.panoCopy = JSON.parse(JSON.stringify(item))
      this.panoCopy.limitdate = this.panoCopy.limitdate ? this.panoCopy.limitdate : ''
      this.isShow = true
    },
    showTagSelect () {
      this.$vgo.emit('showDialogModal', { name: 'panoTagSelector', data: { type: 'updatePanoTag', tags: this.panoCopy.tag_id } })
    }
  }
}
</script>

<style lang="stylus">
.tag-info-modal
  .el-dialog
    overflow-x hidden
    .el-dialog__body
      padding 20px
    .form
      padding-top 30px
      .form-item
        margin-bottom 30px
        &>label
          width 80px
          display inline-block
        &>.el-input
          width 250px
          margin-right 10px
        .el-cascader
          .el-input
            width 300px
      .expiration-date
        .el-select
          .el-input
            width 100px
      .tag
        position relative
        .el-tag
          margin-right 15px
        .tags-select
          position absolute
    .save
      margin-left 80px
      width 200px
</style>
