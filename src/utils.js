import { useRef } from 'react'

export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined'

export function preserveRef(ref, node) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(node)
    }
    if ({}.hasOwnProperty.call(ref, 'current')) {
      ref.current = node
    }
  }
}

export function ssrSafeCreateDiv() {
  return isBrowser && document.createElement('div')
}

export function updateClassName(tooltip, action, classNames) {
  classNames.split(/\s+/).forEach(name => {
    if (name) {
      tooltip.classList[action](name)
    }
  })
}

export function useInstance(initialValue = {}) {
  // Using refs instead of state as it's recommended to not store imperative
  // values in state due to memory problems in React(?)
  const ref = useRef()

  if (!ref.current) {
    ref.current =
      typeof initialValue === 'function' ? initialValue() : initialValue
  }

  return ref.current
}
