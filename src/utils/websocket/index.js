class WebsocketServeice {
  constructor (url, callback) {
    this.url = url // ws地址
    this.ws = null
    this.messageBack = callback

    this.lockReconnect = false // 是否正在重连
    this.reconnectTimer = null // 页面定时器
    this.reconnectTime = 0 // 页面定时器

    this.connect()
  }
  // 初始化连接
  async connect () {
    if (window.WebSocket) {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = event => {
        console.log(`${this.url}连接成功`)
        this.getMessage()
      }
      this.ws.onerror = event => {
        console.log(`${this.url}连接错误`)
        this.reconnect()
      }
    } else {
      console.log('This browser does not supports WebSocket')
    }
  }
  // 接收消息
  getMessage () {
    this.ws.onmessage = event => {
      // 更新状态 更新页面数据
      if (event && event.data) {
        const value = JSON.parse(event.data)
        this.messageBack(value)
      }
    }
  }
  // 失败重连
  reconnect () {
    if (this.lockReconnect || this.reconnectTime >= 3) {
      return false
    }
    this.lockReconnect = true
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTime++
      this.lockReconnect = false
      this.connect()
    }, 2000)
  }
  // 发送消息
  send (val) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(val)
    }
  }
  close () {
    console.log(`断开连接`)
    this.ws && this.ws.close()
    this.reconnectTimer && clearTimeout(this.reconnectTimer)
  }
}
export default WebsocketServeice
