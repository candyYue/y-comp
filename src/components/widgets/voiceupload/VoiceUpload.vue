<template>
  <div :class="['voice-upload', `${extraClassPrefix}-voice-upload`]">

    <el-upload
        accept=".wav" :show-file-list="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :on-progress="onProgress"
        :action="action"
        :data="$route.params.eid?{eid:$route.params.eid}:{eid:$route.params.id}"
        :disabled='disabled'
        ref="voiceUpload"
       >

        <slot>
          <el-button type="primary" plain icon="el-icon-circle-plus-outline" class="upload-voice-btn">
            上传语音
          </el-button>
        </slot>

        <span slot="tip">
          <el-tooltip v-if="showTip"
            placement="top" content="请选择小于5M、WAV格式的语音" effect="light" popper-class="audio-tootip">
            <div class="tool-tip">
              <i class="tip-icon-interpret"></i>
            </div>
          </el-tooltip>
        </span>
        <div slot="tip"
          v-if="fileTip"
          :class="['voice-upload__tip', `${extraClassPrefix}-file-name`, {'trigger': triggerClass}]"
        >
          <p :title="fileTip">{{fileTip}}</p>
          <el-button type="text" icon="el-icon-close" class="voice-upload__close"
            @click="resetVoice" @mouseover.native="triggerClass=true" @mouseout.native="triggerClass=false">
          </el-button>
        </div>

        <Auditions
          slot="tip" ref="Auditions"
          :fileInfo="file"
          :class="`${extraClassPrefix}-auditions`"
          v-if="fileTip && !disabled"
          :admin="admin"
        />

        <p slot="tip" v-if="hasError" :class="['failed', `${extraClassPrefix}-error-tip`]">{{errorTip}}</p>

    </el-upload>

    <Modal class="modal-padding-45" title="进度提示" :showFooter="false" :showClose="false"
    v-model="progressModal">
      <el-progress :percentage="file.percentage ? Math.trunc(file.percentage) : 0"  :stroke-width="10"></el-progress>
      <p class="progress-tip">正在导入{{file && file.name}}……</p>
    </Modal>

  </div>
</template>

<script>
import Auditions from '../../others/Auditions'
import { xmlValidatorPattern, xmlOnlySymbolPattern } from '@/utils/rules'

export default {
  name: 'voice-upload',

  components: {
    Auditions
  },
  data () {
    return {
      progressModal: false,
      file: { ...this.fileInfo } || {},
      hasError: this.errorInfo || false,
      errorTip: this.errorInfo,
      fileSrc: '',
      triggerClass: false
    }
  },

  props: {
    disabled: Boolean,
    /**
     * fileInfo 格式：
     * file_name
     *
     */
    fileInfo: Object,
    errorInfo: String, /** 用于外部是否上传语音的校验 */
    /**
     * class 外部调整样式
     * voice-upload : extraClassPrefix-voice-upload
     * file-name : extraClassPrefix-file-name
     * auditions : extraClassPrefix-auditions
     * error-tip : extraClassPrefix-error-tip
     */
    extraClassPrefix: {
      type: String,
      default: 'audio'
    },
    showTip: {
      type: Boolean,
      default: true
    },
    admin: {
      type: Boolean,
      default: false
    },
    actionSrc () {
      return '/aicall/file/uploadAudioFile'
    },
  },

  watch: {
    errorInfo (val) {
      if (val) {
        this.hasError = true
        this.errorTip = this.errorInfo
      } else {
        this.hasError = false
      }
    },
    fileInfo: {
      handler (val) {
        if (val) {
          this.file = {
            ...this.file,
            audio_id: val.audio_id || val.id || '',
            file_name: val.file_name || val.name || '',
            duration: val.duration || 0
          }
          // console.log(this.file)
        } else {
          this.file = {
            ...this.file,
            audio_id: 0,
            file_name: '',
            duration: 0
          }
        }
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    
    fileTip () {
      return this.file && this.file.file_name
    }
  },

  methods: {
    resetVoice () {
      this.resetUpload()
      this.file = {}
      this.triggerClass = false
      this.$emit('resetVoice')
      if (window.IEBrowser) {
        this.$el.querySelector('bgsound').setAttribute('src', '')
      }
    },
    resetUpload () {
      this.errorTip = ''
      this.hasError = false
    },
    beforeUpload (file) {
      if (xmlValidatorPattern.test(file.name)) {
        this.hasError = true
        this.errorTip = `文件名不能包含特殊: ${String(xmlValidatorPattern).slice(2, -6)}等 `
        return false
      }
      if (!file.name.substring(0, file.name.length - 4).match(xmlOnlySymbolPattern)) {
        this.hasError = true
        this.errorTip = '文件名不能只包含特殊符号'
        return false
      }
      this.hasError = false
      this.progressModal = true
      this.file.name = file.name
      this.file.raw = file
    },
    onChange (state) {
      this.$refs.voiceUpload.$el.querySelector('button').blur()
      if (state.status === 'success') {
        this.progressModal = false
        if (state.response.status === 0) {
          this.$emit('getUploadInfo', { ...state.response.data, file_name: this.file.raw.name })
        } else if (state.response.status === 101018) {
          this.$messageTip.$warning({
            content: state.response.info
          })
        } else {
          this.hasError = true
          this.errorTip = state.response.info
        }
      }
      if (state.status === 'error') {
        this.progressModal = false
      }
    },
    onProgress (e) {
      // console.log(e)
      if (e.total > 0) {
        e.percent = e.loaded / e.total * 100
        this.$set(this.file, 'percentage', e.percent)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../assets/styles/widget/voiceupload.scss';

</style>
