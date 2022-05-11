import { effect } from "../reactivity/effect";
import { EMPTY_OBJ, isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";


export function createRenderer (options) {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, rootContainer) {
    patch(null, vnode, rootContainer, null, null)
  }

  function patch(n1, n2, contariner, parentComponent, anchor) {
    // TODO 
    const { type, shapeFlag } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, contariner, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, contariner)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, contariner, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, contariner, parentComponent, anchor);
        }
        break;
    }

  }

  function processElement(n1, n2, contariner, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, contariner, parentComponent, anchor)
    } else {
      patchElement(n1, n2, contariner, parentComponent, anchor)
    }
  }

  function patchElement (n1, n2, contariner, parentComponent, anchor) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
    // props
    // children

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    const el = (n2.el = n1.el)
    patchChildren(n1, n2, el, parentComponent, anchor)
    patchProps(el, oldProps, newProps)
  }
  
  function patchChildren(n1, n2, container, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag
    const c1 = n1.children
    const { shapeFlag, children:c2 } = n2
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)

      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent, anchor)
      } else {
        patchKeyedChildren(c1, c2, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1
    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSomeVNodeType(n1, n2, container, parentComponent)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break;
      }
      i++;
    }
    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSomeVNodeType(n1, n2, container, parentComponent)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break;
      }
      e1--
      e2--
    }

    // 新的比老得多

    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) { // 新的比老的少
      while(i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    } else {
      let s1 = i
      let s2 = i
      
      const toBePatched = e2 - s2 + 1
      let patched = 0
      const keyToNewIndexMap = new Map()
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j < e2; j++) {
            if (isSomeVNodeType(prevChild, c2[j], container, parentComponent)) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }
    }
  }

  function isSomeVNodeType (n1, n2, container, parentComponent) {
    return n1.type === n2.type && n1.key === n2.key
  }

  function unmountChildren (children) {
    for(let i = 0; i < children.length; i++) {
      const el = children[i].el
      // remove
      hostRemove(el)
    }
  }

  function patchProps (el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
  
        if (prevProp !== nextProp) {
          hostPatchProps(el, key, prevProp, nextProp)
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProps(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function mountElement(vnode: any, contariner: any, parentComponent, anchor) {
    const el = (vnode.el = hostCreateElement(vnode.type))

    const { children, props, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, parentComponent, anchor)
    }

    for (const key in props) {
      const val = props[key]

      // const isOn = (key: string) => /^on[A-Z]/.test(key) 
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
      hostPatchProps(el, key, null, val)
    }

    // contariner.append(el)
    hostInsert(el, contariner, anchor)
  }

  function mountChildren(children, container, parentComponent, anchor) {
    children.forEach(v => {
      patch(null, v, container, parentComponent, anchor)
    })
  }

  function processComponent(n1, n2, container, parentComponent, anchor) {
    mountComponent(n2, container, parentComponent, anchor);
  }

  function mountComponent(initialVNode: any, container, parentComponent, anchor) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }
  function setupRenderEffect(instance, initialVNode, container, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance
        const subTree = (instance.subTree = instance.render.call(proxy))
        patch(null, subTree, container, instance, anchor)
    
        initialVNode.el = subTree.el
        instance.isMounted = true
      } else {
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree

        patch(prevSubTree, subTree, container, instance, anchor)
      }
    })
  }


  function processFragment(n1, n2: any, contariner: any, parentComponent, anchor) {
    mountChildren(n2.children, contariner, parentComponent, anchor)
  }

  function processText(n1, n2: any, contariner: any) {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children))
    contariner.append(textNode)
  }

  return {
    createApp: createAppAPI(render)
  }
}


