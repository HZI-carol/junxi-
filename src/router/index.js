import Vue from 'vue'
import VueRouter from 'vue-router'
import { routers } from './router'
import NProgress from 'nprogress'
import util from '@/plugins/util'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })
Vue.use(VueRouter)

// export default new router({
//   // mode: 'history',
//   routes: routers
// })

export const router = new VueRouter({
  // mode: 'history',
  routes: routers
})

router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook
  NProgress.start()

  if (to.name !== 'login' && to.name !== 'signup') {
    util.auth.getToken()
    next()
  }
  // 禁止输入url 访问隐藏的模块
  if (to.matched[0].meta.hideModule || to.meta.hideModule) {
    router.push({ name: 'home' })
    next()
  }
  util.title(to.meta.title)
  next()
})
router.afterEach((to) => {
  NProgress.done()
})
