const test = ()=>{
    console.log('test')
}

import {
  isdifferentArray,
  getArrEqual,
  getArrInclude
} from './src/utils/helper/arrayHelper'

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
} from './src/utils/helper/assist'

import {
  Base64
} from './src/utils/helper/base64'

import {
  dayEnd,
  dayStart,
  timeStamp,
  duration
} from './src/utils/helper/datehelper'

import {
  deepCompare
} from './src/utils/helper/deepCompare'

import {
  objDifference
} from './src/utils/helper/objDifference'

import {
  IEVersion
} from './src/utils/helper/ieVersion'

import {
  getCursorXY,
  contextmenuPos
} from './src/utils/helper/position'

import DButton from './src/components/button'
import DLoadingProgress from './src/components/loadingProgress'
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