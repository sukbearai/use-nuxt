/* eslint-disable ts/prefer-literal-enum-member */
import type { Component, Slots, VNode, VNodeTypes } from 'vue'
import { isArray } from './is'

export enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
}

export function isElement(vn: VNode) {
  return Boolean(vn && vn.shapeFlag & ShapeFlags.ELEMENT)
}

export function isComponent(vn: VNode, type?: VNodeTypes): type is Component {
  return Boolean(vn && vn.shapeFlag & ShapeFlags.COMPONENT)
}

export function isArrayChildren(vn: VNode, children: VNode['children']): children is VNode[] {
  return Boolean(vn && vn.shapeFlag & ShapeFlags.ARRAY_CHILDREN)
}

export function isSlotsChildren(vn: VNode, children: VNode['children']): children is Slots {
  return Boolean(vn && vn.shapeFlag & ShapeFlags.SLOTS_CHILDREN)
}

export function getFirstComponent(children: VNode[] | undefined): VNode | undefined {
  if (!children)
    return undefined

  for (const child of children) {
    if (isElement(child) || isComponent(child))
      return child

    // If the current node is not a component, continue to find subcomponents
    if (isArrayChildren(child, child.children)) {
      const result = getFirstComponent(child.children)
      if (result)
        return result
    }
    else if (isSlotsChildren(child, child.children)) {
      const children = (child.children as any).default?.()
      if (children) {
        const result = getFirstComponent(children)
        if (result)
          return result
      }
    }
    else if (isArray(child)) {
      const result = getFirstComponent(child)
      if (result)
        return result
    }
  }

  return undefined
}
