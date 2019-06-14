import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import panorama from './modules/panorama'
import message from './modules/message'
import smartCity from './modules/smartCity'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
  },
  actions: {
  },
  mutations: {
  },
  modules: {
    app,
    panorama,
    smartCity,
    message
  }
})
