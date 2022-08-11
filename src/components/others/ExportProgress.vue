<template>
  <Modal
    v-model="value"
    :title="`${dataKey}导出`"
    :showFooter="false"
    @cancel="close"
    class="modal-progress"
  >
    <el-progress
      :stroke-width="10"
      color="#52BBFF"
      :status="successStatus ? 'success': ''"
      :percentage="result"
    />
    <div v-if="!successStatus">
      <p v-if="resstatus===1">{{exportTip}}</p>
      <p v-if="resstatus===0">{{resmessage}}</p>
    </div>
    <div v-else>
      <!-- <p>导入完成，共{{result.total}}条，导入成功<span class="success-text">{{result.total-result.error}}</span>条，导入失败<span span class="error-text">{{result.error}}</span>条，</p> -->
      <p>{{dataKey}}导出已完成，<a :href="fileHref" :class="isclick?'isclick':''" @click.once="close">点击下载</a>。</p>
    </div>
  </Modal>
</template>

<script>
import api from '@/service/api'
import request from '@/utils/request'

export default {
  name: 'progress-modal',
  props: {
    exportTip: {
      type: String,
      default: '正在导出数据……'
    },
    exportType: {
      type: String,
      default: 'task'
    },
    value: {
      type: Boolean,
      default: false
    },
    dataKey: {
      type: String
    },
    hash: {
      type: String
    },
    task_id: {
      type: Number
    }
  },
  data () {
    return {
      api,
      result: 0,
      timer: null,
      resstatus: 1,
      resmessage: '',
      isclick: false
      // task_id: parseInt(this.$route.params.id)
    }
  },
  computed: {
    successStatus () {
      return this.result === 100 && this.resstatus === 1
    },
    fileHref () {
      if (!this.isclick) {
        switch (this.exportType) {
          case 'task':
            return `${api.AICall.getExTaskFile}?eid=${this.$route.params.eid}&hash=${this.hash}&task_id=${this.task_id}`
          case 'statistics':
            return `${api.AICall.getStatisticsFile}?eid=${this.$route.params.eid}&hash=${this.hash}`
          case 'noMatch':
            return `${api.Admin.getExNoMatchFile}?eid=${this.$route.params.id}&hash=${this.hash}`
          case 'incall':
            return `${api.AICall.getIncallExportFile}?eid=${this.$route.params.eid}&hash=${this.hash}`
          case 'mismatch':
            return `${api.Admin.getClassifyFile}?eid=${this.$route.params.id}&hash=${this.hash}`
          case 'admin-outcall':
          case 'admin-robot':
            return `${api.Admin.getOutcallFile}?hash=${this.hash}`
          case 'knowledge':
            return `${api.Admin.getKnowledgeExportFile}?hash=${this.hash}`
          case 'InformationCollect': // 统计导出反馈结果
            return `${api.AICall.getExTaskFile}?eid=${this.$route.params.eid}&hash=${this.hash}`
          default:
            return `${api.AICall.getExportFile}?eid=${this.$route.params.eid}&hash=${this.hash}`
        }
      } else {
        return 'javascript:;'
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.result = 0
        this.isclick = false
        this.getProgress()
      }
    }
  },
  methods: {
    async getProgress () {
      this.resstatus = 1
      this.resmessage = ''
      // let timer = null
      let params = {
        hash: this.hash
      }
      let response
      switch (this.exportType) {
        case 'task':
          response = await request(api.AICall.getExTaskPercent, params)
          break
        case 'statistics':
          response = await request(api.AICall.getStatisticsPercent, params)
          break
        case 'noMatch':
          response = await request(api.Admin.getExNoMatchPercent, params, 'post')
          break
        case 'incall':
          response = await request(api.AICall.getIncallExportPercent, params)
          break
        case 'mismatch':
          params = {
            eid: this.$route.params.id,
            ...params
          }
          response = await request(api.Admin.getClassifyPercent, params, 'post')
          break
        case 'admin-outcall':
        case 'admin-robot':
          response = await request(api.Admin.getOutcallPercent, params, 'post')
          break
        case 'knowledge':
          response = await request(api.Admin.getKnowledgePercent, params, 'post')
          break
        default:
          response = await request(api.AICall.getExportPercent, params)
          break
      }
      if (this.exportType === 'task' || this.exportType === 'noMatch' || this.exportType === 'incall' || this.exportType === 'mismatch' || this.exportType === 'admin-outcall' || this.exportType === 'admin-robot') {
        console.log(response)
        this.result = Number(response.data.percent)
        this.resstatus = Number(response.data.status)
        this.resmessage = response.data.message
      } else {
        this.result = Number(response.data)
      }
      if (response.status === 0) {
        if (this.result >= 0 && this.result !== 100 && this.value) {
          this.timer = setTimeout(() => {
            this.getProgress()
            clearTimeout(this.timer)
          }, 1000)
        } else {
          if (this.result < 0) {
            this.close()
          }
        //   if (!response.data.error) {
        //     setTimeout(() => {
        //       this.close()
        //     }, 2000)
        //   }
        }
      } else {
        this.close()
      }
    },
    close () {
      this.isclick = true
      this.$emit('input', false)
      clearTimeout(this.timer)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/core.scss';
.modal.modal-progress{
  color:$primary-text-color;
  .modal-body{
    padding: 26px 20px 30px 33px;
    .isclick{
      cursor: not-allowed;
      text-decoration: none;
    }
  }
  .el-progress{
    &-bar{
      padding-right: 45px;
      margin-right: -45px;
      &__inner{
        transition: width .1s ease-out;
      }
    }
    &__text{
      font-size: 14px!important;
      margin-left: 6px;
      .el-icon-circle-check{
        font-size: 17px;
      }
    }
  }
}
.modal-progress{
  a{
    &:hover{
      text-decoration: underline;
    }
  }
}

</style>
