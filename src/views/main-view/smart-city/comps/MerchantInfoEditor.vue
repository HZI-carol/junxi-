<template lang="pug">
.merchant-info-editor-modal
  el-dialog(title="商户信息编辑" :visible.sync="isShow" width='1100px' center :close-on-click-modal='false')
    .dialog-content(ref='scroll' v-if='')
      .item.mt20
        .item-label 商户名称:
        el-input(v-model='info.name' size='small' placeholder='请输入商户名称' clearable)
        .required *
      .item
        .item-label 商户分类:
        el-select(v-model="info.type_id" placeholder="请选择" size='small' clearable)
          el-option(v-for="item in merchantType"
            :key="item.id" :label="item.name" :value="item.id")
        .required *
      .item
        .item-label 联系电话:
        el-input(v-model='info.telephone' size='small' placeholder='请输入联系电话' clearable)
      .item
        .item-label 手机号码:
        el-input(v-model='info.phone' size='small' placeholder='请输入手机号码' clearable)
      .item
        .item-label 商户LOGO:
        .upload-logo.upload
          el-upload.pr(:action="uploadImgUrl"
            :before-upload='mixinBeforeUpload'
            :on-success="uploadLogoSuccess"
            :show-file-list="false"
            :data='uploadLogoData'
            accept="image/*")
            img.upload-img(v-if="info.full_logourl" :src="info.full_logourl")
            i.el-icon-plus.pac(:class="{'hover-show': info.full_logourl}")
          .tip 上传的图片分辨率不能大于180*180像素
      .item
        .item-label 公众号二维码:
        .upload-qrcode.upload
          el-upload.pr(:action="uploadImgUrl"
            :before-upload='mixinBeforeUpload'
            :on-success="uploadQrcodeSuccess"
            :show-file-list="false"
            :data='uploadQrcodeData'
            accept="image/*")
            img.upload-img(v-if="info.full_qrcodeurl" :src="info.full_qrcodeurl")
            i.el-icon-plus.pac(:class="{'hover-show': info.full_qrcodeurl}")
          .tip 上传的图片分辨率不能大于300*300像素
      .item
        .item-label Banner图片:
        .upload-banner.upload
          el-upload.pr(:action="uploadImgUrl"
            :before-upload='mixinBeforeUpload'
            :on-success="uploadBannerSuccess"
            :show-file-list="false"
            :data='uploadBannerData'
            accept="image/*")
            img.upload-img(v-if="info.full_bannerurl" :src="info.full_bannerurl")
            i.el-icon-plus.pac(:class="{'hover-show': info.full_bannerurl}")
          .tip 上传的图片分辨率不能大于900*450像素*300像素
      .item
        .item-label 全景地址:
        .item-content
          .pano-addr
            el-input(v-model='info.panourl' size='small' placeholder='url地址(以https://开头有效)' clearable)
          .iframe(v-if='info.panourl')
            iframe(:src='info.panourl' width='800' height='400')
            a(:href='info.panourl' target='_blank')
              el-button(type='primary' size='small') 在新窗口中打开
      .item
        .item-label 所属城市:
        el-cascader(expand-trigger="hover" :options="options" size='small' placeholder='请选择城市'
          v-model="selectedCityId" @change="handleCityChange" ref='cascaderAddr' clearable)
        .required *
        el-cascader.el-cascader-area(expand-trigger="hover" v-if='selectedCityId[1]' :options="areaOfCity[selectedCityId[1]]" size='small' placeholder='请选择地区'
          v-model="selectedAreaId" @change="handleAreaChange" ref='cascaderAddr' clearable)
      .item
        .item-label 详情地址:
        el-input.address(v-model='info.address' size='small' placeholder='请输入详情地址' clearable)
        .required *
        el-button(type='primary' @click='addrToLatitude' size='mini') 搜索
      .item
        .item-label 经纬度:
        el-input.location(v-model='info.location_lat' size='small' placeholder='请输入经度' clearable)
        el-input.location(v-model='info.location_lng' size='small' placeholder='请输入纬度' clearable)
        .required *
      .item
        .item-label 地图选址:
        #mapContainer(ref='map')
      .item
        .item-label 营业时间:
          //- :value='[info.start_opentime, info.end_opentime]'
        el-time-picker(v-model="openTimeRange" is-range range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
          size='small' value-format="HH:mm" format="HH:mm")
        .required *
      .item
        .item-label 商户简介:
        el-input(v-model='info.description' type='textarea' placeholder='请输入详情地址' clearable)
        .required *
    .dialog-footer(slot='footer')
      .options
        el-button(size="small"  @click="isShow = false") 取 消
        el-button(type="primary" size="small" @click="submit") 确 定
</template>

<script>
import cityData from '@/mixins/city-data'
import uploadMixin from '@/mixins/upload'

export default {
  mixins: [cityData, uploadMixin],
  data () {
    return {
      info: {},
      uploadImgUrl: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
      apiUrl: window.$globalconfig.URLS.API,
      uploadLogoData: {
        action: 'user.scity.merchant.logo'
      },
      uploadQrcodeData: {
        action: 'user.scity.merchant.qrcode'
      },
      uploadBannerData: {
        action: 'user.scity.merchant.banner'
      },
      options: [],
      selectedCityId: [],
      selectedAreaId: [],
      selectedCity: [],
      selectedArea: [],
      openTimeRange: ['00:00', '23:59'],
      cityDataProps: {
        value: 'label',
        children: 'children'
      },
      areaOfCity: {},
      selectedPoint: [121.5273285, 31.21515044],
      isShow: false,
      merchantType: [],
      AMap: {
        map: null,
        maker: null,
        geocoder: null,
        geolocation: null
      }
    }
  },
  methods: {
    handleCityChange (value) {
      this.selectedCity = this.$refs.cascaderAddr.currentLabels
    },
    handleAreaChange (value) {
      this.selectedArea = this.$refs.cascaderAddr.currentLabels
    },
    uploadLogoSuccess (res, file, fileList) {
      this.handleRes(res, 'logourl')
    },
    uploadQrcodeSuccess (res, file, fileList) {
      this.handleRes(res, 'qrcodeurl')
    },
    uploadBannerSuccess (res, file, fileList) {
      this.handleRes(res, 'bannerurl')
    },
    handleRes (res, type) {
      if (res.code === 100) {
        this.$vgo.tip('上传成功!', 'success')
        this.$set(this.info, 'full_' + type, res.data[0].fullurl)
        this.$set(this.info, type, res.data[0].url)
      } else {
        this.$vgo.tip(res.msg, 'warning')
      }
      this.$vgo.closeLoading()
    },
    openModal (item = {}) {
      this.info = {}
      this.isShow = true
      if (!this.merchantType.length) {
        this.getOpenCity()
        this.$api.getSmartCityMerchantCate().then(data => {
          this.merchantType = data
        })
      }
      if ('id' in item) {
        this.$vgo.openLoading('.el-dialog')
        this.$api.getSmartCityMerchantInfo(item.id).then(data => {
          this.info = data
          this.selectedCityId = [this.info.province_id, this.info.city_id]
          this.selectedAreaId = [this.info.area_id]
          if (this.info.start_opentime && this.info.end_opentime) {
            this.openTimeRange = [this.info.start_opentime, this.info.end_opentime]
          }
          this.initModal()
        })
      } else {
        this.info = {}
        this.initModal()
      }
    },
    initModal () {
      this.$nextTick(() => {
        if (this.$refs.scroll) this.$refs.scroll.scrollTop = 0
        this.initMap()
      })
    },
    initMap () {
      if (!this.$refs.map) {
        setTimeout(() => this.initMap(), 200)
      } else {
        if (this.AMap.map && this.AMap.map.loaded) {
          this.getLoctionOrAddrToloction()
        }
        if (!this.AMap.map) {
          this.AMap.map = new window.AMap.Map('mapContainer', {
            resizeEnable: true
          })
          // 地址转坐标
          window.AMap.plugin(['AMap.Geolocation', 'AMap.Geocoder'], () => {
            this.AMap.geocoder = new window.AMap.Geocoder()
            this.AMap.geolocation = new window.AMap.Geolocation({
              enableHighAccuracy: true, // 是否使用高精度定位，默认:true
              timeout: 10000, // 超过10秒后停止定位，默认：5s
              buttonPosition: 'RB', // 定位按钮的停靠位置
              buttonOffset: new window.AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: false // 定位成功后是否自动调整地图视野到定位点
            })
            this.AMap.map.addControl(this.AMap.geolocation)
          })
          this.AMap.marker = new window.AMap.Marker() // 添加标记点
          this.AMap.map.add(this.AMap.marker)
          this.AMap.map.setZoom(14)
          // 为地图注册click事件获取鼠标点击出的经纬度坐标
          this.AMap.map.on('click', (e) => {
            let position = e.lnglat
            this.$set(this.info, 'location_lat', position.lat)
            this.$set(this.info, 'location_lng', position.lng)
            this.AMap.geocoder.getAddress(position, (status, result) => {
              if (status === 'complete' && result.regeocode) {
                this.$set(this.info, 'address', result.regeocode.formattedAddress)
              } else { console.log('点击获取经纬 添加地图点失败:', result) }
            })
            this.AMap.marker.setPosition([position.lng, position.lat]) // 更新点标记位置
          })
          // MAP load complete
          this.AMap.map.on('complete', () => {
            this.getLoctionOrAddrToloction()
          })
        }
      }
    },
    getLoctionOrAddrToloction () {
      if ('id' in this.info) { // 更新
        // 地址转经纬
        this.addrToLatitude()
      } else { // 新增
        this.getLoction()
      }
    },
    // 高德地图地址转经纬
    addrToLatitude () {
      if (!this.info.address) return
      this.AMap.geocoder.getLocation(this.info.address, (status, result) => {
        if (status === 'complete' && result.geocodes.length) {
          let position = result.geocodes[0].location
          this.info.location_lng = position.lng
          this.info.location_lat = position.lat
          this.AMap.marker.setPosition([position.lng, position.lat]) // 更新点标记位置
          this.AMap.map.setZoomAndCenter(14, [position.lng, position.lat])
        } else { console.log('地址转经纬 添加地图点失败:', result) }
      })
    },
    // 高德地图获取经纬度
    getLoction () {
      this.AMap.geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          let position = result.position
          this.AMap.marker.setPosition([position.lng, position.lat]) // 更新点标记位置
        } else { console.log('获取经纬度, 添加地图点失败:', result) }
      })
    },
    getOpenCity () {
      this.$api.getSmartCityOpenRegions().then(data => {
        // 筛选开通 省份
        data.map(pro => {
          this.cityData.map(item => {
            if (Number(item.value) === Number(pro[0].province_id)) {
              let cityObj = { value: item.value, label: item.label, children: [] }
              // 筛选开通 城市
              pro.map(city => {
                item.children.map(i => {
                  if (Number(i.value) === Number(city.city_id)) {
                    this.$set(this.areaOfCity, city.city_id, i.children)
                    delete i.children
                    cityObj.children.push(i)
                  }
                })
              })
              this.options.push(cityObj)
            }
          })
        })
      })
    },
    submit () {
      this.info.start_opentime = this.openTimeRange[0]
      this.info.end_opentime = this.openTimeRange[1]
      this.info.province_id = this.selectedCityId[0]
      this.info.city_id = this.selectedCityId[1]
      this.info.area_id = this.selectedAreaId[0] ? this.selectedAreaId[0] : ''

      this.info.province = this.selectedCity[0]
      this.info.city = this.selectedCity[1]
      this.info.area = this.selectedAreaId[0] ? this.selectedArea[0] : ''

      if (this.validate()) {
        this.$vgo.openLoading('.el-dialog')
        this.$api.setOrUpdateSmartCityMerchantInfo(this.info).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.isShow = false
          this.$store.dispatch('getSmartCityMerchantList')
        })
      }
    },
    validate () {
      // let reTel = /^0\d{2,3}-?\d{7,8}$/g
      // let rePhone = /^1[34578]\d{9}$/g
      // let testTel = reTel.test(this.info.telephone)
      // let testPhone = rePhone.test(this.info.phone)
      if (this.info.name.length < 2) {
        this.$vgo.tip('商户名称太短!', 'warning')
        return
      }
      if (!this.info.type_id) {
        this.$vgo.tip('请选择分类!', 'warning')
        return
      }

      // if (!this.info.telephone && !this.info.phone) {
      //   this.$vgo.tip('手机号码和固话号码至少填一项!', 'warning')
      //   return
      // }else if (!this.info.phone && !testTel) {
      //   this.$vgo.tip('固话号码格式有误!', 'warning')
      //   return
      // }else if (!this.info.telephone && !testPhone) {
      //   this.$vgo.tip('手机号码格式有误!', 'warning')
      //   return
      // }else if (this.info.telephone && this.info.phone) {
      //   if (!testTel || !testPhone) {
      //     this.$vgo.tip('手机号码或固话号码格式有误!', 'warning')
      //     return
      //   }
      // }
      if (!this.info.start_opentime.length || !this.info.end_opentime.length) {
        this.$vgo.tip('未择营业时间!', 'warning')
        return
      }
      if (!this.info.city_id) {
        this.$vgo.tip('请选择城市!', 'warning')
        return
      }
      if (this.info.address.length < 2) {
        this.$vgo.tip('请填写详细地址!', 'warning')
        return
      }
      if (!this.info.description) {
        this.$vgo.tip('简介不能为空!', 'warning')
        return
      }
      if (!this.info.full_logourl) {
        this.$vgo.tip('未上传图标!', 'warning')
        return
      }
      if (!this.info.full_qrcodeurl) {
        this.$vgo.tip('未上传二维码!', 'warning')
        return
      }
      if (this.info.panourl && !this.$auth.verifyUrl(this.info.panourl, 'https')) return
      if (!this.info.full_bannerurl) {
        this.$vgo.tip('未上传图片!', 'warning')
        return
      }
      return true
    }
  }
}
</script>

<style lang="stylus">
.merchant-info-editor-modal
  .el-dialog
    overflow-x hidden
    overflow-y auto
    .el-dialog__header,.el-dialog__footer
      width 100%
      z-index 999
    .el-dialog__footer
      bottom 0
      left 0
    .el-dialog__body
      .dialog-content
        height 600px
        .item
          margin-bottom 20px
          line-height 32px
          .item-label
            display inline-block
            margin 0 10px
            text-align right
            font-weight 700
            width 100px
            line-height 32px
            vertical-align top
          .required
            font-size 20px
            color red
            vertical-align middle
            display inline-block
            margin-right 10px
          .el-input
            width 250px
            margin-right 10px
          .el-date-editor
            margin-right 10px
          .address
            width 400px
          .el-textarea
            margin-right 10px
            width 500px
          .el-cascader
            .el-input
              width 300px
            &.el-cascader-area
              .el-input
                width 200px
          .list
            margin-right 10px
          .upload-img
            border 1px solid #ddd
          .qrcode
            width 150px
            height 150px

          .item-content
              display inline-block
            .pano-addr
              margin-bottom 10px
              .el-input
                width 400px
            .iframe
              position relative
              a
                position absolute
                top 0
                right 0
          .upload
            display inline-block
            &.upload-banner
              H = 600px
              width H
              .el-upload
                width 100%
                height H*0.5
            .tip
              text-align center
              line-height 20px
              color red
            .el-upload
              width 150px
              height 150px
              border 1px dashed #999
              border-radius 10px
              overflow hidden
              position relative
              &:hover
                .el-icon-plus.hover-show
                  opacity 1
              .upload-img
                width 100%
                height 100%
              .el-icon-plus
                font-size 60px
                color #999
                text-shadow 0 0 20px rgba(255, 255, 255, 0.8)
                &.hover-show
                  opacity 0
          .location
            width 195px
    #mapContainer
      display inline-block
      width 750px
      height 450px

</style>
