<template lang="pug">
.v-upload
  el-upload(
    :action="action"
    :on-success='onSuccess'
  )

<script>
  props
export default {
  data() {
    return {
      key: 1
    }
  },
  methods: {
    onSuccess(...arg) {
      this.$emit(...arg)
    },
  },

}
</script>


