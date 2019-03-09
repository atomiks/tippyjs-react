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
  return typeof document !== 'undefined' && document.createElement('div')
}

export function updateClassName(tooltip, action, classNames) {
  classNames.split(/\s+/).forEach(name => {
    if (name) {
      tooltip.classList[action](name)
    }
  })
}
