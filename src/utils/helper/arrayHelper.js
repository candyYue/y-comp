import { sortBy, intersection } from 'lodash'
/**
 * @description 比较两个纯文本数组是否一样
 * @param {*} val 新的数组
 * @param {*} oldval 旧数组
 */
const isdifferentArray = (val, oldval) => {
  let isdiff = false
  let array = [...oldval]
  if (val.length !== array.length) return true
  for (let index = 0; index < val.length; index++) {
    const item = val[index]
    if (array.indexOf(item) < 0) {
      isdiff = true
      break
    } else {
      array.remove(item)
    }
  }
  return isdiff
}
// const compare = function (prop) {
//   return function (obj1, obj2) {
//     let val1 = prop? obj1[prop] : obj1;
//     let val2 = prop? obj2[prop] : obj2;
//     if (val1 < val2) {
//         return -1;
//     } else if (val1 > val2) {
//         return 1;
//     } else {
//       return 0;
//     }
//   }
// }
const getArrEqual = (arr1, arr2, attr) => {
  const sortArr1 = sortBy(arr1, attr)
  const sortArr2 = sortBy(arr2, attr)
  if (JSON.stringify(sortArr1) === JSON.stringify(sortArr2)) {
    return true
  } else {
    return false
  }
}
const getArrInclude = (arr1, arr2, attr) => {
  const sortArr1 = sortBy(arr1, attr).map(_ => JSON.stringify(_))
  const sortArr2 = sortBy(arr2, attr).map(_ => JSON.stringify(_))
  const intersect = intersection(sortArr1, sortArr2)// 交集
  if (intersect && intersect.length) {
    return true
  } else {
    return false
  }
}

export {
  isdifferentArray,
  getArrEqual,
  getArrInclude
}
