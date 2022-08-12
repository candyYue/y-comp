<template>
    <div class="call-audio upload-audio">
        <bgsound :src="audioSrc" v-if="isIE" :ref='uniqueId' :data-key="uniqueId"></bgsound>
        <audio :src="audioSrc" :ref='uniqueId' controls @ended='play=false' :data-key="uniqueId" hidden v-else></audio>
        <div class="audio-control" @click="togglePlay" :class="{'loading-btn':saveLoading}">
          <Loading v-if="saveLoading"/>
          <i v-else :class="(isIE ? !!audioSrc : play) ? 'el-icon-audiopause':'el-icon-audioplay'"></i>
        </div>
        <transition name="fade-in">
          <div v-show='audioShow' class="toggle-show" v-if="showSlider">
            <el-slider v-model="slidervalue" :show-tooltip="false" @change='changeSlider'></el-slider>
            <span>{{currentTime.toFixed(0) |formatSecond}}</span> / <span>{{duration.toFixed(0) | formatSecond}}</span>
            <!-- <span class="audio-close"><i class="el-icon-close" @click='closeAudio'></i></span> -->
          </div>
        </transition>
    </div>
</template>

<script>
import { uniqueId } from '@/utils/helper/assist'
import Loading from '@/components/feedback/Loading'
import api from '@/service/api'
import { mapActions } from 'vuex'
import Bus from '@/assets/js/bus.js'
export default {
  name: 'auditions',
  props: {
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
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isIE: window.IEBrowser,
      uniqueId: uniqueId(),
      audioShow: false,
      audioSrc: '',
      play: false,
      slidervalue: 0,
      currentTime: 0,
      duration: 0,
      saveLoading: false
    }
  },
  computed: {
    audioElement () {
      return this.$refs[this.uniqueId]
    }
  },
  components: {
    Loading
  },
  watch: {
    fileInfo (val, oldVal) {
      // if (this.type === 'tts' && isEqual(val, oldVal)) {
      //   this.togglePlay()
      //   return
      // }
      this.audioSrc = ''
      this.audioShow = false
      this.unbindPlay()
      this.audioElement.removeEventListener('error', this.onError)
      // if (this.autoplay) {
      //   this.togglePlay()
      // }
    },
    autoplay (val) {
      if (val) {
        // this.togglePlay()
        if (this.isIE) {
          this.ttsTogglePlay()
        } else {
          this.togglePlay()
        }
      }
    },
    playable (val) {
      if (!val) {
        this.unbindPlay()
      }
    }
  },
  methods: {
    ...mapActions({
      getAuditionUrl: 'AICall/getAuditionUrl'
    }),
    async togglePlay (state) {
      // 开始暂停
      let isPlaying = this.isIE ? this.audioElement.getAttribute('src') : this.play
      if (state === 'play') {
        isPlaying = false
      }
      // console.log(isPlaying)
      if (!isPlaying) {
        console.log('开始播放')
        if (this.isIE) {
          this.$emit('play', this.play)
          await this.setAudioSrc()
          // this.audioSrc = `${api.AICall.listen}?eid=${this.$route.params.eid}&id=${this.fileInfo.audio_id}`
          this.audioElement.setAttribute('src', this.audioSrc)
          const audioControl = this.audioElement.nextSibling.querySelector('i')
          audioControl.classList.add('el-icon-audiopause')
          audioControl.classList.remove('el-icon-audioplay')
          this.pauseOthers(this)
        } else {
          this.play = true
          if (this.reloadSrc) {
            this.saveLoading = true
            await this.setAudioSrc()
          }
          if (this.audioSrc && this.playable) {
            this.$emit('play', this.play)
            this.bindPlay()
            this.pauseOthers(this)
          } else {
            this.saveLoading = true
            await this.setAudioSrc()
            this.audioElement.addEventListener('canplay', () => {
              if (this.playable) {
                console.log('canplay')
                this.bindPlay()
                this.pauseOthers(this)
                this.saveLoading = false
                this.$emit('play', this.play)
              }
            }, {
              once: true
            })
            this.audioElement.addEventListener('error', this.onError)
          }
        }
      } else {
        console.log('停止播放')
        this.$emit('stop', this.play)
        this.unbindPlay()
      }
    },
    async ttsTogglePlay () {
      this.$emit('play', this.play)
      await this.setAudioSrc()
      this.audioElement.setAttribute('src', this.audioSrc)
    },
    async setAudioSrc () {
      if (this.type === 'tts') {
        if (!this.fileInfo.text) {
          return false
        }
        console.log(this.admin)
        const res = await this.getAuditionUrl(this.admin ? {
          ...this.fileInfo,
          eid: this.$route.params.id
        } : this.fileInfo)
        const eid = (this.admin ? this.$route.params.id : this.$route.params.eid) || ''
        if (eid) {
          this.audioSrc = `${api.AICall.getTestAudio}?eid=${eid}&path=${res.data}`
        } else {
          this.audioSrc = `${api.AICall.getTestAudio}?path=${res.data}`
        }
      } else {
        // Promise((reslove) => {
        let eid = (this.admin ? this.$route.params.id : this.$route.params.eid) || ''
        if (eid) {
          this.audioSrc = `${api.AICall.listen}?eid=${eid}&id=${this.fileInfo.audio_id}`
        }
        //   reslove()
        // })
      }
    },
    clearAudioSrc () {
      this.audioSrc = null
    },
    pauseOthers (except) {
      if (!this.isIE) {
        var audios = document.querySelectorAll('audio');
        [].forEach.call(audios, audio => {
          if (audio.dataset['key'] !== except.uniqueId) {
            audio.pause()
          }
        })
      } else {
        var bgsounds = document.querySelectorAll('bgsound');
        [].forEach.call(bgsounds, bgsound => {
          if (bgsound.dataset['key'] !== except.uniqueId) {
            const audioControl = bgsound.nextSibling.querySelector('i')
            audioControl.classList.add('el-icon-audioplay')
            audioControl.classList.remove('el-icon-audiopause')
            bgsound.setAttribute('src', '')
          }
        })
      }
    },
    changeSlider (val) {
      this.audioElement.currentTime = val / 100 * this.duration
      this.currentTime = this.audioElement.currentTime
    },
    onProgress () {
      // console.log('timeupdate')
      const audioRecord = this.audioElement
      const _currentTime = audioRecord ? audioRecord.currentTime : 0
      this.currentTime = _currentTime
      this.slidervalue = _currentTime / this.duration * 100
    },
    onError (e) {
      this.$emit('error', e)
      if (this.audioText) {
        this.$messageTip.$error({
          content: '该语音文件不存在，请重新上传。'
        })
      }
      this.saveLoading = false
    },
    onPause () {
      this.$emit('stop', this.play)
      this.play = false
    },
    closeAudio () {
      this.audioShow = false
      this.audioElement.currentTime = 0
      this.audioElement.pause()
    },
    bindPlay () {
      if (!this.audioElement) {
        return
      }
      const playPromise = this.audioElement.play()
      playPromise.then(() => {
        this.play = true
        this.audioShow = true
        this.duration = this.audioElement.duration
        this.saveLoading = false
      }).catch((err) => {
        // this.onError(err)
        this.$emit('error', err)
        this.saveLoading = false
      })
      this.audioElement.addEventListener('timeupdate', this.onProgress)
      this.audioElement.addEventListener('pause', this.onPause)
    },
    unbindPlay () {
      const audioElement = this.audioElement
      this.play = false
      if (audioElement && !this.isIE) {
        audioElement.pause()
        audioElement.removeEventListener('timeupdate', this.onProgress)
        audioElement.removeEventListener('pause', this.onPause)
      }
      if (this.isIE && audioElement) {
        this.audioSrc = ''
        audioElement.setAttribute('src', this.audioSrc)
        const audioControl = audioElement.nextSibling.querySelector('i')
        audioControl.classList.add('el-icon-audioplay')
        audioControl.classList.remove('el-icon-audiopause')
      }
    }
  },
  beforeDestroy () {
    if (this.isIE) {
      Array.from(document.querySelectorAll('bgsound')).forEach((bgsound) => {
        console.log(bgsound)
        bgsound.setAttribute('src', '')
      })
    }
  },
  destroyed () {
    this.unbindPlay()
  },
  mounted () {
    // Bus.$on('togglePlay', this.togglePlay)
  }
}
</script>
<style lang="scss">
@import "@/assets/css/views/record.scss";
.audio-control{
  .el-icon-audioplay{
    @include size(16px);
    background: url('~@/assets/icons/ivrnode-play.png') no-repeat center/contain
  }
  .el-loading-spinner{
      margin-top: -8px;
  }
  .el-loading-spinner .circular{
    width: 12px;
    height: 12px;
    vertical-align: 8px;
  }
  .el-loading-spinner .path{
    stroke:#fff;
  }
  &.loading-btn{
    background: rgba(82, 187, 255,.5);
    cursor: not-allowed;
    pointer-events: none;
  }
}
.audio-close{
  color: #B4BDCE;
}
</style>
