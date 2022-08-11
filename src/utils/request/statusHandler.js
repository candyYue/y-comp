import { messageTip } from '@/components/feedback/Message'
import { UserType, UserRole } from '../config/types'
import AuthControl from '../helper/authControl'
import router from '../../pages/AICall/router'

export default {
  0: response => response,
  40101: (response) => {
    console.log('获取token失败')
  },
  'error': (response) => { // 其他错误
    messageTip.$info({
      content: response.data.info
    })
  },
  'timeout': () => {
    messageTip.$info({
      content: '请求超时'
    })
  },
  'network': () => { // 服务器异常
    messageTip.$info({
      content: '网络请求异常'
    })
  },
}
