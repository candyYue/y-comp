import store from '@/store'
import _ from 'lodash'
import { messageTip } from '@/components/feedback/Message'
import { UserType, UserRole } from '../config/types'

class AuthControl {
  constructor () {
    this.permissions = {}
    this.authMenus = []

    this.type = localStorage.getItem('type')
  }

  routerLogin = {
    name: 'login'
  }

  get routerHome () {
    const type = localStorage.getItem('type')
    const role = localStorage.getItem('role')
    const isEnterprise = _.isEqual(type, UserType['enterprise'])
    const isAgent = localStorage.getItem(`Enterp${this.eid}`)

    if (isEnterprise || isAgent) { // 企业登录用户或企业代理用户
      const menu = this.authMenus
      if (!menu || menu.length === 0) {
        localStorage.clear()
        return UserRole[role].login
      }
      const first = _.head(menu)
      let key = _.replace(first.name, 'module_', 'AICall-')
      // 对script 有子级的处理
      const notLast = first.children && first.children.some(child => child.children.length)
      if (notLast) {
        key = key + '-' + first.children[0].name
      }
      return {
        name: key,
        params: {
          eid: this.eid
        }
      }
    }

    return UserRole[role].home
  }

  /**
   * @description 登录页路由守卫
   */
  async loginGuard (to, from, next) {
    const loginStatus = this._loginCheck()
    const type = localStorage.getItem('type')
    const isEnterprise = _.isEqual(type, UserType['enterprise'])
    if (loginStatus && isEnterprise) {
      await this.getPermissions()
      next(this.routerHome)
      return
    }
    next()
  }
  /**
   * @description 进入企业系统路由守卫
   */
  async AICallGuard (to, from, next) {
    const loginStatus = this._loginCheck()
    if (!loginStatus) {
      next(this.routerLogin)
      return
    }

    const permissionStatus = await this._permissionCheck(to)
    if (!permissionStatus) {
      const redirect = await this.redirect()
      next(redirect)
      return
    }
    if (+to.params.eid !== this.eid) { /** 强制输入错误eid */
      next(this.routerHome)
      return
    }
    let authority = to.meta.authority[0]
    if (to.params.id && (to.params.id !== 'new') && to.meta.authority.length > 1) {
      authority = to.meta.authority[1]
    }

    const redirect = this.permissions[authority] ? this.permissions[authority].redirect : ''
    if (redirect) {
      next({
        name: redirect,
        params: {
          eid: this.eid
        }
      })
      return
    }

    next()
  }

  /**
   * @description 登录状态后确定跳转地址
   */
  async redirect () {
    await this.getPermissions()

    const menu = this.authMenus
    if (menu.length === 0) { // 权限禁用或无浏览权限
      messageTip.$warning({
        content: '您无权限访问该页面'
      })
      return this.routerLogin
    }
    return this.routerHome
  }

  async agent (to, from, next) {
    await store.dispatch('AICall/getLoginInfo', { eid: to.params.eid })
    await this.getPermissions()
    next(this.routerHome)
  }

  async getPermissions () {
    this.permissions = store.getters['AICall/permissions']
    if (_.isEmpty(this.permissions)) {
      try {
        await store.dispatch('AICall/getAuthorityTree', { canRepeat: true })
      } catch (err) {
        console.log('getPermissions->', err)
      }
      this.permissions = store.getters['AICall/permissions']
    }
    this.authMenus = store.getters['AICall/menuTree']
    // console.log(this.permissions)
    return this.permissions
  }

  _loginCheck () {
    const Eps = Object.keys(localStorage).filter(v => v.includes('Enterp')) || []
    const localType = localStorage.getItem('type')
    let eid = +location.pathname.split('/')[2]

    if (localType === UserType.admin) {
      this.eid = eid
      console.log('代理用户', eid)
      return !!Eps.find(epKey => +epKey.replace('Enterp', '') === eid)
    }

    if (localType === UserType.enterprise && Eps.length) {
      eid = +JSON.parse(localStorage.getItem(Eps[0])).eid
      this.eid = eid
      return true
    }

    return false
  }

  _permissionCheck (to) {
    const {
      meta: {
        authority = []
      }
    } = to

    return this.getPermissions()
      .then(permissions => {
        const allow = authority.some(d => permissions[d])
        return allow
      })
      .catch((err) => {
        console.info(err)
        return false
      })
  }
}

export default AuthControl
