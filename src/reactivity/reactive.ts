import { readonlyHandlers, mutableHandlers } from './basehandlers'

const createActiveObject = function(raw, handler) {
  return new Proxy(raw, handler)
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}
