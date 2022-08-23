<template>
  <div>
    <Modal class="modal-padding-40 modal-import"
      :title="`${preTitle}${dataKey}${subTitle}`" v-model="value"
      :comfirmText="comfirmText"
      @comfirm="handleSave"
      @cancel="close"
    >
      <div v-show="showTip" class="tip-view">
        <span>{{tipString}}</span>
      </div>
      <span style="display:inline-block;width:80px" v-if="type==='tar'">
        <!-- 请选择需要导入的TAR文件 -->
        导入文件
      </span>
      <div class="modal-import__descr" v-else>
        <slot name="des-tip">
          <p>1、请按照导入模板的格式来准备要导入的数据。<a :href="templateUrl">下载导入模板</a></p>
          <p>2、选择需要导入的CSV文件</p>
        </slot>
      </div>
      <p class="import-btn">
        <el-button @click="importFile" type="info" ref="fileButton">选择文件</el-button>
        <span class="modal-import__info modal-import__file-name" v-if="!errorInfo">{{file && file.name}}</span>
        <span class="modal-import__info modal-import__error" v-else>{{errorInfo}}</span>
        <!-- <p style="color: #FE4F4E;font-size: 12px;" v-if="file && file.name&&!otherImportTip.samename">
          导入话术名称和所选话术名称不一致，请谨慎操作
        </p> -->
      </p>
      <input ref="fileInput" type="file" hidden :accept="accept" @change="handleChange"/>

      <slot name="import-item"></slot>
    </Modal>

    <modal-progress
      :type='type'
      :data-key="dataKey"
      v-model="progressModal"
      :import-url="importUrl"
      :progress-url="progressUrl"
      :import-data="importData"
      :getList="getList"
      @modalShow='modalShow'
    />
  </div>

</template>

<script>
import ModalProgress from '@/components/ModalProgress'
import api from '../../service/api'

export default {
  name: 'import-modal',
  components: {
    ModalProgress
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    otherOpts: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String
    },
    dataKey: {
      type: String
    },
    title: {
      type: String,
      default: '导入'
    },
    templateUrl: String,
    importUrl: String,
    progressUrl: {
      type: String,
      default: api.AICall.getProgress
    },
    accept: {
      type: String,
      default: '.csv'
    },
    getList: Function,
    tipString: String,
    comfirmText: {
      type: String,
      default: '开始导入'
    },
    subTitle: {
      type: String,
      default: '导入'
    },
    preTitle: {
      type: String,
      default: ''
    },
    otherImportTip: {
      type: Object,
      default: () => {}
    },
    beforeComfirm: Function
  },
  computed: {
    showTip: function () {
      return this.tipString && this.tipString.length > 0
    }
  },
  watch: {
    'otherImportTip' (val) {
      if (!val.samename && this.file && this.file.name) {
        this.$messageTip.$warning({
          content: '导入话术名称和所选话术名称不一致，请谨慎操作',
          duration: 4000
        })
      }
    }
  },
  data () {
    return {
      modal: true,
      progressModal: false,
      file: null,
      importData: {},
      errorInfo: ''
    }
  },
  methods: {
    importFile () {
      this.$refs.fileInput.click()
      this.$refs.fileButton.$el.blur()
    },
    handleChange (ev) {
      this.errorInfo = ''
      const file = ev.target.files[0]
      if (file.name.slice(-4) !== this.accept) {
        this.errorInfo = `请选择${this.accept}格式的文件`
        return
      }
      this.file = file
      this.importData = {
        file: file
      }
      if (this.type !== 'tar') {
        this.importData.type = this.type
      }
      this.importData = { ...this.importData, ...this.otherOpts }
    },
    handleSave () {
      if (!this.file) {
        this.errorInfo = '请选择需要导入的文件'
        return
      }
      if (this.otherImportTip && this.otherImportTip.nochooseScript) {
        return
      }
      if (this.beforeComfirm) {
        this.beforeComfirm()
      }
      const that = this
      this.importData = { ...this.importData, ...this.otherOpts }
      if (this.otherImportTip && this.otherImportTip.cover) {
        this.$messageBox.$warning({
          title: '导入提示',
          content: '确定要覆盖企业相同名称内容吗？一旦覆盖将无法找回！',
          successCallback () {
            that.progressModal = true
            that.close()
          }
        })
      } else {
        this.progressModal = true
        this.close()
      }
    },
    modalShow (val) {
      this.$emit('input', val)
    },
    close () {
      this.$emit('input', false)
      this.$refs.fileInput.value = null
      this.file = null
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/widget/modalimport.scss';

</style>
