document.write('<link rel="shortcut icon" href=' + window.$globalconfig.URLS.API + 'favicon.ico></link>')
document.write('<script src=https://webapi.amap.com/maps?v=1.4.8&amp;key=' + window.$globalconfig.AMAP_KEY + ' async></script>')

// window.$globalconfig.OLDUSERURL = 'http://olduser.' + window.$globalconfig.DOMAIN
window.$globalconfig.GZH_SWITCH = true
window.$globalconfig.URLS.M_EDITOR = 'http://h5.' + window.$globalconfig.DOMAIN + '/m-editor/?panoid='
window.$globalconfig.URLS.LOGIN = window.$globalconfig.URLS.API + 'user/login?redirect_uri=' + encodeURIComponent(window.location.href)
window.$globalconfig.GZH_QRCODE_RUL = window.$globalconfig.URLS.API + 'krpano/images/gzh.jpg'
