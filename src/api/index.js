import axios from 'axios'
import qs from 'qs'
import util from '@/plugins/util'
import CookieJs from 'js-cookie'

const getToken = () => util.auth.getToken()

axios.defaults.baseURL = window.$globalconfig.URLS.API
axios.defaults.retry = 5
axios.defaults.timeout = 10000
axios.defaults.retryDelay = 5000

axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  if (config.url !== 'api/userlogin/login') {
    if (getToken()) {
      config.params = Object.assign(config.params || {}, { token: getToken(), t: Date.now() })
    } else {
      return new Promise(() => { })
    }
  }
  if (!config.noLoading) window.VM.$vgo.openLoading()
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(res => {
  // 对响应数据做点什么
  window.VM.$vgo.closeLoading()

  if (res.data.code === 100) {
    return res.data.data
  } else if (res.data.msg) {
    return Promise.reject(res.data)
  }
}, error => {
  console.dir()
  // 对响应错误做点什么
  if (error.response.status === 401) {
    CookieJs.set('UserAccount', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
    CookieJs.set('UserAccount', null, { expires: -1 })
    CookieJs.set('userinfo', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
    CookieJs.set('userinfo', null, { expires: -1 })
    CookieJs.set('access_token', null, { expires: -1, domain: window.$globalconfig.DOMAIN })
    CookieJs.set('access_token', null, { expires: -1 })
    getToken()
  }
  return Promise.reject(error)
})
window.addEventListener('unhandledrejection', event => {
  let msg = event.reason.data || event.reason.msg || event.reason.message || event.reason
  window.VM.$vgo.tip(msg, 'error')
  console.log(msg)
  event.preventDefault()
})

export default {
  // 获取用户信息
  login (username, password) {
    return axios.post(`api/userlogin/login`, qs.stringify({
      username: username,
      password: password,
      signature: 'signature',
      timestamp: 'timestamp',
      nonce: 'nonce'
    }))
  },
  // 获取所有装修风格类型信息
  getDecorationStyles () {
    return axios.get(`api/zaigou/decorationstyles`)
  },
  // 获取用户信息
  getUserInfo () {
    return axios.get(`api/user/session`)
  },
  // 获取用户未读消息
  getUserUnReadMessage () {
    return axios.get(`api/user/msgs/noseecount`, { noLoading: true })
  },
  // 获取用户认证信息
  getUserCertificateInfo () {
    return axios.get(`api/user/rzcert`)
  },
  // 更新/添加用户认证信息 nature是否摄影师 1否 2是 , rz_status 未填写 = 1,待审核 = 2,审核不通过 = 3,审核通过 = 4
  addOrUpdateUserCertificateInfo (opts) {
    return axios.post(`api/user/rzcert`, qs.stringify({
      rzcert_id: opts.rzcert_id || '',
      legalman: opts.legalman, // 姓名
      tel: opts.tel,
      cardno: opts.cardno,
      cardfronturl: opts.cardfronturl,
      cardbackurl: opts.cardbackurl,
      nature: opts.nature,
      vcode: opts.vcode
    }))
  },

  // 用户绑定手机验证码 api/sms/send
  getBindPhoneVerifyCode (mobile) {
    return axios.post(`api/sms/send`, qs.stringify({
      ischeckexist: false,
      mobile
    }))
  },
  // 用户绑定邮箱验证码
  getBindEmailVerifyCode (email) {
    return axios.post(`api/email/send`, qs.stringify({
      email: email
    }))
  },

  // 用户改密码
  updatePassword (oldpassword, password) {
    return axios.put(`api/user/password?oldpassword=${oldpassword}&password=${password}`, {
    })
  },
  // 更新账户绑定信息（1=手机 2=邮箱,4提现帐号）
  upateUserBind (opts) {
    return axios.put(`api/user/account/bind`, {
      type: opts.type,
      vcode: opts.vcode || '',
      email: opts.email || '',
      phone: opts.phone || '',
      bindcardname: opts.bindcardname || '',
      bindcard: opts.bindcard || ''
    })
  },
  // 更新用户信息
  upateUserInfo (opts) {
    return axios.put(`api/user/info`, {
      avatar: opts.avatar,
      nickname: opts.nickname,
      tag: opts.tag,
      tel: opts.tel,
      qq: opts.qq,
      area: opts.area,
      dec: opts.dec
    })
  },
  // 全景上传 上传全景图
  uploadPano (picurl, thumbimageurl, title) {
    return axios.post(`api/user/uploadpanotemps`, {
      pic_url: picurl,
      thumb_image_url: thumbimageurl,
      title: title
    })
  },
  // 全景上传 删除全景缓存
  delPanoCache (id) {
    return axios.delete(`api/user/uploadpanotemps/${id}`)
  },
  // 全景上传 获取全景上传缓存
  getPanoUpdateCache () {
    return axios.get(`api/user/uploadpanotemps`)
  },
  // 创建项目
  createProject (opts) {
    return axios.post(`api/zaigou/user/projects`, {
      project_name: opts.project_name, // '', // 项目名称  长度不能超过100个字符
      contact_name: opts.contact_name, // '', // 联系人 长度不能超过25个字符
      contact_phone: opts.contact_phone, // '', // 联系人电话 长度不能超过25个字符
      cate_id: opts.cate_id, // 0, // 作品分类id
      ison: opts.ison, // 1, // 是否公开 1 公开  2 私密
      tag_id: opts.tag_id, // '旅游，室内，酒店1', // 作品分类id 作品标签 长度不能超过25个字符,最多只能选3个
      trade: opts.trade, // '食', // 作品行业 长度不能超过25个字符
      logo_url: opts.logo_url, // '', // 项目logo(也就是平台logo)
      province: opts.province, // '', // 省份名称 长度不能超过25个字符
      province_id: opts.province_id, // '', // 省份编号id长度不能超过25个字符
      city: opts.city, // '', // 市名称 长度不能超过25个字符
      city_id: opts.city_id, // '', // 市编号id 长度不能超过25个字符
      area: opts.area, // '', // 区/县级名称 长度不能超过25个字符
      area_id: opts.area_id, // '', // 区/县级编号id 长度不能超过25个字符
      address: opts.address, // '', // 详细地址 长度不能超过150个字符
      room_count: opts.room_count, // 3, // 房间数量（也就是几室）
      hall_count: opts.hall_count, // 1, // 几厅
      bathroom_count: opts.bathroom_count, // 1, // 几卫
      floorage: opts.floorage, // 90, // 建筑面积 单位（m2）
      total_price: opts.total_price, // 200, // 总价格
      decoration_style_id: opts.decoration_style_id // 9 // 装修风格id
    })
  },
  // 更新项目
  updateProject (opts) {
    return axios.put(`api/zaigou/user/projects/${opts.id}`, {
      project_name: opts.project_name, // '', // 项目名称  长度不能超过100个字符
      contact_name: opts.contact_name, // '', // 联系人 长度不能超过25个字符
      contact_phone: opts.contact_phone, // '', // 联系人电话 长度不能超过25个字符
      cate_id: opts.cate_id, // 0, // 作品分类id
      ison: opts.ison, // 1, // 是否公开 1 公开  2 私密
      tag_id: opts.tag_id, // '旅游，室内，酒店1', // 作品分类id 作品标签 长度不能超过25个字符,最多只能选3个
      trade: opts.trade, // '食', // 作品行业 长度不能超过25个字符
      logo_url: opts.logo_url, // '', // 项目logo(也就是平台logo)
      province: opts.province, // '', // 省份名称 长度不能超过25个字符
      province_id: opts.province_id, // '', // 省份编号id长度不能超过25个字符
      city: opts.city, // '', // 市名称 长度不能超过25个字符
      city_id: opts.city_id, // '', // 市编号id 长度不能超过25个字符
      area: opts.area, // '', // 区/县级名称 长度不能超过25个字符
      area_id: opts.area_id, // '', // 区/县级编号id 长度不能超过25个字符
      address: opts.address, // '', // 详细地址 长度不能超过150个字符
      room_count: opts.room_count, // 3, // 房间数量（也就是几室）
      hall_count: opts.hall_count, // 1, // 几厅
      bathroom_count: opts.bathroom_count, // 1, // 几卫
      floorage: opts.floorage, // 90, // 建筑面积 单位（m2）
      total_price: opts.total_price, // 200, // 总价格
      decoration_style_id: opts.decoration_style_id // 9 // 装修风格id
    })
  },
  // 全景上传 全景图片发布
  publishPanorama (opts) {
    return axios.post(`api/user/panos`, qs.stringify({
      pano_name: opts.project_name,
      ison: opts.ison,
      cate_id: opts.cate_id,
      tag_id: opts.tag_id,
      trade: opts.trade,
      pro: opts.province || opts.pro,
      city: opts.city,
      area: opts.area
    }))
  },
  // 检查发布状态 type videos or panos
  checkPublishStatus (type, id) {
    return axios.get(`api/user/${type}/${id}/checkstatus`, { noLoading: true })
  },
  // 项目对接全景
  projectConnectPano (id, panoId) {
    return axios.put(`api/zaigou/user/projects/panoramic/${id}`, { fk_pano_id: panoId })
  },
  // 根据指定公司获取公司对应的项目列表
  getUserProjiectList (opts) {
    return axios.get(`api/zaigou/user/projects/${opts.page}/${opts.pageSize}`, {
      params: {
        user_id: opts.userId,
        keyword: opts.keyword,
        day_type: opts.dayType,
        startdt: opts.startdt,
        enddt: opts.enddt,
        status: opts.status // 项目状态0 在建项目 1 竣工项目 2 完工项目 3 停工项目 4 暂停 5 未开工项目（暂时只用到0 2 如有项目为 -1）
      }
    })
  },

  // 更新项目状态 项目状态 0 在建项目 1 竣工项目 2 完工项目 3 停工项目 4 暂停 5 未开工项目
  updateProjectStatus (id, status) {
    return axios.put(`api/zaigou/user/projects/status/${id}?status=${status}`)
  },
  // 删除项目 项目id 字符串 1,2,3,4,5
  delProject (idstr) {
    return axios.delete(`api/zaigou/user/projects?idstr=${idstr}`)
  },
  // 获取留言列表
  getMessageList (opts) {
    return axios.get(`api/zaigou/user/comments/${opts.page}/${opts.pageSize}`, {
      params: {
        keyword: opts.keyword, // 关键字搜索 姓名或电话
        // day_type: opts.day_type, // 选择天数类型 7天，14天，30天
        startdt: opts.startdt, // 开始时间
        enddt: opts.enddt, // 结束时间
        orderBy: opts.orderBy, // 排序默认自增id,created_DESC
        status: opts.status // 状态 0 未处理 1 已处理（通过）
      }
    })
  },
  // 处理通过留言
  passMessage (ids) { // [1,2,3]
    return axios.put(`api/zaigou/user/comments`, ids)
  },
  // 删除留言
  delMessage (str) { // 1,2,3
    return axios.delete(`api/zaigou/user/comments/${str}`)
  },
  // 根据指定公司信息
  getCompanyInfo () {
    return axios.get(`api/zaigou/user/companys`)
  },
  // 获取项目分类
  getCompanyTypes () {
    return axios.get(`api/zaigou/types`)
  },
  // 添加公司信息
  addCompanyInfo (opts) {
    return axios.post(`api/zaigou/user/companys`, {
      company_name: opts.company_name, /// 公司或企业名称 长度不能超过100个字符
      nickname: opts.nickname, /// 昵称
      type_id: opts.type_id, // 公司类型
      contact_name: opts.contact_name, /// 姓名 长度不能超过25个字符
      contact_phone: opts.contact_phone, /// 联系电话 长度不能超过25个字符
      province: opts.province, /// 省份 长度不能超过25个字符
      province_id: opts.province_id, /// 省份id 长度不能超过25个字符
      city: opts.city, /// 城市名称 长度不能超过25个字符
      city_id: opts.city_id, /// 城市id 长度不能超过25个字符
      area: opts.area, /// 区/县级名称 长度不能超过25个字符
      area_id: opts.area_id, /// 区/县级名称id 长度不能超过25个字符
      address: opts.address, /// 公司详细地址长度不能超过150个字符
      site_url: opts.site_url, /// 网站url
      logo: opts.logo, /// 公司logo
      qrcode_url: opts.qrcode_url, /// 公司公众号二维码url
      license_image_url: opts.license_image_url, /// 营业执照url
      description: opts.description // 公司简介 长度不能超过1000个字符
    })
  },
  // 修改指定公司信息
  updateCompanyInfo (opts) {
    return axios.put(`api/zaigou/user/companys`, {
      company_name: opts.company_name, /// 公司或企业名称 长度不能超过100个字符
      nickname: opts.nickname, /// 昵称
      type_id: opts.type_id, // 公司类型
      contact_name: opts.contact_name, /// 姓名 长度不能超过25个字符
      contact_phone: opts.contact_phone, /// 联系电话 长度不能超过25个字符
      province: opts.province, /// 省份 长度不能超过25个字符
      province_id: opts.province_id, /// 省份id 长度不能超过25个字符
      city: opts.city, /// 城市名称 长度不能超过25个字符
      city_id: opts.city_id, /// 城市id 长度不能超过25个字符
      area: opts.area, /// 区/县级名称 长度不能超过25个字符
      area_id: opts.area_id, /// 区/县级名称id 长度不能超过25个字符
      address: opts.address, /// 公司详细地址长度不能超过150个字符
      site_url: opts.site_url, /// 网站url
      logo: opts.logo, /// 公司logo
      qrcode_url: opts.qrcode_url, /// 公司公众号二维码url
      license_image_url: opts.license_image_url, /// 营业执照url
      description: opts.description // 公司简介 长度不能超过1000个字符
    })
  },
  // =================================================================================================================================
  // 获取用户全景分类
  getUserPanoCate () {
    return axios.get(`api/user/panocates`)
  },
  // 批量更新用户全景分类(移动作品)ids: []
  setUserPanoToCate (cateid, ids) {
    return axios.put(`api/user/panos/cate/${cateid}`, ids)
  },
  // 更新用户全景标签
  updateUserPanoTagInfo (panoInfo) {
    return axios.put(`api/user/panotags/${panoInfo.pano_id}`, {
      limitdate: panoInfo.limitdate,
      pro: panoInfo.pro,
      city: panoInfo.city,
      area: panoInfo.area,
      trade: panoInfo.trade,
      tag_id: panoInfo.tag_id
    })
  },
  // 获取全景可选行业分类  全部 传type = -1  全景发布type = 0  视频发布type = 1
  getUserPanoTradeCate (type) {
    return axios.get(`api/user/hottags/${type}`)
  },
  // 添加用户全景分类
  addUserPanoCate (name) {
    return axios.post(`api/user/panocates?name=${encodeURIComponent(name)}`)
  },
  // 删除用户全景分类
  delUserPanoCate (id) {
    return axios.delete(`api/user/panocates/${id}`)
  },
  // 更新用户全景分类
  updateUserPanoCate (id, name) {
    return axios.put(`api/user/panocates/${id}?name=${encodeURIComponent(name)}`)
  },
  // 删除用户全景
  delUserPano (id) {
    return axios.delete(`api/user/panos/${id}`)
  },
  // 获取用户全景列表
  getUserPanos (opts) {
    return axios.get(`api/user/panos/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        cateid: opts.cateId
      }
    })
  },
  // 获取用户全景说一说
  getUserPanoComment (pageIndex, pageSize, panoid) {
    return axios.get(`api/user/comments/${pageIndex}/${pageSize}`, {
      params: {
        pano_id: panoid
      }
    })
  },
  // 审核通过用户全景说一说
  updateUserPanoCommentStatus (id) {
    return axios.put(`api/user/comments/${id}`, { status: 1 })
  },
  // 删除用户全景说一说
  delUserPanoComment (id) {
    return axios.delete(`api/user/comments/${id}`)
  },
  // 获取用户全景标签
  getUserPanoTag () {
    return axios.get(`api/user/tags`, {
      params: {
      }
    })
  },
  // 添加用户全景标签
  addUserPanoTag (tagname) {
    return axios.post(`api/user/tags`, {
      tagname: tagname
    })
  },
  // 删除用户全景标签
  delUserPanoTag (tagid) {
    return axios.delete(`api/user/definedtags/${tagid}`, {
    })
  },
  // 获取用户全景收藏
  getUserPanoCollection (pageIndex, pageSize) {
    return axios.get(`api/user/collects/${pageIndex}/${pageSize}`, {
      params: {
      }
    })
  },
  // 取消全景收藏POST
  delPanoCollection (panoid) {
    return axios.post(`api/user/panocollects/${panoid}?iscollect=false`, qs.stringify({
    }))
  },
  // 获取作品近一个月浏览类型统计
  getPanoViewCount () {
    return axios.get(`api/user/panos/browsertype/statistics`, {
      params: {
      }
    })
  },
  // 获取作品近一个月地区统计
  getPanoViewAreaCount () {
    return axios.get(`api/user/panos/browserregion/statistics`, {
    })
  },
  // 获取咨询统计
  getCustomerConsultCount (opts) {
    return axios.get(`api/zaigou/user/comments/browsertype/statistics`, {
      params: {
        day_type: opts.day_type, // 天数类型 默认为30天 7天、14天、30天
        beginDate: opts.beginDate, // 开始时间
        endDate: opts.endDate, // 结束时间
        status: opts.status// 留言处理状态 - 1 全部 0 未处理 1 已处理
      }
    })
  },
  // 获取发布项目统计
  getPublishCount (opts) {
    return axios.get(`api/zaigou/user/projects/browserregion/statistics`, {
      params: {
        day_type: opts.day_type, // 天数类型 默认为30天 7天、14天、30天
        beginDate: opts.beginDate, // 开始时间
        endDate: opts.endDate // 结束时间
      }
    })
  },
  // 财务 获取财务中心账单
  getUserFinance (opts) {
    return axios.get(`api/user/banklogs/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        startTime: encodeURIComponent(opts.startTime) || '',
        endTime: encodeURIComponent(opts.endTime) || ''
      }
    })
  },
  // 财务 获取结算累计指标
  getUserFinanceBalanceTotal () {
    return axios.get(`api/user/clears/statistics`, {
      params: {
      }
    })
  },

  // 财务 获取结算记录列表
  getUserFinanceBalanceRecord (opts) {
    return axios.get(`api/user/clears/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        startTime: encodeURIComponent(opts.startTime) || '',
        endTime: encodeURIComponent(opts.endTime) || ''
      }
    })
  },
  // 财务 结算提现
  applyBalanceWithDraw (money) {
    return axios.post(`api/user/clears/apply?money=${money}`, qs.stringify({
    }))
  },
  // 财务 获取红包累计指标
  getUserFinanceRedPackageTotal () {
    return axios.get(`api/user/redpackets/statistics`, {
      params: {
      }
    })
  },
  // 财务 获取红包提现记录列表
  getUserFinanceRedPackageWithdrawRecord (opts) {
    return axios.get(`api/user/redpacketclears/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        // status: opts.status,
      }
    })
  },
  // 财务 红包提现
  applyRedPackageWithDraw (money) {
    return axios.post(`api/user/redpacketclears/apply?money=${money}`, qs.stringify({
    }))
  },
  // 财务 获取打赏数据指标
  getRewardTotal () {
    return axios.get(`api/user/rewards/statistics`)
  },
  // 财务 获取打赏收入、支出列表
  getRewardRecord (opts) {
    return axios.get(`api/user/rewards/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        startTime: encodeURIComponent(opts.startTime) || '',
        endTime: encodeURIComponent(opts.endTime) || ''
      }
    })
  },
  // 获取消息
  getUserMessage (pageIndex, pageSize) {
    return axios.get(`api/user/msgs/${pageIndex}/${pageSize}`)
  },

  // 标记消息已读消息
  setUserMessageStatus (msgId) {
    return axios.put(`api/user/msgs/${msgId}`)
  },
  // 获取公告
  getUserNotice (pageIndex, pageSize) {
    return axios.get(`api/user/notices/${pageIndex}/${pageSize}`)
  },
  // vip 套餐
  getUserPackage (pageIndex = 1, pageSize = 10) {
    return axios.get(`api/user/packages/${pageIndex}/${pageSize}`)
  },
  // vip 套餐订单记录
  getUserPackageOrder (pageIndex = 1, pageSize = 10) {
    return axios.get(`api/user/packageorders/${pageIndex}/${pageSize}`)
  },
  // 充值/购买 套餐等  paytype 3 账户余额 1 支付宝 2 微信
  createPayOrder (opts) {
    return axios.post(`api/payorder/create`, qs.stringify({
      productid: opts.productid,
      ordertype: opts.ordertype,
      paytype: opts.paytype,
      return_url: encodeURIComponent(opts.return_url),
      totalfee: opts.totalfee
    }))
  },

  // 加载动画 获取自定义加载动画列表
  getLoadingList (pageIndex, pageSize) {
    return axios.get(`api/user/panoloads/${pageIndex}/${pageSize}`)
  },
  // 加载动画 获取系统加载动画列表
  getSystemLoadingList (pageIndex, pageSize) {
    return axios.get(`api/user/panoloads/editor/${pageIndex}/${pageSize}`)
  },
  // 加载动画 添加加载动画
  addPanoLoading (opts) {
    return axios.post(`api/user/panoloads`, qs.stringify({
      load_img: opts.load_img,
      pc_load_img: opts.pc_load_img,
      background_color: opts.background_color,
      showtime: opts.showtime
    }))
  },
  // 加载动画 删除加载动画
  delPanoLoading (id) {
    return axios.delete(`api/user/panoloads/${id}`)
  },
  // 电商-卖家中心商品列表 (-1 = 默认)
  getSellerProduct (opts) {
    return axios.get(`api/user/seller/products/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        name: opts.name || '',
        isputaway: opts.isputaway || -1,
        isfullstock: opts.isfullstock || -1
      }
    })
  },
  // 电商-卖家中心商品详情
  getSellerProductDetail (productid) {
    return axios.get(`api/user/seller/products/${productid}`, {
      params: {
      }
    })
  },
  // 电商-添加商品
  addSellerProduct (opts) {
    return axios.post(`api/user/seller/products`, qs.stringify({
      name: opts.name,
      description: opts.description,
      price: opts.price,
      cmpprice: opts.cmpprice,
      stock: opts.stock,
      isputaway: opts.isputaway,
      linkurl: opts.linkurl, // 360环物 3d模型
      type: opts.type, // 0-图 1-360环物 2 -3d模型
      image_url_list: opts.image_url_list
    }))
  },
  // 电商-更新商品
  updateSellerProduct (opts) {
    return axios.put(`api/user/seller/products/${opts.productid}`, {
      name: opts.name,
      description: opts.description,
      price: opts.price,
      cmpprice: opts.cmpprice,
      stock: opts.stock,
      isputaway: opts.isputaway,
      linkurl: opts.linkurl, // 360环物 3d模型
      type: opts.type, // 0-图 1-360环物 2 -3d模型
      image_url_list: opts.image_url_list
    })
  },
  // 电商-上(isputaway:1)/下(isputaway:0)架商品
  setSellerProductIsPutaway (productid, isputaway) {
    return axios.put(`api/user/seller/products/setputaway?productid=${productid}&isputaway=${isputaway}`)
  },

  // 电商-删除架商品
  delSellerProduct (productid) {
    return axios.delete(`api/user/seller/products/${productid}`)
  },
  // 电商-添加/修改商品
  addOrSetSellerProduct (imgid) {
    return axios.post(`api/userseller/product/addorset`, qs.stringify({
      imgid: imgid
    }))
  },
  // 电商-获取商品订单列表
  getSellerOrders (opts) {
    return axios.get(`api/user/seller/productorders/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        orderno: opts.orderno,
        status: opts.status
      }
    })
  },
  // 电商-设置商品订单发货
  setSellerOrdersStatus (opts) {
    return axios.put(`api/user/seller/productorders/setdelivery`, {
      productorderid: opts.orderId,
      status: opts.status || 3,
      expressno: opts.expressNo,
      expressname: opts.expressName
    })
  },
  // 电商-获取购买订单列表
  getBuyerOrders (opts) {
    return axios.get(`api/user/buyers/productorder/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        orderno: opts.orderNum,
        status: opts.orderStatus
      }
    })
  },
  // 电商-获取收货地址
  getBuyerAddress () {
    return axios.get(`api/user/buyers`, {
      params: {
      }
    })
  },
  // 电商-添加收货地址
  addBuyerAddress (opts) {
    return axios.post(`api/user/buyers`, qs.stringify({
      province: opts.province,
      city: opts.city,
      number: opts.number,
      address: opts.address,
      name: opts.name,
      mobile: opts.mobile,
      isdefault: opts.isdefault
    }))
  },
  // 电商-修改收货地址
  updateBuyerAddress (opts) {
    return axios.put(`api/user/buyers/${opts.addressid}`, {
      province: opts.province,
      city: opts.city,
      number: opts.number,
      address: opts.address,
      name: opts.name,
      mobile: opts.mobile,
      isdefault: opts.isdefault
    })
  },
  // 电商-修改收货地址
  delBuyerAddress (opts) {
    return axios.delete(`api/user/buyers/${opts.addressid}`, {
    })
  },
  // 智慧城市 获取商家数量/商品分类数量配置
  getSmartCityConfig () {
    return axios.get(`api/scity/configs`, {
      params: {
      }
    })
  },
  // 智慧城市 获取已开通城市
  getSmartCityOpenRegions (isgroup = true) {
    return axios.get(`api/scity/regions`, {
      params: {
        isgroup: isgroup
      }
    })
  },
  // 智慧城市 获取商户分类
  getSmartCityMerchantCate () {
    return axios.get(`api/scity/merchanttypes`, {
      params: {
      }
    })
  },
  // 智慧城市 获取我的商户
  getSmartCityMyMerchant () {
    return axios.get(`api/scity/user/merchants`, {
      params: {
      }
    })
  },
  // 智慧城市 获取我的商户详情
  getSmartCityMerchantInfo (id) {
    return axios.get(`api/scity/user/merchants/${id}`, {
      params: {
      }
    })
  },
  // 智慧城市 添加/更新商户信息
  setOrUpdateSmartCityMerchantInfo (opts) {
    return axios[opts.id ? 'put' : 'post'](`api/scity/user/merchants${opts.id ? ('/' + opts.id) : ''}`, {
      address: opts.address,
      area: opts.area,
      area_id: opts.area_id,
      avatar: opts.avatar,
      bannerurl: opts.bannerurl,
      city: opts.city,
      city_id: opts.city_id,
      description: opts.description,
      end_opentime: opts.end_opentime,
      location_lat: opts.location_lat,
      location_lng: opts.location_lng,
      logourl: opts.logourl,
      name: opts.name,
      panourl: opts.panourl,
      phone: opts.phone,
      province: opts.province,
      province_id: opts.province_id,
      qrcodeurl: opts.qrcodeurl,
      start_opentime: opts.start_opentime,
      telephone: opts.telephone,
      type_id: opts.type_id
    })
  },
  // 智慧城市 删除商户
  delSmartCityMerchant (id) {
    return axios.delete(`api/scity/user/merchants/${id}`)
  },
  // 智慧城市 获取商户商品分类
  getSmartCityMerchantProductCategory (id) {
    return axios.get(`api/scity/user/productcategorys`, {
      params: {
        merchant_id: id
      }
    })
  },
  // 智慧城市 获取商户商品
  getSmartCityMerchantProduct (opts) {
    return axios.get(`api/scity/user/products/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        fk_merchant_id: opts.merchantId,
        keyword: opts.keyword || '',
        isputaway: opts.isputaway || -1, // -1所有, 1上架,0不上架
        type: opts.type || 0 // 0所有, 1实物,2虚拟
      }
    })
  },

  // 智慧城市-上(isputaway:1)/下(isputaway:0)架商品
  setSmartCityMerchantProductIsPutaway (id, isputaway) {
    return axios.put(`api/scity/user/products/setputaway?id=${id}&isputaway=${isputaway}`)
  },
  // 智慧城市-删除商品
  delSmartCityMerchantProduct (id) {
    return axios.delete(`api/scity/user/products/${id}`)
  },
  // 智慧城市-添加商品
  addSmartCityMerchantProduct (opts) {
    return axios.post(`api/scity/user/products`, qs.stringify({
      name: opts.name,
      description: opts.description,
      saleprice: opts.saleprice,
      offerprice: opts.offerprice,
      fk_merchant_id: opts.fk_merchant_id,
      catepory_name: opts.catepory_name,
      fk_category_id: opts.fk_category_id,
      stock: opts.stock,
      isputaway: opts.isputaway,
      type: opts.type, // 1-实物 2-虚拟
      image_url_list: opts.image_url_list
    }))
  },
  // 智慧城市-更新商品
  updateSmartCityMerchantProduct (opts) {
    return axios.put(`api/scity/user/products/${opts.id}`, {
      name: opts.name,
      id: opts.id,
      description: opts.description,
      saleprice: opts.saleprice,
      offerprice: opts.offerprice,
      fk_merchant_id: opts.fk_merchant_id,
      catepory_name: opts.catepory_name,
      fk_category_id: opts.fk_category_id,
      stock: opts.stock,
      isputaway: opts.isputaway,
      type: opts.type, // 1-实物 2-虚拟
      image_url_list: opts.image_url_list
    })
  },

  // 智慧城市 添加商户商品分类
  addSmartCityMerchantProductCategory (opts) {
    return axios.post(`api/scity/user/productcategorys`, {
      fk_merchant_id: opts.merchantId,
      name: opts.name,
      sort: opts.sort
    })
  },
  // 智慧城市 更新商户商品分类
  uapdateSmartCityMerchantProductCategory (opts) {
    return axios.put(`api/scity/user/productcategorys/${opts.cateId}`, {
      fk_merchant_id: opts.merchantId,
      name: opts.name,
      id: opts.cateId,
      sort: opts.sort
    })
  },
  // 智慧城市 删除商户商品分类
  delSmartCityMerchantProductCategory (id) {
    return axios.delete(`api/scity/user/productcategorys/${id}`, {
    })
  },
  // 智慧城市 我的商户订单列表
  getSmartCityMyMerchantOrderList (opts) {
    return axios.get(`api/scity/user/productorders/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        type: opts.orderType || 1,
        orderno: opts.orderNum,
        status: opts.orderStatus || -1,
        fk_merchant_id: opts.merchantId || -1
      }
    })
  },
  // 智慧城市 设置订单状态发货
  setSmartCityMyMerchantOrderStatus (id, expressno, expressname) {
    return axios.put(`api/scity/user/productorders/setdelivery`, {
      id: id,
      expressno: expressno,
      expressname: expressname
    })
  },
  // 智慧城市 虚拟订单完成验证
  verifySmartCityOrder (vcode) {
    return axios.put(`api/scity/user/productorders/setused?verify_code=${vcode}`, {
    })
  },
  // 智慧城市 获取商品详情
  getSmartCityProductDetail (id) {
    return axios.get(`api/scity/user/products/${id}`)
  },
  // 智慧城市 我的订单列表
  getSmartCityMyOrderList (opts) {
    return axios.get(`api/scity/user/productorders/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        type: opts.orderType || 0,
        orderno: opts.orderNum,
        status: opts.orderStatus
      }
    })
  },
  // 智慧城市 删除我的订单列表
  delSmartCityMyOrderList (id) {
    return axios.delete(`api/scity/user/productorders/${id}`, {
      params: {
      }
    })
  },
  // 智慧城市 确认收货
  smartCityReceivedGoods (id) {
    return axios.put(`api/scity/user/productorders/${id}/setreceipted`)
  },
  // 智慧城市 获取我的评价
  getSmartCityMyAppraiseList (pageIndex, pageSize) {
    return axios.get(`api/scity/user/merchantrates/${pageIndex}/${pageSize}`, {
      params: {
        merchant_id: -1
      }
    })
  },
  // 小程序 获取用户
  getUserWeapp () {
    return axios.get(`api/mini/user/miniapps`, {
      params: {
      }
    })
  },

  // 小程序 删除
  delWeapp (id) {
    return axios.delete(`api/mini/user/miniapps/${id}`, {
      params: {
      }
    })
  },
  // 小程序 获取订单
  getWeappOrder (opts) {
    return axios.get(`api/mini/user/productorders/${opts.pageIndex}/${opts.pageSize}`, {
      params: {
        status: opts.status,
        orderno: opts.orderno
      }
    })
  },
  // 小程序 设置订单状态发货
  setWeappOrderStatus (id, status, expressno, expressname) {
    return axios.put(`api/mini/user/productorders/setdelivery`, {
      id: id,
      status: status,
      expressno: expressno,
      expressname: expressname
    })
  },
  // 小程序 获取模板
  getWeappTemplate () {
    return axios.get(`api/mini/user/templtes/miniapps`, {
      params: {
      }
    })
  },
  // 小程序 创建
  createWeapp (title, dec, logo, tplId) {
    return axios.post(`api/mini/user/miniapps`, {
      navbar_title: title,
      dec: dec,
      logo: logo,
      template_miniapp_id: tplId
    })
  },
  // H5 获取整点列表
  getH5SiteList () {
    return axios.get(`api/h5site/user/sites`, {
      params: {
      }
    })
  },
  // H5 创建h5
  createH5Site (opts) {
    return axios.post(`api/h5site/user/sites`, qs.stringify({
      name: opts.name,
      logo_url: opts.logo_url,
      background_music_url: opts.background_music_url || '',
      link_url: opts.link_url
    }))
  },
  // H5 更新h5
  updateH5Site (opts) {
    return axios.put(`api/h5site/user/sites/${opts.id}`, {
      name: opts.name,
      logo_url: opts.logo_url,
      background_music_url: opts.background_music_url || '',
      link_url: opts.link_url
    })
  },
  // H5 删除h5
  deleteH5Site (id) {
    return axios.delete(`api/h5site/user/sites/${id}`)
  },
  // 添加场景分组
  addPanoSceneGroup (panoId, name) {
    return axios.post(`api/editor/scenegroups/${panoId}`, {
      album: name
    })
  }
}
