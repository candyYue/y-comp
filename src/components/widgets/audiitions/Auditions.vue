<template>
    <div class="call-audio upload-audio">
        <bgsound :src="audioSrc" v-if="isIE" :ref='uniqueIdRef' :data-key="uniqueIdRef"></bgsound>
        <audio :src="audioSrc" :ref='uniqueIdRef' controls @ended='play=false' :data-key="uniqueIdRef" hidden v-else></audio>
        <div class="audio-control" @click="togglePlay" :class="{'loading-btn':saveLoading}">
          <Loading v-if="saveLoading"/>
          <i v-else :class="(isIE ? !!audioSrc : play) ? 'el-icon-audiopause':'el-icon-audioplay'"></i>
        </div>
        <transition name="fade-in">
          <div v-show='audioShow' class="toggle-show" v-if="showSlider">
            <el-slider v-model="slidervalue" :show-tooltip="false" @change='changeSlider'></el-slider>
            <span>{{currentTime.toFixed(0)}}</span> / <span>{{duration.toFixed(0)}}</span>
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
import { defineProps ,toRefs , computed, defineEmits ,ref, reactive , watch, onMounted, onUnmounted } from 'vue'
import { uniqueId } from '../../../utils/helper/assist'
import Loading from '../loading'

const uniqueIdString = uniqueId()
const props = defineProps({
  fileInfo: Object,
  type: {
    type: String,
    default: 'normal'
  },
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
  audioText: {
    type: String,
    default: ''
  }
})
const {fileInfo, type, showSlider, autoplay, playable, reloadSrc,audioText} = toRefs(props)
const uniqueIdRef = ref(null)
const isIE = ref(window.IEBrowser)
const audioShow = ref(false)
const audioSrc = ref('./test.mp3')
const play = ref(false)
const slidervalue = ref(0)
const currentTime = ref(0)
const duration = ref(0)
const saveLoading = ref(false)

const audioElement = computed(() => {
  return uniqueIdRef.value
})

watch(fileInfo,() =>{
  audioSrc.value = ''
  audioShow.value = false
  unbindPlay()
  audioElement.value.removeEventListener('error', onError)
})
watch(fileInfo,() =>{
  audioSrc.value = ''
  audioShow.value = false
  unbindPlay()
  audioElement.value.removeEventListener('error', onError)
})
watch(autoplay,(val) =>{
  if (val) {
    if (isIE.value) {
      ttsTogglePlay()
    } else {
      togglePlay()
    }
  }
})
watch(playable,(val) =>{
  if (!val) {
    unbindPlay()
  }
})
const emit = defineEmits(['play','stop','error'])
const togglePlay = async (state) => {
      // 开始暂停
  let isPlaying = isIE.value ? audioElement.value.getAttribute('src') : play.value
  if (state === 'play') {
    isPlaying = false
  }
  // console.log(isPlaying)
  if (!isPlaying) {
    console.log('开始播放')
    if (isIE.value) {
      emit('play', play.value)
      await setAudioSrc()
      audioElement.value.setAttribute('src', audioSrc.value)
      const audioControl = audioElement.value.nextSibling.querySelector('i')
      audioControl.classList.add('el-icon-audiopause')
      audioControl.classList.remove('el-icon-audioplay')
      pauseOthers(this)
    } else {
      play.value = true
      if (reloadSrc.value) {
        saveLoading.value = true
        await setAudioSrc()
      }
      if (audioSrc.value && playable.value) {
        emit('play', play.value)
        bindPlay()
        pauseOthers(this)
      } else {
        saveLoading.value = true
        await setAudioSrc()
        audioElement.value.addEventListener('canplay', () => {
          if (playable.value) {
            console.log('canplay')
            bindPlay()
            pauseOthers(this)
            saveLoading.value = false
            emit('play', play.value)
          }
        }, {
          once: true
        })
        audioElement.value.addEventListener('error', onError.value)
      }
    }
  } else {
    console.log('停止播放')
    emit('stop', play.value)
    unbindPlay()
  }
}
const ttsTogglePlay = async () => {
  emit('play', play.value)
  await setAudioSrc()
  audioElement.value.setAttribute('src', audioSrc.value)
}
const setAudioSrc = async () => {
  audioSrc.value = ''
}
const clearAudioSrc = () => {
  audioSrc.value = null
}
const pauseOthers = (except) => {
  if (!isIE.value) {
    var audios = document.querySelectorAll('audio');
    [].forEach.call(audios, audio => {
      if (audio.dataset['key'] !== except.uniqueIdRef) {
        audio.pause()
      }
    })
  } else {
    var bgsounds = document.querySelectorAll('bgsound');
    [].forEach.call(bgsounds, bgsound => {
      if (bgsound.dataset['key'] !== except.uniqueIdRef) {
        const audioControl = bgsound.nextSibling.querySelector('i')
        audioControl.classList.add('el-icon-audioplay')
        audioControl.classList.remove('el-icon-audiopause')
        bgsound.setAttribute('src', '')
      }
    })
  }
}
const changeSlider = (val) => {
  audioElement.value.currentTime = val / 100 * duration.value
  currentTime.value= audioElement.value.currentTime
}
const onProgress = () => {
  // console.log('timeupdate')
  const audioRecord = audioElement.value
  const _currentTime = audioRecord ? audioRecord.currentTime : 0
  currentTime.value = _currentTime
  slidervalue.value = _currentTime / duration.value * 100
}
const onError = (e) => {
  emit('error', e)
  if (audioText.value) {
    this.$messageTip.$error({
      content: '该语音文件不存在，请重新上传。'
    })
  }
  saveLoading.value = false
}
const onPause = () => {
  emit('stop', play.value)
  play.value = false
}
const closeAudio = () => {
  audioShow.value = false
  audioElement.value.currentTime = 0
  audioElement.value.pause()
}
const bindPlay = () => {
  if (!audioElement.value) {
    return
  }
  console.log(audioElement)
  const playPromise = audioElement.value.play()
  playPromise.then(() => {
    play.value = true
    audioShow.value = true
    duration.value = audioElement.value.duration
    saveLoading.value = false
  }).catch((err) => {
    emit('error', err)
    saveLoading.value = false
  })
  audioElement.value.addEventListener('timeupdate', onProgress)
  audioElement.value.addEventListener('pause', onPause)
}
const unbindPlay = () => {
  const audioElement = audioElement.value
  play.value = false
  if (audioElement && !isIE.value) {
    audioElement.pause()
    audioElement.removeEventListener('timeupdate', onProgress)
    audioElement.removeEventListener('pause', onPause)
  }
  if (isIE.value && audioElement) {
    audioSrc.value = ''
    audioElement.setAttribute('src', audioSrc.value)
    const audioControl = audioElement.nextSibling.querySelector('i')
    audioControl.classList.add('el-icon-audioplay')
    audioControl.classList.remove('el-icon-audiopause')
  }
}
onMounted(() => {
  
});
onUnmounted(()=>{
  if (isIE.value) {
    Array.from(document.querySelectorAll('bgsound')).forEach((bgsound) => {
      bgsound.setAttribute('src', '')
    })
  }

  unbindPlay()
})
</script>
<style lang="scss">
@import "../../../assets/styles/widget/auditions.scss";
</style>
