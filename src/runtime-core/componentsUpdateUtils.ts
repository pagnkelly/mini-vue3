export function shouldUpdateComponent (prevVNode, nextVnode) {
  const { props: prevProps } = prevVNode
  const { props: nextProps } = nextVnode

  for (let key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true
    }
  }
  return false
}