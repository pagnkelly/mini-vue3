import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING } from "./runtimeHelper";

export function transform (root, options = {}) {
  const context = createTransformContext(root, options)
  // 1 遍历
  traverseNode(root, context)

  createRootCodegen(root);

  root.helpers = [...context.helpers.keys()]
}
function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}
function traverseNode(node: any, context) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node, context)
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break;
    default:
      break;
  }


  
}

function traverseChildren (node: any, context) {
  const children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      traverseNode(node, context)
    }
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    node: root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  }

  return context
}
