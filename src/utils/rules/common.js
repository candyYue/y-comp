import {
  xmlValidator,
  xmlValidatorPattern,
  xmlValidatorOnlySymbol,
  xmlOnlySymbolPattern
} from './index'

const requiredContent = {
  required: true,
  message: '请输入话术内容',
  trigger: ['blur', 'change']
}

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

// 话术校验规则
const scriptRules = {
  'title': [
    {
      required: true,
      message: '请输入话术名称',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        if (xmlValidatorPattern.test(value)) {
          return callback(new Error('请不要输入非法字符'))
        }
        if (!value.match(xmlOnlySymbolPattern)) {
          return callback(new Error('不能只输入特殊符号'))
        }
        callback()
      },
      trigger: ['blur', 'change']
    }
  ],
  'priorityNum': [
    // { required: true, message: '请选择优先级' }
  ],
  'noinput[0].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'noinput[1].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'noinput[2].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'nomatch[0].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'nomatch[1].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'nomatch[2].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'manualfail[0].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'intention.instruct': {
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择技能组'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  },
  'intention.text': [{
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入话术'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol],
  'session.instruct': {
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择技能组'))
      }
      if (value.value && !value.text) {
        return callback(new Error('请输入话术'))
      }
      callback()
    }
  },
  'session.text': [{
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入话术'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol],
  'maxquestions[0].count': {
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入次数'))
      }
      callback()
    }
  },
  'maxquestions[0].text': [{
    validator: (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入话术'))
      }
      callback()
    },
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol]
}
// 话术节点校验规则
// const ivrnodeRules = {
//   script: [{
//     required: true,
//     message: '请输入话术',
//     trigger: ['blur', 'change']
//   },
//   {
//     validator: (rule, value, callback) => {
//       if (!value.trim().length) {
//         callback(new Error('请输入话术'))
//       }
//       if (xmlValidatorPattern.test(value)) {
//         callback(new Error('请不要输入非法字符'))
//       } else {
//         callback()
//       }
//     },
//     trigger: ['blur', 'change']
//   }
//   ]
// }
// 开场白校验规则
const prologueRules = {
  'title': [
    {
      required: true,
      message: '请输入话术名称',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        if (xmlValidatorPattern.test(value)) {
          callback(new Error('请不要输入非法字符'))
        } if (!value.match(xmlOnlySymbolPattern)) {
          callback(new Error('不能只输入特殊符号'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  'noinput[0].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'noinput[1].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol],
  'noinput[2].text': [requiredContent, xmlValidator, xmlValidatorOnlySymbol]
}
// 聚类校验规则
const clusterRules = {
  title: [{
    required: true,
    message: '请输入聚类名称',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol],
  name: [{
    required: true,
    message: '请输入聚类名称',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol]
}
// 字段校验规则
const testValidator = {
  validator: (rule, value, callback) => {
    const $pattern = /[<>&'"]{1,}/
    if (value && $pattern.test(value)) {
      callback(new Error('请不要输入非法字符'))
    }
    callback()
  },
  trigger: ['change', 'blur']
}
const fieldsRules = {
  title: [{
    required: true,
    message: '请输入字段内容',
    trigger: ['blur', 'change']
  },
  xmlValidator, xmlValidatorOnlySymbol,
  {
    validator: (rule, value, callback) => {
      const $pattern = /[#]{1,}/
      if (value && $pattern.test(value)) {
        callback(new Error('请不要输入非法字符'))
      }
      callback()
    },
    trigger: ['change', 'blur']
  }
  ],
  test_value: [{
    required: true,
    message: '请输入测试值',
    trigger: ['blur', 'change']
  },
  testValidator, xmlValidatorOnlySymbol
  ]
}
// 标签校验规则
const labelsRules = {
  title: [{
    required: true,
    message: '请输入标签内容',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol]
}
// 短信校验规则
const messagesRules = {
  title: [
    {
      required: true,
      message: '请输入短信名称',
      trigger: ['blur', 'change']
    },
    xmlValidator, xmlValidatorOnlySymbol],
  content: [{
    required: true,
    message: '请输入短信内容',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol],
  remark: [xmlValidator, xmlValidatorOnlySymbol]
}
// 权限/账号 校验规则
const accountRules = {
  realname: [{
    required: true,
    message: '请输入姓名',
    trigger: ['blur', 'change']
  }],
  username: [{
    required: true,
    message: '请输入账号名称',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol, {
    validator: validUsername,
    trigger: 'none'
  }],
  pwd: [{
    required: true,
    message: '请输入密码',
    trigger: ['blur', 'change']
  }, {
    validator: validPassword,
    trigger: 'none'
  }]
}
// 权限/角色 校验规则
const roleRules = {
  name: [{
    required: true,
    message: '请输入角色名称',
    trigger: ['blur', 'change']
  }, xmlValidator, xmlValidatorOnlySymbol],
  data_type: [{
    required: true,
    message: '请选择数据权限',
    trigger: ['blur', 'change']
  }]
}
export {
  scriptRules,
  // ivrnodeRules,
  clusterRules,
  fieldsRules,
  labelsRules,
  messagesRules,
  accountRules,
  roleRules,
  prologueRules,
  validPassword
}
