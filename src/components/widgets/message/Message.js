import Vue from 'vue'
import Modal from './Modal'
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
  constructor() {}
  show(opts) {
    const self = this;
    const msg = this.render(opts)
    const msgElement = msg.$mount().$el;
    this.msgElement = msgElement
    let timer = null;

    document.body.appendChild(msgElement)
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
  close(element = this.msgElement, callback) {
    let flag = true;
    element.classList.add('fade-up');
    const transitionEvent = (() => {
      for (let t in transitions) {
        return (element.style[t] !== undefined) && transitions[t]
      }
    })()
    element.addEventListener(transitionEvent, (event) => {
      if (callback) {
        flag && document.body.removeChild(element) && callback()
      } else {
        flag && document.body.removeChild(element)
      }
      flag = false;
    }, false);
  }
  render(opts) {
    const self = this;
    if (opts.name === 'message-tip') {
      return new Vue({
        name: opts.name,
        render(h) {
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
                on:{
                click(e){
                  opts.linkCallback && opts.linkCallback()
                }}}, opts.linkContent),
              h('span', opts.content[1])]) :opts.content,
            opts.showClose ? h('i',{
              class: ['icon-message-close','el-icon-close'],
              on:{
                click(e){
                  self.close(self.msgElement, opts.callback)
                }
              }
            }) : ''
          ])
        }
      })
    }
    if (opts.name === 'message-box') {
      const {
        value,
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
        value,
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
      return new Vue({
        name: "message-box",
        render(h) {
          const messageBoxVnod = this;
          enterAction(()=>{
            opts.successCallback && opts.successCallback()
            messageBoxVnod.$refs.message.visible = false
          })
          return h('Modal', {
            class: ['message-box', 'fade-in', 'modal-open', `message-box-${opts.icon}`, opts.extraClass],
            attrs,
            on: {
              close() {
                enterAction(()=>{return false})
                messageBoxVnod.$refs.message.visible = false
              },
              cancel() {
                enterAction(()=>{return false})
                opts.cancelCallback && opts.cancelCallback();
                messageBoxVnod.$refs.message.visible = false
              },
              comfirm() {
                if (opts.showLoading && opts.successCallback) {
                  messageBoxVnod.$refs.message.saveLoading = true
                  let backfuc = opts.successCallback()
                  backfuc.then(res => {
                    messageBoxVnod.$refs.message.saveLoading = false
                    messageBoxVnod.$refs.message.visible = false
                  })
                } else {
                  opts.successCallback && opts.successCallback()
                  messageBoxVnod.$refs.message.visible = false
                }
              },
              leave() {
                enterAction(()=>{return false})
                document.body.removeChild(messageBoxVnod.$refs.message.$mount().$el);
              }
            },
            ref: 'message'
          }, [
            // h('i', {
            //   class: ['icon-message', `icon-message-${opts.icon}`]
            // }),
            h('div', {
              class: ['message-content'],
            }, [
              h('i', {
                class: ['icon-message', `icon-message-${opts.icon}`]
              }),
              h('div',{
                domProps: {
                    innerHTML: opts.content
                }
              })
            ])
          ])
        },
        components: {
          Modal
        }
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
      value: true,
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
