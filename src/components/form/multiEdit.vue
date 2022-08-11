<template>
  <el-form :model="multieditForm" @submit.native.prevent ref="multieditForm" class="multiedit-form">
    <el-form-item class="multi-edit" prop="value">
      <el-tag type="success" v-for="(item, index) in list" :key="index"
      closable @close="handleDelete(item)">{{item.content}}</el-tag>
      <el-input
        ref="single-eidt-input"
        placeholder="请输入文本并回车"
        v-model.trim="multieditForm.value"
        @keydown.enter.native="addValue"
        @keydown.delete.native="handleDelete('delete')"
        @compositionstart.native="compositionState = true"
        @compositionend.native="compositionState = false"/>
    </el-form-item>
    <div class="el-form-item__error" v-if="errorflag">{{errorcontent}}</div>
    <el-button icon="el-icon-edit" type="text" class="edti-btn"
      @click="multiEdit" v-tool-tip="'批量编辑'"></el-button>
    <Modal
      class="multi-edit-modal"
      title="批量编辑" v-model="multiEditModal"
      @comfirm="handleSave"
      @cancel="close"
    >
      <p class="textarea-info">每一行代表一个关键词</p>
      <div>
        <el-input type="textarea"
          autofocus
          :rows="20"
          v-model="multiInput"></el-input>
      </div>

    </Modal>
  </el-form>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    value: {
      handler (val) {
        this.list = val
      },
      immediate: true
    },
    'multieditForm.value' (val, oldval) {
      if (val) {
        this.errorcontent = '关键词输入完请回车确定'
      }
      if (this.list.map(v => v.content).includes(val)) {
        this.errorcontent = '文本已存在'
      }
    }
  },
  computed: {
    errorflag () {
      return this.list.map(v => v.content).includes(this.multieditForm.value) || this.multieditForm.value
    }
  },
  data () {
    return {
      list: this.value,
      multieditForm: {
        value: ''
      },
      multiEditModal: false,
      multiInput: '',
      compositionState: false,
      errorcontent: '文本已存在'
    }
  },
  methods: {
    handleDelete (tag) {
      if (this.compositionState) return
      if (tag === 'delete') {
        if (this.multieditForm.value) {
          return false
        } else {
          this.list.splice(-1, 1)
        }
      } else {
        const index = this.list.indexOf(tag)
        this.list.splice(index, 1)
      }
    },
    addValue () {
      if (!this.multieditForm.value || this.errorcontent === '文本已存在') {
        return false
      }
      this.$emit('handleInput', this.multieditForm.value)
      this.multieditForm.value = ''
    },
    multiEdit () {
      this.multiEditModal = true
      this.multiInput = this.list.map(v => v.content).join('\n')
    },
    handleSave () {
      let labelarr = this.multiInput.split('\n').filter(v => v && v.trim()).map(v => v.trim())
      let labels = Array.from(new Set(labelarr))
      labels.forEach(ele => {
        this.list.forEach(item => {
          if (ele === item.content) {
            const idx = labels.indexOf(ele)
            labels[idx] = item
          }
        })
      })
      this.$emit('handleInput', labels, 'multi') // 去空去重
      this.close()
    },
    close () {
      this.multiEditModal = false
    }
  }
}
</script>

<style lang="scss">
.multiedit-form{
  position: relative;
  .multi-edit{
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0px 0px 0px 10px;
    position: relative;
    .el-form-item__content{
      margin: 0!important;
      .el-tag {
        margin-right: 8px;
        margin-bottom: 5px;
      }
      .el-tag + .el-tag{
        margin-right: 8px;
        margin-left: 0;
      }
    }
    .el-input{
      width: 280px;
      display: inline-block;
      input{
        border: 0px;
        padding: 0px;
        &.el-input__inner{
          background-color: #F6F6F6;
        }
      }
    }

  }
  .edti-btn{
    position: absolute;
    bottom: 0px;
    right: 20px;
    .el-icon-edit{
      &::before{
        width: 15px;
        height: 15px;
        display: inline-block;
        content: '';
        background: url(~@/assets/icons/action-edit.png) no-repeat center/contain
      }
    }
    &:hover,&:active{
      .el-icon-edit::before{
        background: url(~@/assets/icons/action-edit-hover.png) no-repeat center/contain
      }
    }
  }
  .multi-edit-modal{
    .modal-body{
      padding: 0;
      >div{
        padding: 10px 26px 32px 10px;
      }
      .el-textarea__inner{
        border: none;
      }
    }
    .textarea-info{
      text-align: center;
      height: 24px;
      color: #888;
      background-color: #edf8ff;
      font-size: 12px;
      line-height: 24px;
    }
  }
}

</style>
