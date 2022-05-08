import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, rootContainer) {
  patch(vnode, rootContainer, null)
}

function patch(vnode, contariner, parentComponent) {
  // TODO 
  const { type, shapeFlag } = vnode

  switch (type) {
    case Fragment:
      processFragment(vnode, contariner, parentComponent)
      break;
    case Text:
      processText(vnode, contariner)
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, contariner, parentComponent)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, contariner, parentComponent);
      }
      break;
  }

}

function processElement(vnode, contariner, parentComponent) {
  mountElement(vnode, contariner, parentComponent)
}

function mountElement(vnode: any, contariner: any, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type))

  const { children, props, shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent)
  }

  for (const key in props) {
    const val = props[key]

    const isOn = (key: string) => /^on[A-Z]/.test(key) 
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  contariner.append(el)
}

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach(v => {
    patch(v, container, parentComponent)
  })
}

function processComponent(vnode, container, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(initialVNode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent)

  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  patch(subTree, container, instance)

  initialVNode.el = subTree.el
}


function processFragment(vnode: any, contariner: any, parentComponent) {
  mountChildren(vnode, contariner, parentComponent)
}

function processText(vnode: any, contariner: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  contariner.append(textNode)
}

