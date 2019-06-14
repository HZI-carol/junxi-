/* eslint-disable no-undef */
export default {
  state: {
    isCollapse: false,
    userInfo: {},
    userUnReadMsg: 0,
    decorationStyles: [-1],
    tradeCate: [],
    companyInfo: {},
    companyTypes: [-1]
  },
  getters: {
    isCollapse: state => state.isCollapse,
    userInfo: state => state.userInfo,
    userUnReadMsg: state => state.userUnReadMsg,
    tradeCate: state => {
      if (!state.tradeCate.length) {
        VM.$store.dispatch('getTradeCate')
      }
      return state.tradeCate
    },
    decorationStyles: state => {
      if (state.decorationStyles[0] === -1) {
        VM.$store.dispatch('getDecorationStyles')
      }
      return state.decorationStyles
    },
    companyInfo: state => {
      if (!Object.keys(state.companyInfo).length) {
        VM.$store.dispatch('getCompanyInfo')
      }
      return state.companyInfo
    },
    companyTypes: state => {
      if (state.companyTypes[0] === -1) {
        VM.$store.dispatch('getCompanyTypes')
      }
      return state.companyTypes
    }
  },
  actions: {
    getUserInfo ({ commit }) {
      return VM.$api.getUserInfo().then(data => {
        commit('SAVE_USER_INFO', data)
        return data
      })
    },
    getUserUnReadMessage ({ commit }) {
      return VM.$api.getUserUnReadMessage().then(data => {
        commit('SAVE_USER_UN_READ_MSG', data)
        return data
      })
    },
    getTradeCate ({ commit }) {
      VM.$api.getUserPanoTradeCate(2).then(data => {
        commit('SAVE_TRADE_CATE', data)
      })
    },
    getDecorationStyles ({ commit }) {
      VM.$api.getDecorationStyles().then(data => {
        commit('SAVE_DECORATION_STYLES', data)
      })
    },
    getCompanyInfo ({ commit }) {
      VM.$api.getCompanyInfo().then(data => {
        let url = data.panoview_url
        data.panoid = Number(url.slice(url.lastIndexOf('/') + 1))
        commit('SAVE_COMPANY_INFO', data)
      }).catch(async (err) => { // 未填写公司信息 默认设置信息
        if (!err.msg.includes('暂无公司信息')) return
        let opts = {
          company_name: window.$globalconfig.PLATFORM_NAME,
          contact_name: '',
          contact_phone: '',
          address: '',
          logo: window.$globalconfig.LOGO,
          qrcode_url: '',
          license_image_url: '',
          description: '',
          site_url: ''
        }
        let addrInfo = await VM.$vgo.getAddress()
        if (addrInfo) {
          addrInfo = addrInfo.addressComponent
          Object.assign(opts, {
            area: addrInfo.area,
            area_id: addrInfo.adcode,
            city: addrInfo.city || addrInfo.province,
            city_id: addrInfo.adcode.slice(0, 4) + '00',
            province_id: addrInfo.adcode.slice(0, 2) + '0000',
            province: addrInfo.province
          })
        }
        VM.$api.addCompanyInfo(opts).then(() => {
          VM.$store.dispatch('getCompanyInfo')
        })
      })
    },
    getCompanyTypes ({ commit }) {
      VM.$api.getCompanyTypes(0).then(data => {
        // data.map(item => { item.name = item.tagname })
        commit('SAVE_PROJECT_TYPES', data)
      })
    }
  },
  mutations: {
    TOGGLE_COLLAPSE (state) {
      state.isCollapse = !state.isCollapse
    },
    SAVE_USER_INFO (state, data) {
      state.userInfo = data
    },
    SAVE_USER_UN_READ_MSG (state, data) {
      state.userUnReadMsg = data
    },
    READED_USER_MSG (state) {
      state.userUnReadMsg -= 1
    },
    UPDATE_USER_INFO (state, obj) {
      for (const key in obj) {
        if (state.userInfo.hasOwnProperty(key)) {
          state.userInfo[key] = obj[key]
        }
      }
    },
    SAVE_TRADE_CATE (state, data) {
      state.tradeCate = data
    },
    SAVE_DECORATION_STYLES (state, data) {
      state.decorationStyles = data
    },
    SAVE_COMPANY_INFO (state, data) {
      state.companyInfo = data
    },
    SAVE_PROJECT_TYPES (state, data) {
      state.companyTypes = data
    }
  }
}
