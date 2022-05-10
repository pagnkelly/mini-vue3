import { createRenderer } from '../runtime-core'

function createElement (type) {
  return document.createElement(type)
}

function patchProps (el, key, prevVal, nextVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key) 
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert (el, parent) {
  parent.append(el)
}

const renderer = createRenderer({
  createElement,
  patchProps,
  insert
})

export const createApp = renderer.createApp

export * from '../runtime-core';