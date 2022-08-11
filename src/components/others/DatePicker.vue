<template>
    <div class="search-date flex-item">
        <el-form-item :label="labelName" :class="['narrow','flex-item',`${otherlaberClassname}`]">
            <el-date-picker
                popper-class='picker322'
                v-model="starTimeVal"
                type="datetime"
                :picker-options="pickerOptionBefore"
                :format='format'
                value-format="timestamp"
                placeholder="开始时间"
                default-time="00:00:00"
                @change='changeTime("before",starTimeVal)'
                >
            </el-date-picker>
            </el-form-item>
            <el-form-item label="至" class="flex-item">
            <el-date-picker
                popper-class='picker322'
                v-model="endTimeVal"
                type="datetime"
                :picker-options="pickerOptionAfter"
                :format='format'
                value-format="timestamp"
                placeholder="结束时间"
                :default-time="defaultEndTime"
                @change='changeTime("after",endTimeVal)'
                >
            </el-date-picker>
        </el-form-item>
    </div>
</template>

<script>
import {
  timeStamp
} from '@/utils/helper/filter.js'
export default {
  name: 'date-picker',
  props: {
    labelName: String,
    format: {
      type: String,
      default: 'yyyy-MM-dd HH:mm'
    },
    defaultEndTime: {
      type: String,
      default: '23:59:00'
    },
    otherlaberClassname: String,
    starTime: [String, Number],
    endTime: [String, Number]
  },
  data () {
    return {
      starTimeVal: this.starTime,
      endTimeVal: this.endTime,
      pickerOptionBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endTimeVal
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptionAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.starTimeVal
          const startT = timeStamp(beginDateVal / 1000)('YY/MM/DD')
          if (beginDateVal) {
            return time.getTime() < new Date(startT).getTime() || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  watch: {
    starTime (val) {
      this.starTimeVal = val
    },
    endTime (val) {
      this.endTimeVal = val
    }
  },
  methods: {
    changeTime (type, val) {
      const ss = this.format === 'yyyy-MM-dd HH:mm:ss' && type === 'after' ? ':59' : ':00'
      const time = val ? timeStamp(+val / 1000)(('YY/MM/DD hh:mm')) + ss : val
      val = time ? new Date(time).getTime() : time
      this.$emit('changeTime', type, val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
