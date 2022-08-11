let xmlValidatorPattern = getXmlValidator()
// let xmlOnlySymbolPattern = /[\u4e00-\u9fa5a-z0-9A-Z]/ug
let xmlOnlySymbolPattern = /[\p{Unified_Ideograph}a-z0-9A-Z*]/ug

function getXmlValidator () {
  let configRegx = ''
  const systemConfigs = localStorage.getItem('systemConfigs')
  if (systemConfigs) {
    const configStr = JSON.parse(systemConfigs).preg_name_global
    const strPattern = configStr.slice(1, configStr.length - 1)
    configRegx = new RegExp(strPattern)
  }
  xmlValidatorPattern = configRegx
  return configRegx
}

const xmlValidator = {
  validator: (rule, value, callback) => {
    const $pattern = getXmlValidator()
    if (value && $pattern.test(value)) {
      callback(new Error('请不要输入非法字符'))
    }
    callback()
  },
  trigger: ['change', 'blur']
}

const xmlValidatorOnlySymbol = {
  validator: (rule, value, callback) => {
    const $pattern = xmlOnlySymbolPattern
    if (value && !value.match($pattern)) {
      return callback(new Error('请输入有效字符')) // 不能只输入特殊字符
    }
    callback()
  },
  trigger: ['change', 'blur']
}
const phoneValidator = /^(\+86)?-?1[3-9]\d{1}-?\d{4}-?\d{4}$/
const telValidator = /^(0[1-9]\d{1,2})+(-?\d{1,20})+$/
const commonValidator = /^[A-Za-z0-9_]+$/
const urlValidator = /(http|https):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/

const usefullMobile = (rule, value, callback) => {
  if (!value.length || value.length === 0) {
    return callback(new Error('请输入手机号'))
  }
  if (!(phoneValidator.test(value))) {
    return callback(new Error('手机号码有误，请重填'))
  }
  callback()
}
// 校验移动和固话
const telphoneRegx = /(^(\+86)?-?1[3-9]\d{1}-?\d{4}-?\d{4}$)|(^(0[1-9]\d{1,2})+(-?\d{1,20})+$)/
const validatorTelPhone = (rule, value, callback) => {
  if (value && !telphoneRegx.test(value)) {
    return callback(new Error('号码有误，请重填'))
  }
  callback()
}
export {
  getXmlValidator,
  xmlValidatorPattern,
  xmlValidator,
  phoneValidator,
  telValidator,
  usefullMobile,
  validatorTelPhone,
  commonValidator,
  urlValidator,
  xmlOnlySymbolPattern,
  xmlValidatorOnlySymbol
}
