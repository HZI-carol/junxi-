import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import { router } from './router'
import store from './store'

import Cookie from 'js-cookie'

import util from '@/plugins/util'

import api from '@/api'

import vgo from '@/plugins/bus'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.prototype.$cookie = Cookie
Vue.prototype.$auth = util.auth
Vue.prototype.$api = api
Vue.prototype.$vgo = vgo
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('dateFormat', (val, type) => {
  if (!val) return ''
  if (type === 'date') {
    return val.substr(0, 10)
  } else if (type === 'minute') {
    return val.replace(/t/ig, ' ').substr(0, 16)
  } else {
    return val.replace(/t/ig, ' ').split('.')[0]
  }
})

Vue.filter('amountFormat', val => {
  if (val >= 1000) {
    return (val / 10000).toFixed(1) + 'w'
  }
  return val
})

window.VM = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
