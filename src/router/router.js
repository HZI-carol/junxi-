/* eslint-disable no-undef */

import main from '@/views/main'
/**
 * name: 与组件或页面的名称相同(页面缓存)
 * meta: {
 *  keepAlive: 是否缓存页面 true 缓存
 *  hideMenu: 隐藏在顶部栏/显示的菜单, true 隐藏
 *  hideModule: 是否隐藏模块, true 隐藏(只需在组第一个路由设置)
 *  needVerify: 是否需要认证, true 代表 rz_status == 4 才可进入
 *  icon: 该页面在左侧菜单、顶部栏处显示的图标
 *  dropMenu: 顶部菜单是否下拉 true 下拉
 * }
 *  group: 侧菜单是否分组,, groupIcon: 'icon-vr_1' 填入分组名称,分组名称相同则为一组
 *  groupIcon: 若分组, 分组图标必填
 */
export const appRouters = [
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login - 登录', hideMenu: true },
    component: () => import('@/views/login/index')
  },
  {
    path: '*',
    meta: { title: '错误-404', hideMenu: true },
    redirect: '/error-404'
  },
  {
    path: '/',
    meta: { title: '主页', hideMenu: true },
    redirect: '/home'
  },
  // {
  //   path: '/home',
  //   meta: { title: '主页', icon: 'iconzhuye' },
  //   component: main,
  //   children: [

  //   ]
  // },

  {
    path: '/error-404',
    name: 'error-404',
    meta: { title: '404-页面不存在', hideMenu: true },
    component: () => import('@/views/error/404')
  },

  {
    path: '/message',
    redirect: 'personal',
    component: main,
    meta: { hideMenu: true },
    children: [
      {
        path: 'personal',
        name: 'personal-message',
        meta: { title: '我的消息', icon: 'icon-xiaoxi' },
        component: () => import('@/views/main-view/message/personal-message')
      },
      {
        path: 'system',
        name: 'system-message',
        meta: { title: '系统消息', icon: 'icon-guangbo' },
        component: () => import('@/views/main-view/message/system-message')
      }
    ]
  },
  {
    path: '/data',
    component: main,
    redirect: '/data-center',
    meta: { title: '数据中心', icon: 'iconleixing' },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: { title: '主页', icon: 'iconzhuye' },
        component: () => import('@/views/main-view/home/index')
      },
      {
        path: '/view-count',
        name: 'view-count',
        meta: { title: '访问量统计', icon: 'iconfsux_tubiao_guanxitu' },
        component: () => import('@/views/main-view/data-center/view-count')
      },
      {
        path: '/consult-count',
        name: 'consult-count',
        meta: { title: '咨询量统计', icon: 'icontubiaozhexiantu' },
        component: () => import('@/views/main-view/data-center/consult-count')
      },
      {
        path: '/publish-count',
        name: 'publish-count',
        meta: { title: '发布项目统计', icon: 'icontubiao' },
        component: () => import('@/views/main-view/data-center/publish-count')
      }
    ]
  },
  {
    path: '/project',
    component: main,
    redirect: '/project-manage',
    meta: { title: '项目管理', icon: 'el-icon-files' },
    children: [
      {
        path: '/project-manage',
        name: 'project-manage',
        meta: { title: '项目管理', icon: 'el-icon-set-up' },
        component: () => import('@/views/main-view/project/index')
      },
      {
        path: '/project-publish',
        name: 'project-publish',
        meta: { title: '项目发布', icon: 'el-icon-upload2' },
        component: () => import('@/views/main-view/publish/project')
      },
      {
        path: '/project-update',
        name: 'project-update',
        meta: { title: '项目更新', icon: 'icon-forms', hideMenu: true },
        component: () => import('@/views/main-view/publish/project')
      },
      {
        path: '/panorama-publish',
        name: 'panorama-publish',
        meta: { title: '上传全景', icon: 'icon-forms', hideMenu: true },
        component: () => import('@/views/main-view/publish/panorama')
      },
      {
        path: '/panorama-loading',
        name: 'panorama-loading',
        meta: { title: '加载动画', icon: 'el-icon-time', keepAlive: true },
        component: () => import('@/views/main-view/project/loading')
      }
    ]
  },
  {
    path: '/business',
    component: main,
    meta: { title: '在线商城', icon: 'icondianpu' },
    children: [
      // 卖家中心
      {
        path: 'seller-goods',
        name: 'seller-goods',
        meta: { title: '销售商品', icon: 'iconfeilei', group: '卖家中心', groupIcon: 'iconyonghuzhongxin' },
        component: () => import('@/views/main-view/business/seller-goods')
      },
      {
        path: 'seller-orders',
        name: 'seller-orders',
        meta: { title: '销售订单', icon: 'iconzixun', group: '卖家中心', groupIcon: 'iconyonghuzhongxin' },
        component: () => import('@/views/main-view/business/seller-orders')
      },
      // 买家中心
      {
        path: 'buyer-orders',
        name: 'buyer-orders',
        meta: { title: '购物订单', icon: 'iconinfo-copy', group: '买家中心', groupIcon: 'iconusercenter' },
        component: () => import('@/views/main-view/business/buyer-orders')
      },
      {
        path: 'buyer-address',
        name: 'buyer-address',
        meta: { title: '收货地址', icon: 'iconlocation', group: '买家中心', groupIcon: 'iconusercenter', keepAlive: true },
        component: () => import('@/views/main-view/business/buyer-address')
      }
    ]
  },
  {
    path: '/consult',
    component: main,
    redirect: '/customer-consult-unread',
    meta: { title: '客户咨询', icon: 'el-icon-chat-line-square' },
    children: [
      {
        path: '/customer-consult-unread',
        name: 'customer-consult-unread',
        meta: { title: '未处理', icon: 'el-icon-chat-line-round' },
        component: () => import('@/views/main-view/customer-consult/unread')
      },
      {
        path: '/customer-consult-readed',
        name: 'customer-consult-readed',
        meta: { title: '已处理', icon: 'el-icon-chat-round' },
        component: () => import('@/views/main-view/customer-consult/readed')
      }
    ]
  },

  /// //////////////////----------------------------------------------------------------------------------------

  {
    path: '/vip',
    component: main,
    redirect: 'package',
    meta: { title: '套餐管理', icon: 'el-icon-tickets' },
    children: [
      {
        path: 'package',
        name: 'vip-package',
        meta: { title: '会员套餐 ', icon: 'el-icon-tickets', keepAlive: true },
        component: () => import('@/views/main-view/vip/package')
      },
      {
        path: 'order',
        name: 'vip-order',
        meta: { title: '套餐订单 ', icon: 'el-icon-document' },
        component: () => import('@/views/main-view/vip/order')
      }
    ]
  },
  {
    path: '/finance',
    component: main,
    redirect: 'finance',
    meta: { title: '财务中心', icon: 'iconforms' },
    children: [
      {
        path: 'finance',
        name: 'finance-finance',
        meta: { title: '财务 ', icon: 'iconcaiwu' },
        component: () => import('@/views/main-view/finance/finance')
      },
      {
        path: 'balance',
        name: 'finance-balance',
        meta: { title: '结算', icon: 'iconjiesuan' },
        component: () => import('@/views/main-view/finance/balance')
      }
    ]
  },
  {
    path: '/user',
    redirect: 'company-info',
    component: main,
    meta: { title: '账户设置', icon: 'iconuser' },
    children: [
      {
        path: 'company-info',
        name: 'company-info',
        meta: { title: '公司资料', icon: 'iconuser' },
        component: () => import('@/views/main-view/user/company-info')
      },
      {
        path: 'recharge',
        name: 'account-recharge',
        meta: { title: '账户余额/充值', icon: 'iconchongzhi' },
        component: () => import('@/views/main-view/user/recharge')
      },
      // {
      //   path: 'my-coupon',
      //   name: 'my-coupon',
      //   meta: { title: '我的卡券', icon: 'icon-qiajuan1'},
      //   component: () => import('@/views/main-view/user/my-coupon')
      // },
      {
        path: 'account-bind',
        name: 'account-bind',
        meta: { title: '账户绑定', icon: 'iconbhjlink' },
        component: () => import('@/views/main-view/user/account-bind')
      },
      {
        path: 'certificate',
        name: 'certificate',
        meta: { title: '实名认证', icon: 'iconrenzheng' },
        component: () => import('@/views/main-view/user/certificate')
      },
      {
        path: 'password',
        name: 'password',
        meta: { title: '我的密码', icon: 'iconwt-lock' },
        component: () => import('@/views/main-view/user/password')
      }
    ]
  },
  {
    path: '/application',
    component: main,
    meta: {
      title: '应用中心',
      icon: 'el-icon-menu',
      dropMenu: true,
      hideMenu: !$globalconfig.MODULES.MINIAPP && !$globalconfig.MODULES.SCITY && !$globalconfig.MODULES.H5SITE,
      hideModule: !$globalconfig.MODULES.MINIAPP && !$globalconfig.MODULES.SCITY && !$globalconfig.MODULES.H5SITE
    },
    children: [
      // weapp
      {
        path: 'create',
        name: 'weapp-create',
        meta: { title: '创建小程序', icon: 'el-icon-edit-outline', group: '微信小程序', groupIcon: 'el-icon-connection', keepAlive: true, hideMenu: !$globalconfig.MODULES.MINIAPP, hideModule: !$globalconfig.MODULES.MINIAPP },
        component: () => import('@/views/main-view/weapp/create')
      },
      {
        path: 'manage',
        name: 'weapp-manage',
        meta: { title: '管理小程序', icon: 'el-icon-copy-document', group: '微信小程序', groupIcon: 'el-icon-connection', hideMenu: !$globalconfig.MODULES.MINIAPP, hideModule: !$globalconfig.MODULES.MINIAPP },
        component: () => import('@/views/main-view/weapp/manage')
      },
      {
        path: 'order',
        name: 'weapp-order',
        meta: { title: '小程序订单', icon: 'el-icon-document', group: '微信小程序', groupIcon: 'el-icon-connection', hideMenu: !$globalconfig.MODULES.MINIAPP, hideModule: !$globalconfig.MODULES.MINIAPP },
        component: () => import('@/views/main-view/weapp/order')
      },
      // smart-city
      {
        path: 'my-merchant',
        name: 'smart-city-merchant',
        meta: { title: '我的商户', icon: 'el-icon-sell', group: '智慧城市', groupIcon: 'el-icon-office-building', hideMenu: !$globalconfig.MODULES.SCITY, hideModule: !$globalconfig.MODULES.SCITY },
        component: () => import('@/views/main-view/smart-city/my-merchant')
      },
      {
        path: 'my-merchant-orders',
        name: 'smart-city-merchant-orders',
        meta: { title: '商户订单', icon: 'el-icon-document', group: '智慧城市', groupIcon: 'el-icon-office-building', hideMenu: !$globalconfig.MODULES.SCITY, hideModule: !$globalconfig.MODULES.SCITY },
        component: () => import('@/views/main-view/smart-city/my-merchant-orders')
      },
      {
        path: 'my-merchant-goods/:id',
        name: 'smart-city-merchant-goods',
        meta: { title: '商品管理', icon: 'el-icon-box', group: '智慧城市', groupIcon: 'el-icon-office-building', hideMenu: true, hideModule: !$globalconfig.MODULES.SCITY },
        component: () => import('@/views/main-view/smart-city/my-merchant-goods')
      },
      {
        path: 'my-order',
        name: 'smart-city-orders',
        meta: { title: '我的订单', icon: 'el-icon-document-checked', group: '智慧城市', groupIcon: 'el-icon-office-building', hideMenu: !$globalconfig.MODULES.SCITY, hideModule: !$globalconfig.MODULES.SCITY },
        component: () => import('@/views/main-view/smart-city/my-orders')
      },
      {
        path: 'my-appraise',
        name: 'smart-city-appraise',
        meta: { title: '我的评价', icon: 'el-icon-chat-line-round', group: '智慧城市', groupIcon: 'el-icon-office-building', hideMenu: !$globalconfig.MODULES.SCITY, hideModule: !$globalconfig.MODULES.SCITY },
        component: () => import('@/views/main-view/smart-city/my-appraise')
      },
      // h5-site
      {
        path: 'h5-create',
        name: 'h5-create',
        meta: { title: '创建H5', icon: 'el-icon-edit-outline', group: 'H5页面', groupIcon: 'iconmobile', keepAlive: true, hideMenu: !$globalconfig.MODULES.H5SITE, hideModule: !$globalconfig.MODULES.H5SITE },
        component: () => import('@/views/main-view/h5-site/create')
      },
      {
        path: 'h5-manage',
        name: 'h5-manage',
        meta: { title: '管理H5', icon: 'el-icon-tickets', group: 'H5页面', groupIcon: 'iconmobile', hideMenu: !$globalconfig.MODULES.H5SITE, hideModule: !$globalconfig.MODULES.H5SITE },
        component: () => import('@/views/main-view/h5-site/manage')
      }
    ]
  }

]

export const routers = [
  ...appRouters
]
