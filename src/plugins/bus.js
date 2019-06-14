import Vue from 'vue'

export default new Vue({
  data () {
    return {
      AMap: {
        map: null,
        geolocation: null,
        geocoder: null
      }
    }
  },
  methods: {
    start_initMap () {
      return new Promise((resolve, reject) => {
        if (window.AMap) {
          if (!this.AMap.map) {
            this.new_map().then(() => resolve())
          } else {
            resolve()
          }
        } else {
          this.mapTimer = setInterval(() => {
            if (window.AMap) {
              this.new_map().then(() => resolve())
            }
          }, 200)
        }
      })
    },
    new_map () {
      return new Promise((resolve, reject) => {
        this.AMap.map = new window.AMap.Map('iCenter')
        this.AMap.map.plugin(['AMap.Geolocation', 'AMap.Geocoder'], () => {
          this.AMap.geocoder = new window.AMap.Geocoder()
          this.AMap.geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000 // 超过10秒后停止定位，默认：无穷大
          })
          clearInterval(this.mapTimer)
          this.mapTimer = null
          resolve()
        })
      })
    },
    getCurrentPosition () {
      return new Promise((resolve, reject) => {
        this.start_initMap().then(() => {
          this.AMap.geolocation.getCurrentPosition((status, res) => {
            if (status === 'complete') {
              resolve({lat: res.position.lat, lng: res.position.lng})
            } else {
              this.tip('获取定位失败, 请选择地区!', 'warning')
              console.log('获取定位失败:', res)
              resolve()
            }
          })
        })
      })
    },
    async getAddress (lng, lat) {
      // 地址转换
      if (!lng) {
        let lnglat = await this.getCurrentPosition()
        if (lnglat) {
          lng = lnglat.lng
          lat = lnglat.lat
        }
      }
      if (!lng) return
      return new Promise((resolve, reject) => {
        this.start_initMap().then(() => {
          this.AMap.geocoder.getAddress([lng, lat], (status, res) => {
            if (status === 'complete') {
              console.log(res)
              resolve(res.regeocode)
            } else {
              console.log('地址转换失败:', res)
              resolve()
            }
          })
        })
      })
    },
    emit (event, ...args) {
      this.$emit(event, ...args)
    },
    on (event, cb) {
      this.$on(event, cb)
    },
    off (event) {
      this.$off(event)
    },
    tip (msg = '操作成功！', type = 'info', time = 2000, ctrl = true) {
      this.$message({
        message: msg,
        showClose: ctrl,
        duration: time,
        type: type,
        customClass: 'tip-message'
      })
    },
    delay (cb, time) {
      setTimeout(cb, time || 1000)
    },
    throttle (cb, time) {
      if (this.timer) return
      this.timer = setTimeout(() => {
        cb()
        clearTimeout(this.timer)
        this.timer = null
      }, time)
    },
    open (cb, text = '您是否确认当前操作? 是否继续?', title = '警告') {
      return this.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cb()
      }).catch(() => {
      })
    },
    notify (type, title, msg) {
      msg = msg || '您无此权限，暂未开通商业账户！点击这里前往开通'
      this.$notify({
        title: title || '警告',
        type: type || 'warning',
        position: 'top-left',
        customClass: 'notify-tips',
        dangerouslyUseHTMLString: true,
        message: '<a style="color:#409EFF" href="' + window.$globalconfig.URLS.USER + 'Package/Index.aspx" target="_blank">' + msg + '</a>'
      })
    },
    openLoading (target, text = 'Loading', spinner = 'el-icon-loading', background = 'rgba(255, 255, 255, 0.7)') {
      if (this.loading) return
      this.loading = this.$loading({
        target: target === 1 ? '#app .router-view' : target,
        lock: true,
        text,
        spinner,
        background
      })
    },
    closeLoading () {
      if (this.loading) {
        this.loading.close()
        this.loading = null
      }
    }
  }
})
