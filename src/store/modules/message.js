
export default {
  state: {
    userMessage: { list: {}, count: 0 },
    userShootMessage: { list: {}, count: 0 },
    userNotice: { list: {}, count: 0 }
  },
  getters: {
    userMessage: state => state.userMessage,
    userShootMessage: state => state.userShootMessage,
    userNotice: state => state.userNotice
  },
  actions: {
    // 个人消息
    getUserMessage ({ commit, state }, opts) {
      if (!state.userMessage.list[opts.pageIndex]) {
        window.VM.$vgo.openLoading()
        window.VM.$api.getUserMessage(opts.pageIndex, opts.pageSize).then(data => {
          commit('SAVE_USER_MESSAGE', { data: data, page: opts.pageIndex })
        })
      }
    },
    // 标记已读个人消息
    setUserMessageStatus ({ commit }, msg) {
      window.VM.$vgo.openLoading()
      window.VM.$api.setUserMessageStatus(msg.msgid).then(data => {
        commit('SET_USER_MESSAGE_STATUS', msg)
        commit('READED_USER_MSG')
        window.VM.$vgo.tip('操作成功', 'success')
      })
    },
    // 约拍消息
    getShootMessage ({ commit, state }, opts) {
      if (!state.userShootMessage.list[opts.pageIndex]) {
        window.VM.$vgo.openLoading()
        window.VM.$api.getShootMessage(opts.pageIndex, opts.pageSize).then(data => {
          commit('SAVE_USER_SHOOT_NOTICE', { data: data, page: opts.pageIndex })
        })
      }
    },
    // 处理通过约拍消息
    setShootMessageStatus ({ commit, state }, msg) {
      let msgIds = []
      if (msg.length) {
        msg.map(item => {
          if (!item.state) {
            msgIds.push(item.taskid)
          }
        })
      } else {
        msgIds.push(msg.taskid)
      }
      if (msgIds.length === 0) return
      window.VM.$vgo.openLoading()
      window.VM.$api.setShootMessageStatus(msgIds).then(data => {
        window.VM.$vgo.tip('操作成功', 'success')
        commit('SET_SHOOT_MESSAGE_STATUS', msg)
      })
    },
    // 系统消息
    getUserNotice ({ commit, state }, opts) {
      if (!state.userNotice.list[opts.pageIndex]) {
        window.VM.$vgo.openLoading()
        window.VM.$api.getUserNotice(opts.pageIndex, opts.pageSize).then(data => {
          commit('SAVE_USER_NOTICE', { data: data, page: opts.pageIndex })
        })
      }
    }
  },
  mutations: {
    INIT_PERSONAL_MESSAGE (state) {
      state.userMessage = { list: {}, count: 0 }
    },
    INIT_SHOOT_MESSAGE (state) {
      state.userShootMessage = { list: {}, count: 0 }
    },
    INIT_NOTICE_MESSAGE (state) {
      state.userNotice = { list: {}, count: 0 }
    },
    SET_USER_MESSAGE_STATUS (state, msg) {
      msg.status = 1
    },
    SET_SHOOT_MESSAGE_STATUS (state, msg) {
      if (msg.length) {
        msg.map(item => { item.state = 1 })
      } else {
        msg.state = 1
      }
    },
    SAVE_USER_MESSAGE (state, obj) {
      window.VM.$set(state.userMessage.list, obj.page, obj.data.list)
      state.userMessage.count = obj.data.count
    },
    SAVE_USER_SHOOT_NOTICE (state, obj) {
      window.VM.$set(state.userShootMessage.list, obj.page, obj.data.list)
      state.userShootMessage.count = obj.data.count
    },
    SAVE_USER_NOTICE (state, obj) {
      window.VM.$set(state.userNotice.list, obj.page, obj.data.list)
      state.userNotice.count = obj.data.count
    }
  }
}
