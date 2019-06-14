<template lang='pug'>
.project-publish
  .type-title {{'id' in $route.query ? "更新项目信息": "项目发布"}}
  .wrapper

    .form
      el-form.form-section(label-width="90px" label-position="left")
        el-form-item(label="项目名:" required)
          el-input(size="small" v-model="opts.project_name" :maxlength='100' placeholder='请输入项目名称')
            i.amount(slot="suffix") {{ opts.project_name.length + '/100'}}

        el-form-item(label="装修风格:" required)
          el-select(size="small" v-model="opts.decoration_style_id")
            el-option(v-for="item in decorationStyles" :label="item.name" :value="item.id" :key="item.id")

        el-form-item(label="建筑面积:")
          el-input(size="small" v-model="opts.floorage" type='number' placeholder='请输入建筑面积')
            span(slot='suffix') 平

        el-form-item(label="项目房型:")
          .item-wrap
            .item
                el-input-number(size="small" v-model='opts.room_count' :min="0" label="描述文字")
                span.unit 室
                el-input-number(size="small" v-model='opts.hall_count' :min="0" label="描述文字")
                span.unit 厅
            .item
              el-input-number(size="small" v-model='opts.bathroom_count' :min="0" label="描述文字")
              span.unit 卫

        el-form-item(label="项目负责人:")
            el-input(size="small" v-model="opts.contact_name" placeholder='请输入负责人姓名')

        el-form-item(label="负责人电话:")
          el-input(size="small" v-model="opts.contact_phone" placeholder='请输入负责人电话')

        el-form-item(label="所属地区:")
          el-cascader(:options="cityData" expand-trigger="hover" @change='selectArea' ref='areaSelector'
          v-model="selectedArea" size="small")

        el-form-item(label="项目地址:")
          el-input(size="small" v-model="opts.address"  placeholder='请输入项目地址')

      el-collapse()
        el-collapse-item(title="选填项目")

          el-form.form-section(label-width="75px" label-position="left")

            el-form-item(label="装修总价:")
              el-input(size="small" v-model="opts.total_price" placeholder='请输入装修总价')
                span(slot='suffix') 万

            el-form-item(label="作品分类:")
              el-select(size="small" v-model="opts.cate_id")
                el-option(v-for="item in panoPictureCate" :label="item.name" :value="item.cate_id" :key="item.cate_id")

            el-form-item(label="是否公开:")
              el-radio(v-model="opts.ison" :label='1') 公开
              el-radio(v-model="opts.ison" :label='2') 私密

            el-form-item(label="作品行业:")
              el-select(size="small" v-model="opts.trade")
                el-option(v-for="item in panoTradeCate" :label="item.tagname" :value="item.tagname" :key="item.tagid")

            el-form-item(label="作品标签:")
              .tag-content
                el-tag(v-for="tag in selectedTags" :key="tag" size="small") {{tag}}
                el-button.el-icon-edit(@click="showTagSelect" size="mini" type="success" plain) 添加标签

    .submit.mb30
      el-button(type="primary" size="mini" @click="submit" :disabled="!checked") 保 存
      el-checkbox(v-model="checked")
      span.accept 我已阅读并同意
        span.agreement(@click="$vgo.emit('showDialogModal', {name: 'agreement', data: 1})") {{`《${platformName}用户协议》`}}

</template>

<script>
import cityData from '@/mixins/city-data.js'
import uploadMixin from '@/mixins/upload'
import { mapGetters } from 'vuex'

export default {
  name: 'project-publish',
  mixins: [cityData, uploadMixin],
  data () {
    return {
      platformName: window.$globalconfig.PLATFORM_NAME,
      checked: true,
      selectedArea: [],
      selectedTags: [],
      opts: {
        id: '',
        project_name: '',
        contact_name: '',
        contact_phone: '',
        cate_id: 0,
        ison: 1,
        tag_id: '',
        trade: '',
        logo_url: '',
        province: '',
        province_id: '',
        city: '',
        city_id: '',
        area: '',
        area_id: '',
        address: '',
        room_count: 1,
        hall_count: 1,
        bathroom_count: 1,
        floorage: '',
        total_price: '',
        decoration_style_id: ''
      }
    }
  },
  created () {
    this.opts = {
      id: '',
      project_name: '',
      contact_name: '',
      contact_phone: '',
      cate_id: 0,
      ison: 1,
      tag_id: '',
      trade: '',
      logo_url: '',
      province: '',
      province_id: '',
      city: '',
      city_id: '',
      area: '',
      area_id: '',
      address: '',
      room_count: '',
      hall_count: '',
      bathroom_count: '',
      floorage: '',
      total_price: '',
      decoration_style_id: ''
    }
    this.$store.dispatch('getPanoPictureCate')
    if ('id' in this.$route.query) {
      this.opts = this.$route.query
      this.opts.ison = Number(this.opts.ison)
      this.selectedTags = this.opts.tag_id.split(',')
      this.selectedArea = [this.opts.province_id, this.opts.city_id, this.opts.area_id]
    } else {
      this.getAddr() // 定位取址
      this.$watch('decorationStyles', {
        handler (newV, oldV) {
          if (newV.length) {
            this.opts.decoration_style_id = newV[0].id
            this.decoration_style_text = newV[0].name
          }
        },
        immediate: true
      })
    }
  },
  mounted () {
    this.$vgo.on('publishPanoTag', data => {
      this.selectedTags = data
      this.opts.tag_id = this.selectedTags.join(',')
    })
  },
  computed: {
    ...mapGetters(['panoTradeCate', 'panoPictureCate', 'decorationStyles'])
  },
  methods: {
    async getAddr () {
      let addr = this.$cookie.getJSON('address')
      if (!addr) {
        let addrInfo = await this.$vgo.getAddress()
        if (addrInfo) this.setAddrCookie(addrInfo.addressComponent)
        addr = this.$cookie.getJSON('address') || {}
      }
      this.opts.area = addr.area
      this.opts.area_id = addr.areaId
      this.opts.city = addr.city
      this.opts.city_id = addr.cityId
      this.opts.province = addr.province
      this.opts.province_id = addr.provinceId
      console.log(addr)
      this.selectedArea = [addr.provinceId, addr.cityId, addr.areaId]
      console.log(this.selectedArea)
    },
    setAddrCookie (AMapAddr) {
      if (!AMapAddr) return
      let address = {
        province: AMapAddr.province,
        city: AMapAddr.city || AMapAddr.province,
        area: AMapAddr.district,
        provinceId: AMapAddr.adcode.slice(0, 2) + '0000',
        cityId: AMapAddr.adcode.slice(0, 4) + '00',
        areaId: AMapAddr.adcode
      }
      this.$cookie.set('address', address)
    },
    selectArea () {
      this.opts.province = this.$refs.areaSelector.currentLabels[0]
      this.opts.province_id = this.selectedArea[0]
      this.opts.city = this.$refs.areaSelector.currentLabels[1]
      this.opts.city_id = this.selectedArea[1]
      this.opts.area = this.$refs.areaSelector.currentLabels[2]
      this.opts.area_id = this.selectedArea[2]
    },
    submit () {
      if (!this.opts.project_name) {
        this.$vgo.tip('请填写项目名称!', 'warning')
        return
      }
      if (!this.opts.area_id) {
        this.$vgo.tip('请选择地址!', 'warning')
        return
      }
      let opts = JSON.parse(JSON.stringify(this.opts))
      opts.tag_id = opts.tag_id || '热门标签,室内,高清'
      let api = opts.id ? 'updateProject' : 'createProject'
      this.$api[api](opts).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        opts.id = data
        api === 'updateProject' ? this.$router.go(-1) : this.$router.push({name: 'panorama-publish', query: opts})
      })
    },
    showTagSelect () {
      this.$vgo.emit('showDialogModal', { name: 'panoTagSelector', data: { type: 'publishPanoTag', tags: this.selectedTags } })
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/style/index"
$W = 220px

.project-publish
  min-height 100%
  .wrapper
    .form
      width 100%
      display flex
      justify-content center
      .el-collapse
        border-bottom none
        .el-collapse-item
          min-width 450px
      .form-section
        margin-right 60px
        .el-input
          width 300px
        .item-wrap
          display inline-block
          .item
            margin-bottom 10px
            .unit
              margin 0 10px
          .el-input-number
            width 120px
            .el-input
              width 100%
        .tag-content
          width 320px
          display inline-block
          .el-tag:not(:last-child)
            margin-right 15px

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
