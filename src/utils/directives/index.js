import Store from '@/store'
import { UserType } from '@/utils/config/types'

export const numberOnly = {
  bind (el, binding, vnode) {
    const $this = vnode.componentInstance
    const $el = el.querySelector('input')
    el.handler = (e) => {
      let value = e.target.value.replace(/\D+/, '')
      if (binding.value && Number(value) > binding.value.max) {
        value = binding.value.max
      }
      if (binding.value && value && Number(value) < binding.value.min) {
        value = binding.value.min
      }
      setTimeout(() => {
        $this.$emit('input', value)
      }, 0)
    }
    $el.addEventListener('input', el.handler)
  },
  unbind (el) {
    const $el = el.querySelector('input')
    $el.removeEventListener('input', el.handler)
  }
}

export const toolTip = {
  bind (el, binding, vnode) {
    if (!binding.value) {
      return false
    }
    el.bindingValue = binding.value
    const transitionTime = 450
    const initToolTip = () => {
      const $toolTip = document.createElement('span')
      $toolTip.classList.add('table-icon-tool-tip')
      $toolTip.innerHTML = el.bindingValue
      document.body.appendChild($toolTip)
      el.toolTipWidth = $toolTip.getBoundingClientRect().width + 'px'
      return $toolTip
    }
    el.fadeInHandler = () => {
      el.$toolTip = el.$toolTip || initToolTip()
      const {
        x, y, left, top,
        width
      } = el.getBoundingClientRect()
      el.$toolTip.style.display = 'block'
      const timer = setTimeout(_ => {
        el.$toolTip.style.left = ((x || left) + (width / 2)) + 'px'
        el.$toolTip.style.top = ((y || top) + 25) + 'px'
        el.$toolTip.style.opacity = 1
        el.$toolTip.style.width = el.toolTipWidth
        el.$toolTip.style.width = el.toolTipWidth
        clearTimeout(timer)
      }, 0)
    }
    el.fadeOutHandler = () => {
      if (el.$toolTip) {
        el.$toolTip.style.opacity = 0
        const timer = setTimeout(_ => {
          el.$toolTip.style.display = 'none'
          clearTimeout(timer)
        }, transitionTime)
      }
    }

    el.addEventListener('mouseenter', el.fadeInHandler)
    el.addEventListener('mouseleave', el.fadeOutHandler)
  },
  unbind (el) {
    el.$toolTip && document.body.removeChild(el.$toolTip)
    el.removeEventListener('mouseenter', el.fadeInHandler)
    el.removeEventListener('mouseleave', el.fadeOutHandler)
  },
  update (el, binding) {
    el.bindingValue = binding.value
    const $toolTip = el.$toolTip
    if ($toolTip) {
      $toolTip.innerHTML = el.bindingValue
    }
  }
}

export const leftTip = {
  bind (el, binding, vnode) {
    const transitionTime = 450
    const initToolTip = () => {
      const $toolTip = document.createElement('span')
      $toolTip.classList.add('table-icon-tool-tip')
      let speed = +el.innerText || 50
      $toolTip.innerHTML = `当前语速${speed}, ${speed > 50 ? '较快' : (speed < 50 ? '较慢' : '标准')}`
      document.body.appendChild($toolTip)
      el.toolTipWidth = $toolTip.getBoundingClientRect().width + 10 + 'px'
      return $toolTip
    }
    el.fadeInHandler = () => {
      el.$toolTip = el.$toolTip || initToolTip()
      const {
        x, y, left, top,
        width
      } = el.getBoundingClientRect()
      el.$toolTip.style.display = 'block'
      const timer = setTimeout(_ => {
        el.$toolTip.style.left = ((x || left) - width - 46) + 'px'
        el.$toolTip.style.top = (y || top) + 'px'
        el.$toolTip.style.opacity = 1
        el.$toolTip.style.width = el.toolTipWidth
        el.$toolTip.style.width = el.toolTipWidth
        clearTimeout(timer)
      }, 0)
    }
    el.fadeOutHandler = () => {
      if (el.$toolTip) {
        el.$toolTip.style.opacity = 0
        const timer = setTimeout(_ => {
          el.$toolTip.style.display = 'none'
          clearTimeout(timer)
        }, transitionTime)
      }
    }

    el.addEventListener('mouseenter', el.fadeInHandler)
    el.addEventListener('mouseleave', el.fadeOutHandler)
  },
  unbind (el) {
    el.$toolTip && document.body.removeChild(el.$toolTip)
    el.removeEventListener('mouseenter', el.fadeInHandler)
    el.removeEventListener('mouseleave', el.fadeOutHandler)
  },
  update (el, binding) {
    const $toolTip = el.$toolTip
    if ($toolTip) {
      let speed = +binding.value
      $toolTip.innerHTML = `当前语速${speed}, ${speed > 50 ? '较快' : (speed < 50 ? '较慢' : '标准')}`
    }
  }
}

export const permission = {
  bind (el, binding) {
    if (!binding.value) {
      return
    }
    const { effect = 'disabled', name: authority, pushStatus = 0, unhandle } = binding.value
    // const type = localStorage.getItem('type')
    if (unhandle) {
      return
    }
    if (!Store.getters['AICall/permissions'][authority]) {
      if (effect === 'hidden') {
        el.parentNode.removeChild(el)
      } else if (effect === 'class') {
        el.classList.add('disabled')
      } else {
        el[effect] = true
      }
    } else {
      if (+pushStatus === 1) {
        el[effect] = true
      } else {
        // el[effect] = false
      }
    }
  }
}

// 一位小数
export const floatOnly = {
  bind (el, binding, vnode) {
    const $this = vnode.componentInstance
    const $el = el.querySelector('input')
    el.handler = (e) => {
      let value = e.target.value.replace(/[^0-9.]+/, '')
      let numberArr = value.split('.')
      if (numberArr.length >= 2) {
        value = numberArr[0] + '.' + numberArr[1]
        if (numberArr[1] !== '') {
          value = (+value).toFixed(1)
        }
      }
      if (binding.value && binding.value.max && value > binding.value.max) {
        value = binding.value.max
      }
      if (binding.value && binding.value.min && value < binding.value.min) {
        value = binding.value.min
      }
      setTimeout(() => {
        $this.$emit('input', value)
      }, 0)
    }
    $el.addEventListener('input', el.handler)
  },
  unbind (el) {
    const $el = el.querySelector('input')
    $el.removeEventListener('input', el.handler)
  }
}
