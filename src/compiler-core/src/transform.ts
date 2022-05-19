import { NodeTypes } from "./ast"

export function transform (root, options = {}) {
  const context = createTransformContext(root, options)
  // 1 遍历
  traverseNode(root, context)

  createRootCodegen(root);
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

  traverseChildren(node, context)
  
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
    nodeTransforms: options.nodeTransforms || []
  }

  return context
}
