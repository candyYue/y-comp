<template>
    <div :class="['modal', modalShow?'modal-open':'']" ref="modalRef">
        <transition name="fade-in">
          <div class="modal-mask" @click="maskClose" v-show="visible"></div>
        </transition>
        <transition :name="transitionPosition === 'y' ? 'modal-fade-up' : 'modal-fade-left'" @after-leave="leave">
           <!-- v-drag="draggable" -->
          <div class="modal-content" v-show="visible">
              <div class="modal-header" :class="{'drag': draggable}" v-if="showHeader">
                  <slot name="title">
                      {{title}}
                  </slot>
            </div>
              <span class="modal-close" @click="close" v-if="showClose">
                  <i class="el-icon-close"> X </i>
              </span>
              <hr v-if='showLine' class="cutline">
              <div class="modal-body">
                  <slot>{{content}}</slot>
              </div>
              <hr v-if='showLine' class="cutline">
              <slot name="other" ></slot>
              <div class="modal-footer"  v-if="showFooter">
                  <slot name="footer" v-if="btnChange">
                      <el-button @click="comfirm" v-if="showComfirm">{{ comfirmText }}</el-button>
                      <el-button @click="cancel" type="primary">
                          {{ cancelText }}
                      </el-button>
                  </slot>
                  <slot name="footer" v-else>
                      <el-button @click="cancel" v-if="showCancel">{{ cancelText }}</el-button>
                      <el-button type="primary" v-if="showComfirm" @click="comfirm" :disabled="comfirmBtnDisabled || (loading || saveLoading)" :class="{'loading-btn':loading || saveLoading}">
                          <Loading v-show="loading || saveLoading"/>
                          {{ comfirmText }}
                      </el-button>
                  </slot>
              </div>
          </div>
        </transition>
    </div>
</template>
<script>
export default {
  name: 'modal'
}
</script>
<script setup>
import Loading from '../loading'
import {toRefs , computed, ref ,watch ,onMounted, onUnmounted} from 'vue'
  const props = defineProps({
    transitionPosition: {
      type: String,
      default: 'y'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '提示'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    comfirmText: {
      type: String,
      default: '保存'
    },
    comfirmBtnDisabled: {
      type: Boolean,
      default: false
    },
    content: {
      type: String
    },
    draggable: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    // close 和 cancel 方法一致
    syncCancel: {
      type: Boolean,
      default: true
    },
    // @cancel & @comfirm 事件互换
    btnChange: Boolean,
    showLine: {
      type: Boolean,
      default: false
    },
    showComfirm: {
      type: Boolean,
      default: true
    }
  })

  const {
    transitionPosition,
    modelValue,
    showHeader,
    title,
    cancelText,
    comfirmText,
    comfirmBtnDisabled,
    content,
    draggable,
    maskClosable,
    showClose,
    showCancel,
    showFooter,
    loading,
    syncCancel, 
    btnChange,
    showLine,
    showComfirm } = toRefs(props)
  
  const modalRef = ref()
  const visibleValue = modelValue.value
  const visible = ref(visibleValue)
  const modalShow= ref(false)
  const saveLoading = ref(false)
  // directives: {
  //   drag: {
  //     bind (el, binding) {
  //       if (binding.value) {
  //         const $header = el.querySelector('.modal-header')
  //         const { width: docW, height: docH } = document.body.getBoundingClientRect()
  //         $header.onmousedown = function (e) {
  //           const { width: modalW, height: modalH } = el.getBoundingClientRect()
  //           const disX = e.clientX - el.offsetLeft
  //           const disY = e.clientY - el.offsetTop
  //           document.onmousemove = function (e) {
  //             let l = e.clientX - disX
  //             let t = e.clientY - disY
  //             if (l < 0) {
  //               l = 0
  //             }
  //             if (l >= docW - modalW) {
  //               l = docW - modalW
  //             }
  //             if (t < 0) {
  //               t = 0
  //             }
  //             if (t >= docH - modalH) {
  //               t = docH - modalH
  //             }
  //             el.style.position = 'fixed'
  //             el.style.left = l + 'px'
  //             el.style.top = t + 'px'
  //             // console.log(`left:${l}`)
  //           }
  //           document.onmouseup = function (e) {
  //             document.onmousemove = null
  //             document.onmouseup = null
  //           }
  //         }
  //       }
  //     }
  //   }
  // },
  const emit = defineEmits(['close','update:modelValue','comfirm','cancel','leave'])
  const maskClose  = () =>{
    if (maskClosable.value) {
      close()
    }
  }
  const close  = () =>{
    if (syncCancel.value) {
      cancel()
    } else {
      emit('close')
    }
  }
  const comfirm  = () =>{
    emit('comfirm')
  }
  const cancel  = () =>{
    emit('cancel')
    emit('update:modelValue', false)
  }
  const leave =(el, done) =>{
    modalShow.value = false
    emit('leave', el, done)
    if (draggable.value && el.style.position === 'fixed') {
      // 还原偏移位置
      el.style.position = 'relative'
      el.style.left = ''
      el.style.top = ''
    }
  }
  watch(
    ()=>props.modelValue,
    (val) =>{
      visible.value = val
        if (!val) {
        } else {
          modalShow.value = true
        }
    },{ immediate: true, deep: true })
  onMounted (()=> {
    // modalShow.value = visible.value
  })
  onUnmounted (()=>{
    // if (appendToBody.value && this.$el) {
    //   this.$el.parentNode.removeChild(this.$el)
    //   modalShow.value = false
    // }
  }) 

  defineExpose({
    visible,
    saveLoading,
    modalRef
  });
  </script>
