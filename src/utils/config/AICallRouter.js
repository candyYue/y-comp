/**
 * title: 页面title，面包屑title
 * name: 路由跳转name
 * path: 路由跳转路径
 * authority: 权限控制 只在权限控制的最低一层写入此项
 */
export default {
  statistics: {
    title: '数据统计',
    name: 'AICall-statistics',
    path: 'statistics',
    authority: ['module_statistics'],
    redirect: 'AICall-statistics-OutboundStatistic',
    children: {
      outboundStatistic: {
        title: '外呼统计',
        name: 'AICall-statistics-OutboundStatistic',
        path: 'outboundStatistic',
        authority: ['module_statistics']
      },
      scriptStatistic: {
        title: '外呼统计',
        name: 'AICall-statistics-ScriptStatistic',
        path: 'scriptStatistic',
        authority: ['module_statistics']
      }
    }
  },
  talk: {
    title: '话术管理',
    name: 'AICall-talk',
    path: 'talk',
    authority: ['module_talk'],
    children: {
      script: {
        title: '话术',
        name: 'AICall-talk-script',
        path: 'script',
        authority: ['script']
      },
      scriptDetail: {
        title: '话术详情',
        name: 'AICall-talk-script-views',
        path: 'script/:id',
        authority: ['script_add', 'script_edit'],
        redirect: 'AICall-talk-script-id',
        children: {
          scriptId: {
            title: '话术流程',
            newTitle: '话术流程',
            name: 'AICall-talk-script-id',
            path: 'info',
            authority: ['script_add', 'script_edit']
          },
          newIntention: {
            title: '意向性设置',
            name: 'AICall-talk-script-newIntention',
            path: 'intentionId',
            authority: ['script_add', 'script_edit']
          },
          questionManage: {
            title: '问题库管理',
            name: 'AICall-talk-script-views-QuestionManage',
            path: 'questionManage',
            authority: ['script_add', 'script_edit']
          },
          questionManageId: {
            title: '编辑问题',
            newTitle: '新建问题',
            name: 'AICall-talk-script-views-QuestionId',
            path: 'questionManage/:qid',
            authority: ['question_add', 'question_edit']
          },
          clusterManage: {
            title: '聚类管理',
            name: 'AICall-talk-script-views-ClusterManage',
            path: 'clusterManage',
            authority: ['script_add', 'script_edit']
          },
          trainManage: {
            title: '训练管理',
            name: 'AICall-talk-script-views-TrainManage',
            path: 'trainManage',
            authority: ['script_add', 'script_edit']
          },
          trainDetail: {
            title: '训练详情',
            name: 'AICall-talk-script-views-trainDetail',
            path: 'trainManage/:trainId',
            authority: ['script_add', 'script_edit'],
            redirect: 'AICall-talk-script-views-trainDetail-bindSource',
            children: {
              bindSource: {
                title: '聚类/问题',
                name: 'AICall-talk-script-views-trainDetail-bindSource',
                path: 'bindSource',
                authority: ['script_add', 'script_edit']
              },
              qualityCorpora: {
                title: '质检语料',
                name: 'AICall-talk-script-views-trainDetail-qualityCorpora',
                path: 'qualityCorpora',
                authority: ['script_add', 'script_edit']
              }
            }
          }
        }
      }
    }
  },
  clusters: {
    title: '聚类',
    name: 'AICall-talk-clusters',
    path: 'clusters',
    authority: ['cluster_view', 'clusters']
  },
  messages: {
    title: '短信',
    name: 'AICall-talk-messages',
    path: 'messages',
    authority: ['message_view']
  },
  fields: {
    title: '变量',
    name: 'AICall-talk-fields',
    path: 'fields',
    authority: ['field_view']
  },
  labels: {
    title: '标签',
    name: 'AICall-talk-labels',
    path: 'labels',
    authority: ['label_view']
  },
  question: {
    title: '问题库',
    name: 'AICall-question',
    path: 'question',
    authority: ['module_question']
  },
  questionId: {
    title: '编辑问题',
    newTitle: '新建问题',
    name: 'AICall-question-id',
    path: 'question/:id',
    authority: ['question_add', 'question_edit']
  },
  task: {
    title: '任务管理',
    name: 'AICall-task',
    path: 'task',
    authority: ['module_task']
  },
  taskId: {
    title: '任务详情',
    name: 'AICall-task-id',
    path: 'task/:id',
    authority: ['task_view'],
    children: {
      record: {
        title: '通话记录',
        name: 'AICall-task-id-record',
        path: 'record',
        authority: ['task_view']
      },
      clue: {
        title: '通话记录',
        name: 'AICall-task-id-clue',
        path: 'clue',
        authority: ['task_view']
      },
      failclue: {
        title: '导入失败线索',
        name: 'AICall-task-id-failclue',
        path: 'failclue',
        authority: ['task_view']
      }
    }
  },
  authority: {
    title: '权限管理',
    name: 'AICall-authority',
    path: 'authority',
    authority: ['module_authority'],
    redirect: 'AICall-authority-role',
    children: {
      role: {
        title: '角色管理',
        name: 'AICall-authority-role',
        path: 'role',
        authority: ['module_authority']
      },
      roleId: {
        title: '编辑角色',
        newTitle: '新建角色',
        name: 'AICall-authority-role-id',
        path: 'role/:id',
        authority: ['module_authority']
      },
      account: {
        title: '账号管理',
        name: 'AICall-authority-account',
        path: 'account',
        authority: ['module_authority']
      },
      testAbout: {
        title: '修改关联',
        name: 'AICall-authority-account-testAbout',
        path: 'testAbout',
        authority: ['module_authority']
      },
      department: {
        title: '部门管理',
        name: 'AICall-authority-department',
        path: 'department',
        authority: ['module_authority'],
        children: {
          departmentId: {
            title: '部门管理详情',
            name: 'AICall-authority-department-DepartmentMain',
            path: ':id',
            authority: ['module_authority']
          }
        }
      }
    }
  },
  callin: {
    title: '呼入记录',
    name: 'AICall-callin',
    path: 'callin',
    authority: ['module_callin']
  },
  api: {
    title: 'API管理',
    name: 'AICall-api',
    path: 'api',
    authority: ['module_api'],
    children: {
      api: {
        title: '部门管理详情',
        name: 'AICall-api-api',
        path: 'api',
        authority: ['api_edit']
      },
      wechat: {
        title: '企业微信设置',
        name: 'AICall-api-api-wechat',
        path: 'wechat',
        authority: ['work_wechat_config']
      },
      epsetting: {
        title: '企业微信设置',
        name: 'AICall-api-api-epsetting',
        path: 'epsetting',
        authority: ['work_wechat_config']
      },
      scriptRelation: {
        title: '话术映射',
        name: 'AICall-api-api-ScriptRelation',
        path: 'scriptRelation',
        authority: ['module_api']
      }
    }
  },

  log: {
    title: '操作日志',
    name: 'AICall-log',
    path: 'log',
    authority: ['module_log']
  },
  blacklist: {
    title: '黑名单',
    name: 'AICall-blacklist',
    path: 'blacklist',
    authority: ['module_blacklist']
  },
  form: {
    title: '工单管理',
    name: 'AICall-form',
    path: 'form',
    authority: ['module_form']
  },
  highrisk: {
    title: '智能质检',
    name: 'AICall-highrisk',
    path: 'highrisk',
    authority: ['module_highrisk'],
    redirect: 'AICall-highrisk-views-IntellectQuality',
    children: {
      IntellectQuality: {
        title: '智能质检',
        name: 'AICall-highrisk-views-IntellectQuality',
        path: 'intellect',
        authority: ['module_highrisk']
      },
      IntellectQualityDetail: {
        title: '设置规则',
        name: 'AICall-highrisk-views-IntellectQualityDetail',
        path: 'intellect/rule',
        authority: ['module_highrisk']
      },
      ManualQuality: {
        title: '人工质检',
        name: 'AICall-highrisk-views-ManualQuality',
        path: 'manual',
        authority: ['module_highrisk']
      },
      ManualQualityId: {
        title: '人工质检详情',
        name: 'AICall-highrisk-views-ManualQualityId',
        path: 'manual/:id',
        authority: ['module_highrisk']
      }
    }
  },
  robot: {
    title: '机器人管理',
    name: 'AICall-robot',
    path: 'robot',
    authority: ['module_robot']
  },
  knowledge: {
    title: '知识库',
    name: 'AICall-knowledge',
    path: 'knowledge',
    authority: ['module_knowledge']
  },
  knowledgeId: {
    title: '知识库详情',
    name: 'AICall-knowledge-id',
    path: 'knowledge/:id',
    authority: ['knowledge_view'],
    children: {
      cluster: {
        title: '查看',
        name: 'AICall-knowledge-id-cluster',
        path: 'cluster',
        authority: ['knowledge_view']
      },
      question: {
        title: '查看',
        name: 'AICall-knowledge-id-question',
        path: 'question',
        authority: ['knowledge_view']
      }
    }
  },
  policy: {
    title: '策略管理',
    name: 'AICall-policy',
    path: 'policy',
    authority: ['module_manual']
  },
  policyId: {
    title: '编辑策略',
    newTitle: '新建策略',
    name: 'AICall-policy-id',
    path: 'policy/:id',
    authority: ['module_manual']
  }
}
