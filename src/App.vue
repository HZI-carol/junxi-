<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$auth.getToken()
  }
}
</script>

<style lang='stylus'>
@import '~@/assets/style/global.styl'
html,body
  width 100%
  height 100%
  overflow hidden
#app
  width 100%
  height 100%
</style>
