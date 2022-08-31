import {
  xmlValidator,
  xmlValidatorPattern,
  xmlValidatorOnlySymbol,
  xmlOnlySymbolPattern
} from './index'


const validPassword = (rule, value, callback) => {
  if (value.trim().length < 8 || value.trim().length > 20) {
    callback(new Error('密码长度不符合标准'))
  } else if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,20}$/.test(value))) {
    callback(new Error('密码不符合要求'))
  } else {
    callback()
  }
}
const validUsername = (rule, value, callback) => {
  if (value.trim().length < 4 || value.trim().length > 24) {
    callback(new Error('账号名称长度不符合标准'))
  } else if (!(/^[a-zA-Z0-9_]{4,24}$/.test(value))) {
    callback(new Error('账号名称不符合要求'))
  } else {
    callback()
  }
}

export {
  validPassword,
  validUsername
}
