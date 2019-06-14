<template lang='pug'>
.smart-city-merchant
  .type-title 我的商户
  .tab-options
    el-button(:disabled='smartCityConfig.max_user_merchant_count <= smartCityMerchantList.length'
      @click="$refs.merchantInfoEditor.openModal()" size="mini" type="primary") 添加商户
    .item(v-if='smartCityConfig.max_user_merchant_count <= smartCityMerchantList.length') {{`商户数量已达到上限(${smartCityMerchantList.length} /${smartCityConfig.max_user_merchant_count})`}}
  .wrapper

    .merchant-list.clearfix
      .merchant-item(v-for="(item, index) in smartCityMerchantList" :key='index')
        .item-wrap.hover-scale
          .logo.pr
            .top
              el-tag(type="primary" size="mini") {{item.typename}}
              .status
                el-tag.item.el-icon-question(type="warning" size="mini" v-if='item.status == 0') 未审核
                el-tag.item.el-icon-success(type="success" size="mini" v-if='item.status == 1') 审核通过
                el-tag.item.el-icon-warning(type="danger" size="mini" v-if='item.status == 2') 审核不通过
            img.pac.select-none(:src="item.full_logourl")
            .bottom
              el-tag.item.el-icon-mobile-phone(type="primary" size="mini" v-if='item.phone') {{' ' + item.phone}}
              el-tag.item.el-icon-phone-outline(type="primary" size="mini" v-if='item.telephone') {{' ' + item.telephone}}

          .middle
            .info
              .name.omit {{item.name}}
              .time.omit {{item.created | dateFormat('date')}}
            .open-detail
              template(v-if='item.status == 1')
                el-button(@click="$refs.merchantInfo.openModal(item)" type="primary" size="mini" plain) 详情
                el-button(@click="$refs.merchantInfoEditor.openModal(item)" type="success" size="mini" plain) 更新

          .option
            template(v-if='item.status != 1')
              el-button(@click="$refs.merchantInfo.openModal(item)" type="primary" size="mini" plain) 详情
              el-button(@click="$refs.merchantInfoEditor.openModal(item)" type="success" size="mini" plain) 更新
            template(v-else)
              el-button(@click="$refs.merchantProductCate.openModal(item)" type="warning" size="mini" plain) 商品分类列表
              el-button(@click="$router.push({name: 'smart-city-merchant-goods', params: {id: item.id}})"
              type="success" size="mini" plain) 商品列表
            el-button(@click="delMerchant(item, index, index)" type="danger" size="mini" plain) 删除

  MerchantInfo(ref='merchantInfo')
  MerchantInfoEditor(ref='merchantInfoEditor')
  MerchantProductCate(ref='merchantProductCate')
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      merchantList: []
    }
  },
  computed: {
    ...mapGetters(['smartCityConfig', 'smartCityMerchantList'])
  },
  mounted () {
  },
  methods: {
    delMerchant (item, index) {
      this.$store.dispatch('delSmartCityMerchant', { item, index })
    }
  },
  components: {
    MerchantInfo: () => import('./comps/MerchantInfo'),
    MerchantInfoEditor: () => import('./comps/MerchantInfoEditor'),
    MerchantProductCate: () => import('./comps/MerchantProductCate')
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/index.styl';
$W = 300px
.smart-city-merchant
  .type-title
    margin-bottom 0
  .wrapper
    padding 20px 0
    .merchant-list
      .merchant-item
        width $W
        padding 0 10px
        margin-bottom 20px
        display inline-block
        .item-wrap
          border 1px solid #f5f5f5
          .logo
            width 100%
            height 150px
            background #F2EFE6
            .top
              display flex
              justify-content space-between
              padding  5px
              .el-tag
                background-color rgba(0,0,0,0.6)
              .status
                .item
                  background-color rgba(0,0,0,0.6)

            img
              width 100px
              height 100px
              border-radius 50%
              background-color #fff
              border 2px solid #fff
            .bottom
              position absolute
              bottom 5px
              display flex
              width 100%
              padding 0 5px
              justify-content space-between
              .item
                background-color rgba(0,0,0,0.6)

          .middle
            display flex
            justify-content space-between
            padding 10px 10px 0
            height 45px
            .info
              display flex
              flex-direction column
              .name
                width 130px
                font-size 16px
              .time
                font-size 12px
                color #aaa

          .option
            height 40px
            line-height 40px
            text-align center
            .view
              margin-right 10px

media-query('.smart-city-merchant .merchant-list .merchant-item', $W)

</style>
