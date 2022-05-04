import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, rootContainer) {
  patch(vnode, rootContainer)
}

function patch(vnode, contariner) {
  // TODO 
  if (typeof vnode.type === 'string') {
    processElement(vnode, contariner)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, contariner);
  }
}

function processElement(vnode, contariner) {
  mountElement(vnode, contariner)
}

function mountElement(vnode: any, contariner: any) {
  const el = document.createElement(vnode.type)

  const { children, props } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }

  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  contariner.append(el)
}

function mountChildren(children, container) {
  children.forEach(v => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
  setupRenderEffect(instance, container)
}
function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  patch(subTree, container)
}


