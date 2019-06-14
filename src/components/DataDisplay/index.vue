<template lang="pug">
  .data-display(v-if="info.length > 0")
    .basic-container
      el-row(:span="24")
        el-col(v-for="(item,index) in info" :key="index" :span="24/info.length")
          div.item(:style="{color: color}")
            h5.count {{item.count}}
            span.splitLine
            p.title {{item.title}}
</template>

<script>
export default {
  props: {
    info: {
      type: Array,
      default: []
    },
    color: {
      type: String,
      default: '#15A0FF'
    }
  },
  data() {
    return {
      option: {

      },
    };
  }
}
</script>
<style lang="stylus" scoped>
.data-display
  .basic-container 
    padding 20px
    margin-bottom 20px
    background-color #fff
    border-radius 6px
    min-width 721px
    .el-col~.el-col
      .item
        border-left 2px solid #ddd
  .item 
    display flex
    flex-direction column
    margin 5px 0
    text-align center
  .count 
    margin 12px 0
    font-weight bold
    font-size 32px
    color #15A0FF
  .title 
    color #999
  .splitLine 
    display block
    margin 0 auto
    width 24px
    height 1px
    background #9B9B9B
</style>
