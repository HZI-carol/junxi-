/* eslint-disable no-undef */
export default {
  state: {
    smartCityConfig: {},
    smartCityMerchantList: [-1]
  },
  getters: {
    smartCityConfig: state => {
      if (!state.smartCityConfig.hasOwnProperty('max_merchant_product_category_count')) {
        VM.$store.dispatch('getSmartCityConfig')
      }
      return state.smartCityConfig
    },
    smartCityMerchantList: state => {
      if (state.smartCityMerchantList[0] === -1) {
        VM.$store.dispatch('getSmartCityMerchantList')
      }
      return state.smartCityMerchantList
    }
  },
  actions: {
    // 个人消息
    getSmartCityConfig ({ commit, state }) {
      VM.$api.getSmartCityConfig().then(data => {
        commit('SAVE_SMART_CITY_CONFIG', data)
      })
    },
    // 获取商户列表
    getSmartCityMerchantList ({ commit, state }) {
      VM.$vgo.openLoading()
      VM.$api.getSmartCityMyMerchant().then(data => {
        commit('SAVE_SMART_CITY_MERCHANT_LIST', data)
      })
    },
    // 删除商户
    delSmartCityMerchant ({ commit, state }, obj) {
      VM.$vgo.open(() => {
        VM.$vgo.openLoading()
        VM.$api.delSmartCityMerchant(obj.item.id).then(data => {
          VM.$vgo.tip('操作成功!', 'success')
          commit('DEL_SMART_CITY_MARCHANT', obj.index)
        })
      })
    }
  },
  mutations: {
    SAVE_SMART_CITY_CONFIG (state, obj) {
      state.smartCityConfig = obj
    },
    SAVE_SMART_CITY_MERCHANT_LIST (state, obj) {
      state.smartCityMerchantList = obj
    },
    DEL_SMART_CITY_MARCHANT (state, index) {
      state.smartCityMerchantList.splice(index, 1)
    }
  }
}
