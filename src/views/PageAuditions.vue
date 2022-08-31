<template>
  <div>
    <!-- 配置：
    fileInfo: {Object} 音频信息,src对应audio路径
    showSlider: {Boolean} 是否显示滑块
    autoplay: {Boolean} 是否自动播放
    playable: {Boolean} 是否可播放
    reloadSrc: {Boolean} 是否重置音频
    emptyautio: {Boolean} 音频是否存在 -->

    <!-- <Auditions></Auditions> -->
    <voice-upload 
      :fileInfo="{}"
      :show-tip="false"
    >
      <el-button>录音上传</el-button>>
    </voice-upload>
  </div>
</template>

<script setup>
import Auditions from '@/components/widgets/auditions'
import VoiceUpload from '@/components/widgets/voiceupload'
</script>

<style lang="scss" scoped>

</style>