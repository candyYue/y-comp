<template>
    <div class="call-audio upload-audio">
        <div v-if="isIE" > vue3不支持ie</div>
        <!-- <bgsound :src="audioSrc" v-if="isIE" :ref='uniqueIdRef' :data-key="uniqueIdRef"></bgsound> -->
        <audio :src="audioSrc" ref='uniqueIdRef' controls @ended='play=false' data-key="uniqueIdRef" hidden v-else></audio>
        <div class="audio-control" @click="togglePlay" :class="{'loading-btn':saveLoading}">
          <Loading v-if="saveLoading"/>
          <i v-else :class="(isIE ? !!audioSrc : play) ? 'el-icon-audiopause':'el-icon-audioplay'"></i>
        </div>
        <transition name="fade-in">
          <div v-show='audioShow' class="toggle-show" v-if="showSlider">
            <el-slider v-model="slidervalue" :show-tooltip="false" @change='changeSlider'></el-slider>
            <div class="audio-time">
              <span>{{currentTimeStr}}</span> / <span>{{durationStr}}</span>
            </div>
          </div>
        </transition>
    </div>
</template>
<script>
export default {
  name: 'auditions',
};
</script>
<script setup>
// Vue3.2 版本后 defineProps 和 defineEmits 无需导入
import { toRefs , computed, ref, reactive , watch, onMounted, onUnmounted } from 'vue'

import { uniqueId } from '../../../utils/helper/assist'
import Loading from '../loading'

import { duration } from '../../../utils/helper/datehelper'
const props = defineProps({
  fileInfo: Object,
  showSlider: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  playable: {
    type: Boolean,
    default: true
  },
  reloadSrc: {
    type: Boolean,
    default: false
  },
  emptyautio: {
    type: String,
    default: ''
  }
})
const {fileInfo, showSlider, autoplay, playable, reloadSrc,emptyautio} = toRefs(props)
const uniqueIdRef = ref(null)
const isIE = ref(window.IEBrowser)
const audioShow = ref(false)
const audioSrc = ref('./test.mp3')
const play = ref(false)
const slidervalue = ref(0)
const currentTime = ref(0)
const durationTime = ref(0)
const saveLoading = ref(false)

const audioElement = computed(() => {
  return uniqueIdRef.value
})
const currentTimeStr = computed(() => {
  const value = currentTime.value.toFixed(0)
  return duration(value)('hh:mm:ss')
})

const durationStr = computed(() => {
  const value = durationTime.value.toFixed(0)
  return duration(value)('hh:mm:ss')
})
watch(fileInfo,() =>{
  audioSrc.value = ''
  audioShow.value = false
  unbindPlay()
  audioElement.value.removeEventListener('error', onError)
})
watch(autoplay,(val) =>{
  if (val) {
    togglePlay()
  }
})
watch(playable,(val) =>{
  if (!val) {
    unbindPlay()
  }
})
const emit = defineEmits(['play','stop','error','setAudioSrc'])
const togglePlay = async (state) => {
      // 开始暂停
  let isPlaying = play.value
  if (state === 'play') {
    isPlaying = false
  }
  if (!isPlaying) {
    console.log('开始播放')
    play.value = true
      if (reloadSrc.value) {
        saveLoading.value = true
        await setAudioSrc()
      }
      if (audioSrc.value && playable.value) {
        emit('play', play.value)
        bindPlay()
        pauseOthers()
      } else {
        saveLoading.value = true
        await setAudioSrc()
        audioElement.value.addEventListener('canplay', () => {
          if (playable.value) {
            console.log('canplay')
            bindPlay()
            pauseOthers()
            saveLoading.value = false
            emit('play', play.value)
          }
        }, {
          once: true
        })
        audioElement.value.addEventListener('error', onError.value)
      }
  } else {
    console.log('停止播放')
    unbindPlay()
    emit('stop', play.value)
  }
}
const setAudioSrc = async () => {
  audioSrc.value = fileInfo.value&&fileInfo.value.src||'./test.mp3'
  emit('setAudioSrc')
}
const pauseOthers = () => {
  var audios = document.querySelectorAll('audio');
  [].forEach.call(audios, audio => {
    // if (audio.dataset['key'] !== uniqueIdRef.value) {
    //   audio.pause()
    // }
  })
}
const changeSlider = (val) => {
  audioElement.value.currentTime = val / 100 * durationTime.value
  currentTime.value= audioElement.value.currentTime
}
const onProgress = () => {
  const audioRecord = audioElement.value
  const _currentTime = audioRecord ? audioRecord.currentTime : 0
  currentTime.value = _currentTime
  slidervalue.value = _currentTime / durationTime.value * 100
}
const onError = (e) => {
  emit('error', e)
  if (emptyautio.value) {
    this.$messageTip.$error({
      content: '该语音文件不存在，请重新上传。'
    })
  }
  saveLoading.value = false
}

// const closeAudio = () => {
//   audioShow.value = false
//   audioElement.value.currentTime = 0
//   audioElement.value.pause()
// }
const bindPlay = () => {
  if (!audioElement.value) {
    return
  }
  const playPromise = audioElement.value.play()
  playPromise.then(() => {
    play.value = true
    audioShow.value = true
    durationTime.value = audioElement.value.duration
    saveLoading.value = false
  }).catch((err) => {
    emit('error', err)
    saveLoading.value = false
  })
  audioElement.value.addEventListener('timeupdate', onProgress)
  audioElement.value.addEventListener('pause', onPause)
}
const unbindPlay = () => {
  play.value = false
  if (audioElement.value && !isIE.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener('timeupdate', onProgress)
    audioElement.value.removeEventListener('pause', onPause)
  }
}
const onPause = () => {
  emit('stop', play.value)
  play.value = false
}
onMounted(() => {
});
onUnmounted(()=>{
  unbindPlay()
})
</script>
