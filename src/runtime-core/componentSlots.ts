import { ShapeFlags } from "../shared/ShapeFlags"

export function initSlots(instance: any, children: any) {
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance)
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value]
}

function normalizeObjectSlots(children: any, instance: any) {
  const slots = {}
  for (const key in children) {
    const value = children[key]
    slots[key] = (props) => normalizeSlotValue(value(props))
  }
  instance.slots = slots
}
