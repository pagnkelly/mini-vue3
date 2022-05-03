import { createComponentInstance, setupComponent } from "./components";

export function render(vnode, rootContainer) {
  patch(vnode, rootContainer)
}

function patch(vnode, rootContainer) {
  processComponent(vnode, rootContainer);
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

