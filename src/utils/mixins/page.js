import * as types from '@/utils/config/types.js'
import { mapGetters, mapActions } from 'vuex'
import { filterOpts } from '@/utils/helper/assist'
import { omit } from 'lodash'
export default {
  data () {
    return {
      key: '', // key: script-cluster 话术下的聚类获取列表需要区分
      amount: '',
      searchStr: '',
      currentPage: 1,
      admin: false,
      baseParams: {},
      immediately: true,
      uselessSearchKeys: [] // 路由中携带的不需要收缩参数
    }
  },
  computed: {
    ...mapGetters(['limitMap']),
    // amount () {
    //   return (this.searchStr === '') && this.total
    // },
    limit () {
      return this.limitMap[this.$route.name] || 10
    }
  },
  watch: {
    $route: {
      handler (val) {
        if (this.beforeReload) {
          this.beforeReload()
        }
        this.handlePage()
      }
      // immediate: true
    }
  },
  methods: {
    ...mapActions(['changeLimit', 'changeLoading']),
    /**
   * @description 增删操作分页逻辑
    * - 新增，页面回到第一页
    * - 编辑、删除，一般情况刷新在当前页
    * - 删除，如果删除当前页面的最后一条数据，页面前进页面
    * - 搜索，页面回到第一页
    */
    reloadList (type, opts) {
      switch (type) {
        case types.PAGE_HANDLER.DEL:
          this.searchStr = ''
          if (this.total % this.limit === 1 && this.currentPage > 1) {
            this.handlePageChange(this.currentPage - 1)
          } else {
            this.handlePage()
          }
          break
        case types.PAGE_HANDLER.ADD:
          this.searchStr = ''
          this.handlePageChange(1)
          break
        case types.PAGE_HANDLER.SEARCH:
          this.handlePageChange(1)
          break
        case types.PAGE_HANDLER.FILTER:
          let { name } = this.$route.query
          if (this.$route.name === 'AICall-highrisk-views-ManualQuality') {
            name = opts.name
          }
          this.searchStr = name || ''
          this.currentPage = 1
          if (filterOpts(opts).next().value) {
            console.log(...filterOpts(opts))
            this.$router.push({ name: this.$route.name, query: { ...Object.assign(...filterOpts(opts)), name } })
          } else {
            this.$router.push({ name: this.$route.name, query: { name } })
          }
          break
        default:
          this.handlePage()
          break
      }
    },
    handlePage () {
      const page = +this.$route.query.page || 1
      const limit = +this.$route.query.limit || this.limit
      const name = this.$route.query.name || ''
      // console.log(this.$route)
      this.changeLimit({
        key: this.$route.name,
        limit
      })
      this.currentPage = page
      this.searchStr = name
      this.changeLoading(true)

      let self = this
      var params = {
        ...this.$route.query,
        ...this.baseParams,
        page,
        limit,
        name
      }
      if (this.admin) {
        params['eid'] = this.$route.params.id
      }
      let getDataFuc = this.getList
      if (this.key && this.key === 'script-cluster') {
        getDataFuc = this.getScriptList
      }
      if (this.uselessSearchKeys) {
        params = omit(params, this.uselessSearchKeys)
      }
      getDataFuc(params).then((result) => {
        if (self.searchStr === '') {
          self.amount = result.data.count
        }
        self.changeLoading(false)
        if (self.resetData) {
          self.resetData()
        }
        if (self.reloadPage) {
          self.reloadPage(result.data)
        }
      }).catch((err) => {
        if (!err.message.includes('cancel request')) {
          self.changeLoading(false)
        }
      })
    },
    handleSizeChange (limit) {
      this.changeLimit({
        key: this.$route.name,
        limit
      })
      setTimeout(() => {
        this.$router.push({ name: this.$route.name, query: { ...this.$route.query, limit: this.limit, page: this.currentPage } })
      }, 0)
    },
    handlePageChange (val) {
      this.currentPage = val
      if (+this.$route.query.page === val) {
        this.handlePage()
      } else {
        this.$router.push({ name: this.$route.name, query: { ...this.$route.query, page: this.currentPage } })
      }
    },
    clearSearch () {
      this.searchStr = ''
      this.search()
    },
    search (arg, mandatory = false) {
      console.log(`this.filterOpts:${this.filterOpts}`, mandatory)
      if (mandatory) {
        this.currentPage = 1
        this.reloadList(types.PAGE_HANDLER.SEARCH)
      } else {
        console.log(this.searchStr)
        this.$router.push({ name: this.$route.name, query: { ...this.$route.query, name: this.searchStr, page: 1, ...this.filterOpts } })
      }
    }
  },
  async mounted () {
    if (this.beforeReload) {
      await this.beforeReload()
    }
    if (this.immediately) {
      this.reloadList()
    }
    // this.addMonitor('searchStr', this.searchStr)
  }
  // destroyed () {
  //   this.changeLoading(false)
  // }
}
