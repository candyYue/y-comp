<template>
  <div>
    <Button type="primary" @click="handleClick">默认按钮</Button>
    <Button type="info" loading>信息按钮</Button>
    <Button type="warning" size="small">警告按钮</Button>
    <Button type="danger">危险按钮</Button>
    <Button type="primary" :buttonDisabled="true">危险按钮</Button>
  </div>
</template>

<script setup>
import Button from '@/components/widgets/button'
const handleClick = () => {
  console.log('按钮点击了')
}
</script>