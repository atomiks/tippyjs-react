export function getNativeTippyProps(props) {
  const {
    children,
    onCreate,
    isVisible,
    isEnabled,
    className,
    ...nativeProps
  } = props
  return nativeProps
}

export function hasOwnProperty(obj, key) {
  return {}.hasOwnProperty.call(obj, key)
}

export function preserveRef(ref, node) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(node)
    }
    if (hasOwnProperty(ref, 'current')) {
      ref.current = node
    }
  }
}

export function ssrSafeCreateDiv() {
  return typeof document !== 'undefined' && document.createElement('div')
}

export function updateClassName(tooltip, action, classNames) {
  classNames.split(/\s+/).forEach(name => {
    tooltip.classList[action](name)
  })
}
