import { CREATE_ELEMENT_VNDOE } from "./runtimeHelper"

export const enum NodeTypes {
  INTERPOLATION,
  SIMPLE_EXPRESSION,
  ELEMENT,
  TEXT,
  ROOT,
  COMPOUND_EXPRESSION
}

export function createVNodeCall (context, tag, props, children) {
  context.helper(CREATE_ELEMENT_VNDOE)

  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children
  }
}