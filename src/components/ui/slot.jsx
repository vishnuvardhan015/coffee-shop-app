import { cloneElement, isValidElement } from 'react'

export function Slot({ children, ...props }) {
  if (!isValidElement(children)) return null

  return cloneElement(children, {
    ...props,
    className: [children.props.className, props.className]
      .filter(Boolean)
      .join(' '),
  })
}
