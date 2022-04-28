import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

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

function createGetter (isreadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
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