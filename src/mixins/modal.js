export default {
  data () {
    return {
      showModal: false
    }
  },
  computed: {
    getLoading () {
      return ''
    }
  },
  methods: {
    openModal (obj) {
      this.showModal = true
    },
    closeModal () {
      this.showModal = false
    },
    beforeCloseHandler () {
      this.closeModal()
    },
    handleSave () {
      this.closeModal()
    }
  }
}
