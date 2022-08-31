<template>
  <div>
    <Button type="primary" @click="showMessageTip">showMessageTip</Button>
    <Button type="primary" @click="showMessageBox">showMessageBox</Button>
    <Button type="primary" @click="showModal">showModal</Button>

    <!-- 在 vue2 中，v-model 是 @input事件与v-bind:value的结合体 -->
    <!-- vue3使用v-model替代vue2的v-bind.sync -->
    <!-- 这里的v-model本质上是:modelValue=“值”，@update:modelValue="值 = $event"这二者的缩写 -->
    <Modal title="批量" v-model="modelValue" @comfirm="handleSave" @cancel="handleSave">
      <div>
        <el-input type="textarea" autofocus v-model="inputStr"></el-input>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import {messageBox, messageTip} from '@/components/widgets/message'
import Modal from '@/components/widgets/modal'
import Button from '@/components/widgets/button'
import { onMounted, ref } from "vue";

const showMessageTip =  ()=>{
  messageTip.$success()
}

const showMessageBox =  ()=>{
  messageBox.$success({
    showClose: true,
    title: '成功提示',
    content: '该操作已成功',
  })
}

const inputStr = ref('')
const modelValue = ref(false)
const showModal = ()=>{
  modelValue.value = true
}
const handleSave = ()=>{
  modelValue.value = false
}

</script>

<style lang="scss" scoped>

</style>