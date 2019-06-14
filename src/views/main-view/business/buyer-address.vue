<template lang='pug'>
  .business-buyer-address
    .type-title 收货地址管理
    .wrapper
      .tab-options
        .add-button
          el-button(size='mini',type="primary",@click="addAddr") 添加新的地址
      .table2
        el-table(:data='addrList' stripe)
          el-table-column(prop='province', label='省份')
          el-table-column(prop='city', label='城市')
          el-table-column(prop='address', label='详细地址' show-overflow-tooltip)
          el-table-column(prop='number', label='邮编')
          el-table-column(prop='name', label='收货人姓名')
          el-table-column(prop='mobile', label='收货人手机号')
          el-table-column(label='是否默认')
            template(slot-scope="scope")
              span(v-if='scope.row.isdefault') 是
          el-table-column(label='操作' width='180')
            template(slot-scope="scope")
              el-button(@click='setDefault(scope.row)', type='text', size='small') 设为默认
              el-button(@click='updateAddr(scope.row)', type='text', size='small') 编辑
              el-button(@click='delAddr(scope.row, scope.$index)', type='text', size='small') 删除
    //- 地址编辑输入对话框
    el-dialog.address-dialog(:title="isAdd ? '添加收货地址' : '编辑收货地址'" :visible.sync="isShowAddrEditor" width='500px')
      el-form.mt20(:model="addr")
        el-form-item(label="收货人姓名" label-width="120px")
          el-input(v-model="addr.name" size='small' placeholder='请输入收货人姓名')
        el-form-item(label="收货人手机号" label-width="120px")
          el-input(v-model="addr.mobile" size='small' placeholder='请输入收货人手机号')
        el-form-item(label="邮编号码" label-width="120px")
          el-input(v-model="addr.number" size='small' placeholder='请输入邮编号码')
        el-form-item(label="选择省市" label-width="120px")
          el-cascader(expand-trigger="hover" :options="cityData" size='small'
            v-model="addr.selectedArea" @change="handleChange" ref='cascaderAddr' clearable)
        el-form-item(label="已选省市" label-width="120px" v-if='addr.province')
          span {{addr.province +'-'+ addr.city}}
        el-form-item(label="详细地址" label-width="120px")
          el-input(v-model="addr.address" type='textarea' size='small' placeholder='请输入详细地址')
        el-form-item(label="设为默认地址" label-width="120px")
          el-radio(:label="1" v-model='addr.isdefault') 是
          el-radio(:label="0" v-model='addr.isdefault') 否
      .dialog-footer(slot="footer")
        el-button(@click="submit" type='primary' size='mini') 确 定
        el-button(@click="isShowAddrEditor = false" size='mini') 取 消
</template>

<script>
import cityData from '@/mixins/city-data.js'
export default {
  name: 'buyer-address',
  mixins: [cityData],
  data () {
    return {
      isShowAddrEditor: false,
      addrList: [],
      isAdd: false,
      addr: {
        selectedArea: [],
        province: '',
        addressid: '',
        city: '',
        number: '',
        address: '',
        name: '',
        mobile: '',
        isdefault: 1
      }
    }
  },
  created () {
    this.cityData.map(item => {
      item.children.map(i => {
        delete i.children
      })
    })
    this.getAddr()
  },
  methods: {
    getAddr () {
      this.$vgo.openLoading()
      this.$api.getBuyerAddress().then(data => {
        this.addrList = data
      })
    },
    addAddr (item) {
      this.addr = {
        selectedArea: [],
        addressid: '',
        province: '',
        city: '',
        number: '',
        address: '',
        name: '',
        mobile: '',
        isdefault: 1
      }
      this.isAdd = true
      this.isShowAddrEditor = true
    },
    handleChange (item) {
      this.addr.province = this.$refs.cascaderAddr.currentLabels[0]
      this.addr.city = this.$refs.cascaderAddr.currentLabels[1]
    },
    setDefault (item) {
      this.$vgo.open(() => {
        item.isdefault = 1
        this.$api.updateBuyerAddress(item).then(data => {
          this.$vgo.tip('操作成功!', 'success')
          this.getAddr()
        })
      })
    },
    updateAddr (item) {
      console.log(item)
      for (const key in item) {
        if (this.addr.hasOwnProperty(key)) {
          this.addr[key] = item[key]
        }
      }
      this.isAdd = false
      this.isShowAddrEditor = true
    },
    delAddr (item, index) {
      this.$vgo.open(() => this.$api.delBuyerAddress(item).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.addrList.splice(index, 1)
      }))
    },
    submit (item) {
      let mobileRe = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      let postcodeRe = /^[1-9]\d{5}(?!\d)$/
      if (!this.addr.name) {
        this.$vgo.tip('请填写收货人姓名!', 'warning')
        return
      }
      if (!postcodeRe.test(this.addr.number)) {
        this.$vgo.tip('请填写正确邮编!', 'warning')
        return
      }
      if (!mobileRe.test(this.addr.mobile)) {
        this.$vgo.tip('请填写正确手机号!', 'warning')
        return
      }
      if (!this.addr.address) {
        this.$vgo.tip('请填写详细地址!', 'warning')
        return
      }
      if (!this.addr.province || !this.addr.province) {
        this.$vgo.tip('请选择省市!', 'warning')
        return
      }

      this.$api[this.isAdd ? 'addBuyerAddress' : 'updateBuyerAddress'](this.addr).then(data => {
        this.$vgo.tip('操作成功!', 'success')
        this.getAddr()
        this.isShowAddrEditor = false
      })
    }
  }
}
</script>

<style lang="stylus">
.business-buyer-address
  width 100%
  height 100%
  .table1
    text-align center
  .block
    float right
    margin-top 20px
    .number
      font-size 14px
  .tab2-btn
    margin-bottom 15px
  .address-dialog
    .el-input
      width 300px
    .el-textarea
      width 300px

</style>
