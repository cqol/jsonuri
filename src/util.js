function noop() {}

export function isInteger(num) {
  return Number.isInteger(num)
}
export function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

export function objectForeach(obj, callback) {
  Object.keys(obj).forEach((prop) => {
    callback(obj[prop], prop, obj)
  })
  return obj
}

export function arrayMove(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length
    while ((k--) + 1) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}

const arrPro = Array.prototype
export function normalizePath(...path) {
  //path = isArray(path) ? path : [path]
  path = arrPro.concat.apply(arrPro, path).join('/').split('/')
  path = ['/', combingPathKey(path).join('/')].join('')
  if (path !== '/') {
    path += '/'
  }
  return path
}

/**
 * [walk description] 遍历一个对象, 提供入栈和出栈两个回调, 操作原对象
 * @param  {object} obj          [description]
 * @param  {[type]} descentionFn [description]
 * @param  {[type]} ascentionFn  [description]
 * @return {[type]}              [description]
 */
export function walk(obj = {}, descentionFn = noop, ascentionFn = noop) {
  let path = []

  function _walk(obj) {
    objectForeach(obj, (val, key, raw) => {
      path.push(key)
      descentionFn(val, key, raw, {path: normalizePath(path)})
      path.pop()
      if (val instanceof Object) {
        path.push(key)
        _walk(val)
        path.pop()
        ascentionFn(val, key, raw, {path: normalizePath(path)})
      }
    })
    return obj
  }

  return _walk(obj)
}

export function indexOf(path) {
  return path.split('/').filter(item => item).slice(-1)[0] - 0
}

/**
 * Combing path keys
 * @param  {Array} keys  ['','menu','id','','.']
 * @return {Array}       ['menu','id']
 */
export function combingPathKey(keys) {
  // {empty}
  while (~keys.indexOf('')) {
    let _i = keys.indexOf('')
    keys.splice(_i, 1)
  }

  // .
  while (~keys.indexOf('.')) {
    let _i = keys.indexOf('.')
    keys.splice(_i, 1)
  }

  // ..
  while (~keys.indexOf('..')) {
    let _i = keys.indexOf('..')
    keys[_i] = keys[_i - 1] = null
    delete keys[_i]
    delete keys[_i - 1]
    keys.splice(_i, 1)
    keys.splice(_i - 1, 1)
  }

  return keys
}
