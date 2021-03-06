import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from './reactive'
import { isObject, extend } from '../shared'
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} 不能被set，因为target是readonly`, target)
    return true
  }
}

export const mutableHandlers = {
  get,
  set
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})

function createGetter (isreadonly = false, isShallow = false) {
  return function(target, key) {
    if (ReactiveFlags.IS_REACTIVE === key) {
      return !isreadonly
    } else if (ReactiveFlags.IS_READONLY === key) {
      return isreadonly
    }
    
    const res = Reflect.get(target, key)

    if (isShallow) {
      return res
    }
    if (isObject(res)) {
      return isreadonly ? readonly(res) : reactive(res)
    }
    
    if (!isreadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter () {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value)
    trigger(target, key, value)
    return res
  }
}