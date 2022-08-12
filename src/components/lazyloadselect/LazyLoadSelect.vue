<template>
     <el-select
      v-model="selectValue"
      v-bind="$attrs"
      v-on="listeners"
      remote
      :multiple='multiple'
      :remote-method="remoteMethod"
      :loading="loading"
      @focus="initList"
      value-key
      :clearable='clearable'
      :disabled='disabled'
      filterable
      @visible-change="visibleChange"
      @resetList='resetList'
      @clear="handleClear"
      @change="handleChange"
      ref="loadingSelect"
      :popper-class="popClassName"
      :title='selectTitle'
    >
      <el-option
        v-for="listItem in list"
        :key="listItem[optionData.value]"
        :label="listItem[optionData.label]"
        :value="listItem[optionData.value]"
        :title="disabledOpt.includes(listItem[optionData.value]) ? disabledTip : listItem[optionData.label]"
        :disabled="disabledOpt.includes(listItem[optionData.value])"
        :class="{'is-hidden-opt': hiddenOpt.includes(listItem[optionData.value])}"
      >
        <span v-if="beforeChange" @click="chooseOption(arguments, listItem[optionData.value])" class="lazy-option">{{ listItem[optionData.label] }}</span>
      </el-option>
      <infinite-loading spinner="spiral" @infinite="onInfinite" :distance="100" v-if="init && !end" ref="infiniteLoading">
          <div slot="no-more" class="no-more">我到底啦~~底线</div>
          <div slot="no-results"></div>
      </infinite-loading>
    </el-select>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { uniqBy, filter, includes, concat } from 'lodash'
export default {
  name: 'lazy-load-select',
  components: {
    InfiniteLoading
  },
  inheritAttrs: false,
  props: {
    value: [Array, String, Number],
    optionData: {
      type: Object,
      default: () => ({
        value: 'id',
        label: 'title'
      })
    },
    multiple: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allChoice: { /** 显示全部的title */
      type: String,
      default: ''
    },
    allChoiceValue: {
      type: String,
      default: ''
    },
    otherList: {
      type: Array,
      default: () => []
    },
    countKey: {
      type: String,
      default: 'count'
    },
    searchKey: {
      type: String,
      default: 'name'
    },
    listKey: {
      type: String,
      required: true
    },
    defalutOpt: {
      type: Array,
      default: () => []
    },
    limit: { /** 懒加载每页显示页数 */
      type: Number,
      default: 10
    },
    lazyLoad: { /** 是否使用懒加载  将废弃 */
      type: Boolean,
      default: true
    },
    loadList: { /** 加载方法 */
      type: Function,
      required: true
    },
    disabledOpt: {
      type: Array,
      default: () => []
    },
    hiddenOpt: {
      type: Array,
      default: () => []
    },
    disabledTip: {
      type: String
    },
    filterOpts: {
      type: Object,
      default: () => {}
    },
    error: {
      type: Boolean,
      default: false
    },
    keyString: {
      type: String,
      default: ''
    },
    beforeChange: Function,
    saveStore: Function, /** 保存到 store 方法 */
    beforeFocus: Function
  },
  data () {
    return {
      selectValue: this.value || '',
      selected: this.defalutOpt,
      page: 1,
      list: this.reserveOpts,
      totalList: [],
      loading: true,
      end: false,
      totalEnd: false,
      query: '',
      init: false,
      displayOpts: []
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        change: value => {
          this.$emit('input', value)
          this.$emit('change', value)
        }
      }
    },
    selectTitle () {
      const title = (this.list.filter(v => v[this.optionData.value] === this.selectValue))[0]
      if (title) {
        return title[this.optionData.label]
      } else {
        return ''
      }
    },
    reserveOpts () {
      let reserveOpts = [ ...this.otherList ]
      if (this.allChoice) {
        reserveOpts.splice(0, 0, {
          [this.optionData.value]: this.allChoiceValue,
          [this.optionData.label]: this.allChoice
        })
      }
      if (this.selectValue) {
        reserveOpts = reserveOpts.concat(this.selected)
      }
      return this.uniqArray(reserveOpts)
    },
    popClassName () {
      return this.error ? `is-error ${this.keyString}-lazyLoadSelect-popver` : `${this.keyString}-lazyLoadSelect-popver`
    }
  },
  watch: {
    value (val) {
      this.selectValue = val || ''
      if (this.saveStore) {
        const record = filter(this.list, o => includes(concat([], val), o[this.optionData.value]))
        this.saveStore(record)
      }
    },
    defalutOpt: {
      handler (val) {
        this.selected = val
        this.totalList.length
          ? this.list = this.uniqArray(this.totalList.concat(val))
          : this.list = this.reserveOpts
      },
      immediate: true
    }
  },
  methods: {
    async chooseOption (info, value) {
      info[0].stopPropagation()
      let pass = await this.beforeChange(value)
      if (pass) {
        this.$emit('add', value)
      }
    },
    uniqArray (array) {
      return uniqBy(array, this.optionData.value)
    },
    visibleChange (val) {
      if (val) {
        this.handleClear()
        if (!this.totalEnd) {
          this.end = false
        }
      }
    },
    getSelectItem (id) {
      return this.list.filter(d => id === d.id)
    },
    handleChange (val) {
      if (this.query) {
        const curValue = Array.isArray(val) ? val : [val]
        const add = this.list.filter(d => curValue.includes(d.id))
        this.totalList = this.uniqArray(this.totalList.concat(add))
      }
    },
    handleClear () {
      this.query = ''
      this.page = 1
      this.list = this.totalList
      this.loading = false
    },
    resetList () {
      this.query = ''
      this.page = 1
      if (this.allChoice) {
        this.totalList = [{
          [this.optionData.value]: this.allChoiceValue,
          [this.optionData.label]: this.allChoice
        }, ...this.otherList]
      } else {
        this.totalList = [...this.otherList]
      }
      this.list = this.totalList
      this.init = true
      this.loading = true
      this.end = false
    },
    // 加载第一页
    initList () {
      if (this.beforeFocus) {
        let pass = this.beforeFocus()
        if (!pass) return
      }
      this.end = false
      this.query = ''
      this.page = 1
      console.log('initList')
      if (this.multiple) {
        let firstIn = this.list.length === this.reserveOpts.length
        if ((this.allChoice && this.list.length !== 1) || (!this.allChoice && this.list.length !== 0 && !firstIn)) {
          return false
        }
      }
      this.init = true
      this.loading = true
      this.startLoad().then((result) => {
        console.log('init', result)
        this.end = result.count <= this.list.length
        this.totalEnd = result.count <= this.list.length
        this.loading = false
        if (this.lazyLoad) {
          this.list = this.uniqArray(this.list.concat(result.list))
        } else {
          this.list = result.list
        }
        if (result.list.length === 0) {
          this.$emit('emptyList')
        }
        this.totalList = this.list
      })
    },
    remoteMethod (query) {
      console.log('搜索' + query)
      if (this.beforeFocus) {
        let pass = this.beforeFocus()
        if (!pass) return
      }
      this.query = query
      if (query !== '') {
        this.loading = true
        this.page = 1
        this.list = []
        this.startLoad().then((result) => {
          this.loading = false
          this.list = result.list
          this.end = result.count <= this.list.length
        })
      } else {
        this.end = false
        this.list = this.totalList
      }
    },
    // 懒加载
    onInfinite ($state) {
      if (this.beforeFocus) {
        let pass = this.beforeFocus()
        if (!pass) return
      }
      setTimeout(() => {
        this.page = this.page + 1
        this.startLoad($state).then((result) => {
          if (!this.query) { /** 非搜索情况 */
            this.list = this.uniqArray(this.totalList.concat(result.list))
            this.totalList = this.list
            this.totalEnd = result.count <= this.list.length
          } else {
            this.list = this.uniqArray(this.list.concat(result.list))
          }
          // console.log(result)
          this.end = result.count <= this.list.length
          if (this.end) {
            $state.complete()
          } else {
            $state.loaded()
          }
        })
      }, 200)
    },
    async startLoad ($state) {
      const {
        countKey: count,
        listKey: list
      } = this.$props
      const params = {
        ...this.filterOpts,
        page: this.lazyLoad ? this.page : '',
        limit: this.lazyLoad ? 10 : ''
      }
      if (this.searchKey === 'product_name') {
        params.data = JSON.stringify({ product_name: this.query })
      } else if (this.searchKey === 'serve') {
        let eid = +location.pathname.split('/')[2] || 0
        params['eid'] = eid
      } else {
        if (this.query) {
          params[this.searchKey] = this.query
        }
      }
      const result = await this.loadList(params)
      return {
        count: result[count],
        list: result[list]
      }
    }
  },
  mounted () {
    if (this.allChoice) {
      this.totalList = [ {
        [this.optionData.value]: this.allChoiceValue,
        [this.optionData.label]: this.allChoice
      }, ...this.otherList]
    } else {
      this.totalList = [...this.otherList]
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/base/theme.scss';
.loading-spiral{
  border: 2px solid $theme-color!important;
}
.no-more{
  padding-top: 5px;
  font-size: 12px;
  color: $info-text-color;
}
.cluster-lazyLoadSelect-popver {
    .el-scrollbar__view {
        // overflow-x: auto;
        // max-width: 458px;
    }
}
.lazy-option {
  display: block;
}
.is-hidden-opt {
  display: none;
}

</style>
