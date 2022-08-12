const test = ()=>{
    console.log('test')
}

import {
  isdifferentArray,
  getArrEqual,
  getArrInclude
} from '@/utils/helper/arrayHelper'

import {
  oneOf,
  typeOf,
  deepCopy,
  filterOpts,
  uniqueId,
  stringToId,
  handleXml,
  handleXmlString,
  handleXmlDoc,
  notEmptyObject
} from '@/utils/helper/assist'

import {
  Base64
} from '@/utils/helper/base64'

import {
  dayEnd,
  dayStart,
  timeStamp,
  duration
} from '@/utils/helper/datehelper'

import {
  deepCompare
} from '@/utils/helper/deepCompare'

import {
  objDifference
} from '@/utils/helper/objDifference'

import {
  IEVersion
} from '@/utils/helper/ieVersion'

import {
  getCursorXY,
  contextmenuPos
} from '@/utils/helper/position'

import DButton from '@/components/button'
import DLoadingProgress from '@/components/loadingProgress'
export {
  //方法
  test,
  isdifferentArray,
  getArrEqual,
  getArrInclude,
  oneOf,
  typeOf,
  deepCopy,
  filterOpts,
  uniqueId,
  stringToId,
  handleXml,
  handleXmlString,
  handleXmlDoc,
  notEmptyObject,
  Base64,
  dayEnd,
  dayStart,
  timeStamp,
  duration,
  deepCompare,
  objDifference,
  IEVersion,
  getCursorXY,
  contextmenuPos,
  //组件

  DButton,
  DLoadingProgress
} 