<template>
  <div class="el-radio-group common-radio">
    <label v-for="button in buttons" :key="button.value"
      :class="['el-radio-button', !!useable ? '' : 'is-disabled']"
      @click="change(button)"
    >
        <span :class="['el-radio-button__inner', {'el-radio-button__active': button.value === switchValue}]" >{{button.label}}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'switch-button',
  props: {
    autoChange: {
      type: Boolean,
      default: true
    },
    value: [String, Number, Boolean],
    buttons: {
      type: Array,
      default: () => {
        return [
          {
            label: '启用',
            value: 1
          },
          {
            label: '停用',
            value: 0
          }
        ]
      }
    },
    useable: {
      type: [Boolean, Number],
      default: true
    },
    beforeChange: Function
  },
  data () {
    return {
      switchValue: this.value,
      disabled: false
    }
  },
  watch: {
    value (val) {
      this.switchValue = val
      this.disabled = false
    }
  },
  methods: {
    change (button) {
      if (this.disabled || !this.useable) {
        return false
      }
      let pass = true
      if (this.beforeChange) {
        pass = this.beforeChange()
      }
      if (pass) {
        const changeState = button.value !== this.switchValue
        if (this.autoChange && changeState) {
          this.switchValue = button.value
          this.$emit('change', button.value)
          this.$emit('input', button.value)
          return
        }
        if (changeState) {
          this.$emit('change', button.value)
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/core.scss";
.el-radio-button__inner{
  padding: 7px 25px;
}
.el-radio-button__active{
  background-color: $theme-color;
  color: #fff;
  border-color: $theme-color;
  box-shadow: -1px 0 0 0 $theme-color;
}
.is-disabled {
  span.el-radio-button__inner {
    color: #c0c4cc;
    border-color: #dcdfe6;
    cursor: no-drop;
  }
  span.el-radio-button__active {
    background-color: #f2f6fc;
    box-shadow:-1px 0 0 0 #dcdfe6;
  }
}
</style>
