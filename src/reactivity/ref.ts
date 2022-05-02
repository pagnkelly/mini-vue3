import { isObject, hasChange } from "../shared"
import { trackEffect, isTracking, triggerEffect } from "./effect"
import { reactive } from "./reactive"

class refImpl {
  private _rawValue: any
  private _value: any
  private _dep = new Set()
  private __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
  }
  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChange(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffect(this._dep)
    }
    
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref._dep)
  }
}

export function ref (value) {
  return new refImpl(value)
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(ref) {
  return new Proxy(ref, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      }
      return Reflect.set(target, key, value)
    }
  })
}