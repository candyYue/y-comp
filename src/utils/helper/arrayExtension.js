/* eslint-disable no-extend-native */
import { uniq } from 'lodash'
/**
 * 移除数组中的元素
 * @param {*} val 可以是某一元素, 可以是
 */
Array.prototype.remove = function (val) {
  if (typeOf(val) === 'array') {
    val.map(_ => this.remove(_))
  } else {
    var index = this.indexOf(val)
    if (index > -1) {
      this.splice(index, 1)
    }
  }
}

/**
 * 删除数组中对象
 * @param {*} 待删除的对象/数组
 * @param {*} 查找的待删除对象的key
 */
Array.prototype.removeObj = function (val, key) {
  if (typeOf(val) === 'array') {
    val.map(_ => this.removeObj(_, key))
  } else {
    var removeO = this.filter(_ => _[key] === val[key])
    if (!removeO.isEmpty()) {
      let index = this.indexOf(removeO[0])
      console.log(index)
      this.splice(index, 1)
    }
  }
}

// TODO: 数组是否为空
Array.prototype.isEmpty = function (val) {
  if (typeOf(this) !== 'array' || this.length === 0) {
    return true
  }
  return false
}

// TODO: 返回不相同的数组
Array.prototype.uniqNumberArray = function (val) {
  let sortArr = this.map(arr => {
    return arr.sort(function (a, b) { return +a - +b })
  }).map(_ => String(_.join(',')))
  let uniqArrString = uniq(sortArr).map(_ => _.split(',').map(v => +v))
  // console.log(sortArr, uniqArrString)
  return uniqArrString
}
/**
 * 删除已经剔除的聚类/...ID, 用于处理下拉框默认值不会出现ID
 * @param {*} defaultArray 默认值
 * @param {*} exceptIds 不需要排除的ID
 * @returns 剔除后的ID数组
 */
Array.prototype.removeDeleteId = function (defaultArray, exceptIds = []) {
  let newIds = []
  this.forEach(id => {
    let item = defaultArray.filter(_ => +_.id === +id)
    if (item.length > 0) {
      newIds.push(id)
    }
  })
  exceptIds.forEach(id => {
    if (this.indexOf(id) > -1) newIds.push(id)
  })
  return Array.from(newIds)
}
