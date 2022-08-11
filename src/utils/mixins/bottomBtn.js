import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      end:false
    }
  },
  computed: {
    ...mapGetters({
      menuCollapse: 'menuCollapse'
    }),
  },
  watch: {
  },
  methods: {
    buttonPosition () {
      var scrollTop = document.querySelector('#view').scrollTop
      var windowHeight = document.body.clientHeight - 114
      var scrollHeight = document.querySelector('.view-contain').scrollHeight
      if (scrollTop + windowHeight >= scrollHeight) {
        this.end = true
      } else {
        this.end = false
      }

      const loadingSelect = this.$refs['LazyLoad'] || []
      const selects = this.$refs['select'] || []
      const cascaders = this.$refs['cascader'] || []

      this.$nextTick(_ => {
        if (loadingSelect.length) {
          loadingSelect.map(v => { v.$refs.loadingSelect.blur() })
        }
        if (selects.length) {
          selects.map(v => { v.blur() })
        }
        if (cascaders.length) {
          cascaders.map(v => { v.menuVisible = false })
        }
      })
    }
  },
  mounted(){
    this.$nextTick(() => {
      let view = document.querySelector('#view')
      view.addEventListener('scroll', debounce(this.buttonPosition))
    })
  },
  destroyed () {
    const $view = document.querySelector('#view')
    $view && $view.removeEventListener('scroll', debounce(this.buttonPosition))
  }
}
