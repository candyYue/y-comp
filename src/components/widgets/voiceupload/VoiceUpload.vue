<template>
  <div :class="['voice-upload', `${extraClassPrefix}-voice-upload`]">

    <el-upload
        accept=".wav" :show-file-list="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :on-progress="onProgress"
        :action="action"
        :disabled='disabled'
        ref="voiceUpload"
       >

        <slot>
          <el-button type="primary" plain icon="el-icon-circle-plus-outline" class="upload-voice-btn">
            上传语音
          </el-button>
        </slot>

        <div>
          <p :title="fileTip">{{fileTip}}</p>
          <el-button type="text" icon="el-icon-close" class="voice-upload__close"
            @click="resetVoice" @mouseover="triggerClass=true" @mouseout="triggerClass=false">
          </el-button>
        </div>

        <Auditions ref="Auditions"
          :fileInfo="file"
          :class="`${extraClassPrefix}-auditions`"
          v-if="fileTip && !disabled"
        />

        <template #tip>
          <p v-if="hasError" :class="['failed', `${extraClassPrefix}-error-tip`]">{{errorTip}}</p>
        </template>

    </el-upload>

    <!-- <Modal class="modal-padding-45" title="进度提示" :showFooter="false" :showClose="false"
    v-model="progressModal">
      <el-progress :percentage="file.percentage ? Math.trunc(file.percentage) : 0"  :stroke-width="10"></el-progress>
      <p class="progress-tip">正在导入{{file && file.name}}……</p>
    </Modal> -->

  </div>
</template>
<script>
export default {
  name: 'voice-upload'
}
</script>
<script setup>
import Auditions from '../auditions'
import { xmlValidatorPattern, xmlOnlySymbolPattern } from '../../../utils/rules'
import { toRefs , computed, ref, reactive , watch, onMounted, onUnmounted } from 'vue'

  const props = defineProps({
    disabled: Boolean,
    /**
     * fileInfo 格式：
     * file_name
     *
     */
    fileInfo: Object,
    errorInfo: {
      type: String,
      default: ''
    }, /** 用于外部是否上传语音的校验 */
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
    actionSrc () {
      return '/aicall/file/uploadAudioFile'
    }
  })

  const {disabled, fileInfo, errorInfo, extraClassPrefix, showTip,actionSrc} = toRefs(props)
  const progressModal = ref(false)
  const propsFile = fileInfo.value
  const file = reactive(propsFile)
  const hasError = ref(false)
  const errorTip = ref('')
  const fileSrc = ref('')
  const triggerClass = ref(false)
  const voiceUpload  = ref()

  watch(errorInfo,(val) =>{
    if (val) {
      hasError.value = true
      errorTip.value = errorInfo.value
    } else {
      hasError.value = false
    }
  })

   watch(fileInfo,(val) =>{
    if (val) {
      file.value = {
        ...file.value,
        audio_id: val.audio_id || val.id || '',
        file_name: val.file_name || val.name || '',
        duration: val.duration || 0
      }
    } else {
      file.value = {
        ...file.value,
        audio_id: 0,
        file_name: '',
        duration: 0
      }
    }
  },{deep: true})

  const fileTip = computed(() => {
    return file.value && file.value.file_name
      
  })
  const emit = defineEmits(['resetVoice','getUploadInfo'])

  const resetVoice = () => {
    resetUpload()
    file.value = {}
    triggerClass.value = false
    // emit('resetVoice')
  }
  const resetUpload = () => {
    errorTip.value = ''
    hasError.value = false
  }
  const beforeUpload = (filevalue) => {
    if (xmlValidatorPattern.test(filevalue.name)) {
      hasError.value = true
      errorTip.value = `文件名不能包含特殊: ${String(xmlValidatorPattern).slice(2, -6)}等 `
      return false
    }
    if (!filevalue.name.substring(0, filevalue.name.length - 4).match(xmlOnlySymbolPattern)) {
      hasError.value = true
      errorTip.value = '文件名不能只包含特殊符号'
      return false
    }
    
    hasError.value = false
    // progressModal = true
    file.value.name = filevalue.name
    file.value.raw = filevalue
    console.log(filevalue)
    console.log(file.value)
  }
  const onChange =  (state)=> {
    // voiceUpload.value.querySelector('button').blur()
    if (state.status === 'success') {
      progressModal.value = false
      if (state.response.status === 0) {
        // emit('getUploadInfo', { ...state.response.data, file_name: file.value.raw.name })
      } else if (state.response.status === 101018) {
        // this.$messageTip.$warning({
          // content: state.response.info
        // })
      } else {
        hasError.value = true
        errorTip.value = state.response.info
      }
    }
    if (state.status === 'error') {
      progressModal.value = false
    }
  }
  const onProgress =  (e)=> {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100
      // Vue3中废弃了$set的概念
      // Vue2 中的数据响应式是利用 object.definedProperty()实现的，它是无法深层监听数据的变化的
      // 而Vue3，用的是ES6的proxy 使用reactive或ref使对象变为响应式数据
      // this.$set(this.file, 'percentage', e.percent)
      file.value.percentage = e.percent
    }
  }
  onMounted(()=>{
  })
</script>
