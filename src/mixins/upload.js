export default {
  data () {
    return {
    }
  },
  methods: {
    mixinBeforeUpload (file) {
      this.$vgo.openLoading()
    }
  }
}
