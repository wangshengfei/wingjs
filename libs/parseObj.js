/**
 * 如果对象某个属性的值是个数组，将这个值转换成字符串
 * @param {*} obj
 */
const cloneDeep = require('lodash/cloneDeep')

export default function (obj) {
  const object = cloneDeep(obj)
  const keys = Object.keys(object)
  keys.forEach(key => {
    if (Array.isArray(object[key])) {
      object[key] = object[key].join(',')
    }
  })
  return object
}