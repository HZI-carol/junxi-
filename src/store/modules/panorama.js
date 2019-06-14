
export default {
  state: {
    panoPictureList: {
      // 0: {list:{}, count: 0}
    },
    panoTradeCate: [],
    panoPictureCate: []
  },
  getters: {
    panoPictureCate: state => {
      return state.panoPictureCate
    },
    panoTradeCate: state => {
      if (!state.panoTradeCate.length) {
        window.VM.$store.dispatch('getPanoTradeCate')
      }
      return state.panoTradeCate
    },
    panoPictureList: state => state.panoPictureList
  },
  actions: {

    // 重置所有全景图上传后 需要重新获取数据的列表
    initAllPanoPictureAfterPanoPicturePublish ({ commit }) {
      commit('INIT_PANO_INTEGRATION_UNADD')// 重置 作品集未加作品列表 为空
      commit('INIT_PANO_PICTURE_LIST')// 重置 全景图列表 为空
    },
    getPanoPictureCate ({ commit }) {
      window.VM.$vgo.openLoading()
      window.VM.$api.getUserPanoCate().then(data => {
        commit('SAVE_PANO_PICTURE_CATE', data)
      })
    },
    addPanoPictureCate ({ state, commit }, name) {
      window.VM.$vgo.openLoading()
      return window.VM.$api.addUserPanoCate(name).then(data => {
        window.VM.$vgo.tip('操作成功!', 'success')
        commit('ADD_PANO_PICTURE_CATE', data)
      })
    },
    delPanoPictureCate ({ state, commit }, obj) {
      window.VM.$vgo.openLoading()
      return window.VM.$api.delUserPanoCate(obj.item.cate_id).then(data => {
        window.VM.$vgo.tip('操作成功!', 'success')
        commit('DEL_PANO_PICTURE_CATE', obj)
      })
    },
    upadtePanoPictureCate ({ state, commit }, obj) {
      window.VM.$vgo.openLoading()
      return window.VM.$api.updateUserPanoCate(obj.item.cate_id, obj.name).then(data => {
        window.VM.$vgo.tip('操作成功!', 'success')
        commit('UPDATE_PANO_PICTURE_CATE', obj)
      })
    },
    // 移动分类
    setPanoPictureToCate ({ state, commit }, obj) {
      window.VM.$vgo.openLoading()
      window.VM.$api.setUserPanoToCate(obj.targetCateId, obj.panoIds).then(data => {
        window.VM.$vgo.tip('操作成功!', 'success')
        commit('SET_PANO_PICTURE_TO_CATE', obj)
        commit('MODIFY_PANO_PICTURE_CATE_PANO_NUM', obj)
      })
    },
    // 获取全景图片 列表
    getPanoPictureList ({ state, commit }, opts) {
      let curPanoList = state.panoPictureList[opts.cateId]
      opts.pageIndex = opts.catePageIndex[opts.cateId]

      // 列表数量不为零 && 本地列表无数据
      if (!curPanoList.list[opts.pageIndex]) {
        window.VM.$vgo.openLoading()
        window.VM.$api.getUserPanos(opts).then(data => {
          data.list.map(item => {
            item.tag_id = item.tag_id.replace(/，/g, ',')
            if (item.tag_id.indexOf('[') === -1) {
              item.tag_id = item.tag_id ? item.tag_id.split(',') : []
            } else {
              item.tag_id = JSON.parse(item.tag_id)
            }
          })
          commit('SAVE_PANO_PICTURE_LIST', { data: data, curPanoList, opts })
        })
      }
    },
    delPanoPicture ({ state, commit }, opts) {
      commit('CLEAR_PANO_PICTURE', opts)
      window.VM.$vgo.emit('panoPictureListUpdate')
      this.dispatch('getPanoPictureList', opts)
    },
    getPanoTradeCate ({ commit }) {
      window.VM.$api.getUserPanoTradeCate(0).then(data => {
        commit('SAVE_PANO_TRADE_CATE', data)
      })
    }
  },
  mutations: {
    SAVE_PANO_TRADE_CATE (state, data) {
      state.panoTradeCate = data
    },
    // 重置 全景图列表 为空
    INIT_PANO_PICTURE_LIST (state) {
      for (const key in state.panoPictureList) {
        state.panoPictureList[key].list = {}
        state.panoPictureList[key].count = -1
      }
    },
    CLEAR_PANO_PICTURE (state, opts) {
      state.panoPictureList[opts.cateId].list = {}
    },
    SAVE_PANO_PICTURE_CATE (state, data) {
      state.panoPictureCate = data
      data.map(item => {
        window.VM.$set(state.panoPictureList, item.cate_id, { list: {}, count: item.pano_num })
      })
    },
    UPDATE_PANO_PICTURE (state, obj) {
      obj.val = Object.assign(obj.val, obj.newVal)
    },
    CLEAR_PANO_PICTURE_CATE (state, opts) {
      state.panoPictureCate = []
    },
    ADD_PANO_PICTURE_CATE (state, data) {
      data.pano_num = 0
      state.panoPictureCate.push(data)
      window.VM.$set(state.panoPictureList, data.cate_id, { list: {}, count: 0 })
    },
    // 删除分组后 作品到默认分组 重新获取默认分组 删除本分组, 默认分组作品数量增加
    DEL_PANO_PICTURE_CATE (state, obj) {
      state.panoPictureList[state.panoPictureCate[0].cate_id].list = {}
      state.panoPictureCate[0].pano_num += Number(obj.item.pano_num)
      state.panoPictureCate.splice(obj.index, 1)
    },
    UPDATE_PANO_PICTURE_CATE (state, obj) {
      obj.item.name = obj.name
    },
    SET_PANO_PICTURE_TO_CATE (state, obj) {
      // state.panoPictureList[obj.opts.cateId] = {}
      obj.curList.list = {}
      state.panoPictureList[obj.targetCateId].list = {}
      state.panoPictureList[obj.targetCateId].count = 1
      this.dispatch('getPanoPictureList', obj.opts)
    },
    // 在移动后修改分类下数量
    MODIFY_PANO_PICTURE_CATE_PANO_NUM (state, obj) {
      state.panoPictureCate.map(item => {
        if (Number(item.cate_id) === Number(obj.targetCateId)) {
          item.pano_num += obj.panoIds.length
        }
        if (Number(item.cate_id) === Number(obj.opts.cateId)) {
          item.pano_num -= obj.panoIds.length
        }
      })
    },
    SAVE_PANO_PICTURE_LIST (state, obj) {
      obj.curPanoList.count = obj.data.count
      window.VM.$set(obj.curPanoList.list, obj.opts.pageIndex, obj.data.list)
    }
  }
}
