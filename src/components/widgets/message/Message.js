import { createApp ,getCurrentInstance,h, ref } from 'vue'
import Modal from '../modal'
import { uniqueId } from '../../../utils/helper/assist'
/* eslint-disable */
// import merge from "element-ui/src/utils/merge"
// type :
// MessageTip:info/success/error
// MessageBox:warning/success

const merge =
  (...sources) => Object.assign({}, ...sources);

const transitions = {
  'transition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'MozTransition': 'transitionend',
  'WebkitTransition': 'webkitTransitionEnd'
}
// 回车确定
const enterAction = (callback)=>{
  document.onkeydown = function (e) { 
// 兼容FF和IE和Opera
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    if (code == 13) {
          callback()
      }
  }
}
/**
 * Message
 */
class Message {
  constructor() {
    this.uniqueId = uniqueId()
  }
  show(opts) {
    const self = this;
    const msg = this.render(opts)
    const msgElement = msg
    this.msgElement = msgElement
    let timer = null;
    const div = document.createElement('div')
    div.classList.add(this.uniqueId)
    document.body.appendChild(div)
    msgElement.mount(div)
    if (opts.duration && !opts.showClose) {
      if(opts.callbackMethod==='immediately'){
        opts.callback()
        timer = setTimeout(() => {
          self.close(msgElement);
          clearTimeout(timer);
        }, opts.duration + opts.animationDuration)
      }else{
        timer = setTimeout(() => {
          self.close(msgElement, opts.callback);
          clearTimeout(timer);
        }, opts.duration + opts.animationDuration)
      }
    }
    return this
  }
  close() {
    let flag = true;
    const element = document.querySelector('.message-tip')
    const elementP = document.querySelector(`.${this.uniqueId}`)
    element.classList.add('fade-up');
    const transitionEvent = (() => {
      for (let t in transitions) {
        return (element.style[t] !== undefined) && transitions[t]
      }
    })()
    elementP.addEventListener(transitionEvent, (event) => {
      flag && document.body.removeChild(elementP)
      flag = false;
    }, false);
  }
  render(opts) {
    const self = this;
    if (opts.name === 'message-tip') {
      return createApp({
        name: opts.name,
        render() {
          return h('div', {
            class: ['message-tip', `message-${opts.icon}`, opts.extraClass],
            style: {
              top: `${opts.top}px`,
              animation: `${opts.animationName} ${opts.animationDuration / 1000}s`
            }
          }, [
            h('i', {
              class: ['icon-message', `icon-message-${opts.icon}`]
            }), 
            opts.link? ([
              h('span', opts.content[0]),
              h('a',{
                class: ['icon-message-link'],
                onClick(e){
                  opts.linkCallback && opts.linkCallback()
                }}, opts.linkContent),
              h('span', opts.content[1])]) :opts.content,
            opts.showClose ? h('i',{
              class: ['icon-message-close','el-icon-close'],
              onClick(e){
                self.close(self.msgElement, opts.callback)
              }
            }) : ''
          ])
        }
      })
    }
    if (opts.name === 'message-box') {
      const {
        modelValue,
        title,
        showCancel,
        comfirmText,
        cancelText,
        maskClosable,
        btnChange,
        showClose,
        showComfirm = true,
        syncCancel = false,
        showLoading = false
      } = opts;
      const attrs = {
        modelValue,
        title,
        showCancel,
        comfirmText,
        cancelText,
        maskClosable,
        btnChange,
        showClose,
        syncCancel,
        showComfirm
      }
      return createApp({
        name: "message-box",
        render() {
          const childModal = ref()
          enterAction(()=>{
            opts.successCallback && opts.successCallback()
            childModal.value.visible = false
          })
          return h(Modal, {
            ref: childModal,
            class: ['message-box', 'fade-in', 'modal-open', `message-box-${opts.icon}`, opts.extraClass],
            ...attrs,
            //事件监听器应以 onXxx 的形式书写
            onClose() {
              enterAction(()=>{return false})
              childModal.value.visible = false
            },
            onCancel() {
              enterAction(()=>{return false})
              opts.cancelCallback && opts.cancelCallback();
              childModal.value.visible = false
            },
            onComfirm() {
              if (opts.showLoading && opts.successCallback) {
                childModal.value.saveLoading = true
                let backfuc = opts.successCallback()
                backfuc.then(res => {
                  childModal.value.saveLoading = false
                  childModal.value.visible = false
                })
              } else {
                opts.successCallback && opts.successCallback()
                childModal.value.visible = false
              }
            },
            onLeave() {
              enterAction(()=>{return false})
              const div = document.querySelector(`.${self.uniqueId}`)
              document.body.removeChild(div);
            },
          }, [
            h('div', {
              class: ['message-content'],
            }, [
              h('i', {
                class: ['icon-message', `icon-message-${opts.icon}`]
              }),
              h('div',{
                innerHTML: opts.content
              })
            ])
          ])
        },
      })
    }
  }
}

/**
 * MessageTip
 */
class MessageTip extends Message {
  constructor(...arg) {
    super(...arg)
    this.defaults = {
      name: "message-tip",
      duration: 2500,
      extraClass: "",
      showClose: false,
      animationName: 'message-tip',
      animationDuration: 500,
      callback: () => {}
    }
  }
  $info(opts) {
    const defaults = {
      icon: "info",
      content: "消息提示信息"
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
  $success(opts) {
    const defaults = {
      icon: "success",
      content: "成功提示信息"
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
  $error(opts) {
    const defaults = {
      icon: "error",
      content: "错误提示信息"
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
  $warning(opts) {
    const defaults = {
      icon: "warning",
      content: "警告提示信息"
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
}

/**
 * MessageBox
 */
class MessageBox extends Message {
  constructor(...args) {
    super(...args)
    this.defaults = {
      name: "message-box",
      modelValue: true,
      showCancel: true,
      comfirmText: "确定",
      cancelText: '取消',
      maskClosable: false,
      extraClass: "",
      btnChange: false,
      showLoading: false
    }
  }

  $warning (opts) {
    const defaults = {
      title: "警告",
      icon: "warning",
      maskClosable: true
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
  $error (opts) {
    const defaults = {
      title: "错误",
      icon: "error",
      maskClosable: true
    }
    return this.show(merge(this.defaults, defaults, opts))
  }

  $success (opts) {
    const defaults = {
      title: "成功",
      icon: "success",
      showCancel: false,
      comfirmText: "我知道了",
      showClose: false
    }
    return this.show(merge(this.defaults, defaults, opts))
  }
}

const messageTip = new MessageTip();
const messageBox = new MessageBox();

export {
  messageBox,
  messageTip,
  MessageTip
};
