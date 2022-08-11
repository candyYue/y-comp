<template>
   <button :class="buttonClasses" :disabled="buttonDisabled" @click="handleClick">
       <i class="icon-loading" v-if="loading"></i>
       <i :class="icon" v-if="icon && !loading"></i>
       <slot></slot>
   </button>
</template>

<script>
export default {
  name: `${prefixCls}-button`,
};
</script>
<script setup>
import { prefixCls } from '@/utils/config'
import { defineProps ,toRefs , computed, defineEmits } from 'vue'
const props = defineProps({
  type: {
      type: String,
      default: 'primary'
    },
    size: {
        type: String,
        default: 'medium'
    },
    icon: {
        type: String,
        default: ''
    },
    loading: Boolean,
    buttonDisabled:Boolean
})
const {type, size, icon, loading, buttonDisabled} = toRefs(props)
const buttonClasses = computed(()=>{
  return [`${prefixCls}-button`, `button-${type.value}`,`button-${size.value}` ]
})

const emit = defineEmits(['click'])
const handleClick = (e) => {
  emit('click', e)
}

</script>