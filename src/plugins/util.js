/* eslint-disable*/
import CookieJs from 'js-cookie'

export default {
  title (title) {
    let iTitle = window.$globalconfig.PLATFORM_NAME
    if (title) {
      iTitle += ' - ' + title
    }
    window.document.title = iTitle
  },
  copyText (text) {
    let tempInput = document.createElement('input')
    tempInput.value = text
    document.body.appendChild(tempInput)
    tempInput.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    document.body.removeChild(tempInput)
    window.VM.$vgo.tip('复制成功!', 'success')
  },
  auth: {
    getToken () {
      let token
      if (process.env.NODE_ENV !== 'production' && window.location.href.includes('access_token')) {
        let userInfo = window.location.href.slice(window.location.href.indexOf('access_token'))
        userInfo = decodeURIComponent(userInfo)
        let arr = userInfo.split('&')
        let expires = arr[1].split('=')[1]
        expires = expires / 60 / 60 / 24
        CookieJs.set('UserAccount', userInfo, { expires })
        token = CookieJs.getJSON('UserAccount')
      } else if (document.cookie.includes('access_token')) {
        token = document.cookie.slice(document.cookie.indexOf('access_token'))
      }
      if (!token) {
        window.location.href = window.$globalconfig.URLS.LOGIN
        return
      }
      token = decodeURIComponent(token)
      let arr = token.split('&')
      token = arr[0].split('=')[1]
      return token
    },
    verifyPhone (phone) {
      let re = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!re.test(phone)) {
        window.VM.$vgo.tip('请输入正确的手机号!', 'warning')
        return false
      }
      return true
    },
    verifyUrl (url, type = 'http|ftp|https') {
      let re = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      if (type === 'https') {
        re = /^https:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
      }
      if (!re.test(url)) {
        window.VM.$vgo.tip('请输入正确的链接!', 'warning')
        return false
      }
      return true
    },
    verifyEmail (email) {
      let re = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if (!re.test(email)) {
        window.VM.$vgo.tip('请输入正确的邮箱!', 'warning')
        return false
      }
      return true
    },
    verifyIDcard (IDcardNo) {
      let re = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
      if (!re.test(IDcardNo)) {
        window.VM.$vgo.tip('请输入正确的身份证号码!', 'warning')
        return false
      }
      return true
    },

    /**
     *
     * @param {String} waitTime 'phoneWait' || 'emailWait' 用于按钮60秒后解禁
     * @param {String || Number} account  phone || email
     * @param {String} VUE instance
     * el-button(@click='getVerifyCode' size="mini" type="primary" :disabled='!!phoneWait') 获取验证码{{phoneWait || ''}}
     */
    getVerifyCode (waitTime, account, that) {
      let api
      if (waitTime === 'phoneWait') {
        if (!this.verifyPhone(account)) return
        api = 'getBindPhoneVerifyCode'
      }
      if (waitTime === 'emailWait') {
        if (!this.verifyEmail(account)) return
        api = 'getBindEmailVerifyCode'
      }
      that[waitTime] = 60
      let timer = setInterval(() => {
        if (that[waitTime] > 0) {
          that[waitTime] -= 1
        } else {
          clearInterval(timer)
          timer = null
        }
      }, 1000)
      that.$api[api](account).then(data => {
        that.$vgo.tip('发送成功!', 'success')
      }).catch(() => that[waitTime] = 0)
    },
    verifyBank (cardId) {
      if (cardId.length < 16 || cardId.length > 19) {
        window.VM.$vgo.tip('银行卡号长度必须在16到19之间!', 'warning')
        return false
      }
      let num = /^\d*$/ // 全数字
      if (!num.test(cardId)) {
        window.VM.$vgo.tip('银行卡号必须全为数字!', 'warning')
        return false
      }
      let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
      if (strBin.indexOf(cardId.substring(0, 2)) == -1) {
        window.VM.$vgo.tip('银行卡号开头6位不符合规范!', 'warning')
        return false
      }
      if (!this._luhm(cardId)) {
        window.VM.$vgo.tip('银行卡号开头6位不符合规范!', 'warning')
        return false
      }
      return true
    },
    _luhm (bankno) {
      let lastNum = bankno.substr(bankno.length - 1, 1)
      let first15Num = bankno.substr(0, bankno.length - 1) // 前15或18位
      let newArr = new Array()
      for (let i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1))
      }
      let arrJiShu = new Array() // 奇数位*2的积 <9
      let arrJiShu2 = new Array() // 奇数位*2的积 >9
      let arrOuShu = new Array() // 偶数位数组
      for (let j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { // 奇数位
          if (parseInt(newArr[j]) * 2 < 9) { arrJiShu.push(parseInt(newArr[j]) * 2) } else { arrJiShu2.push(parseInt(newArr[j]) * 2) }
        } else // 偶数位
        { arrOuShu.push(newArr[j]) }
      }
      let jishu_child1 = new Array() // 奇数位*2 >9 的分割之后的数组个位数
      let jishu_child2 = new Array() // 奇数位*2 >9 的分割之后的数组十位数
      for (let h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10)
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10)
      }
      let sumJiShu = 0 // 奇数位*2 < 9 的数组之和
      let sumOuShu = 0 // 偶数位数组之和
      let sumJiShuChild1 = 0 // 奇数位*2 >9 的分割之后的数组个位数之和
      let sumJiShuChild2 = 0 // 奇数位*2 >9 的分割之后的数组十位数之和
      let sumTotal = 0
      for (let m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m])
      }
      for (let n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n])
      }
      for (let p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p])
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p])
      }
      // 计算总和
      sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2)
      // 计算Luhm值
      let k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10
      let luhm = 10 - k
      console.log(luhm, lastNum)

      if (lastNum == luhm) {
        return true
      } else {
        return false
      }
    }
  }
}
