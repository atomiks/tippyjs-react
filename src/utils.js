export const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export function preserveRef(ref, node) {
  if (ref) {
    if (typeof ref === 'function') {
      ref(node);
    }
    if ({}.hasOwnProperty.call(ref, 'current')) {
      ref.current = node;
    }
  }
}

export function ssrSafeCreateDiv() {
  return isBrowser && document.createElement('div');
}

export function updateClassName(tooltip, action, classNames) {
  classNames.split(/\s+/).forEach(name => {
    if (name) {
      tooltip.classList[action](name);
    }
  });
}

export function toDataAttributes(attrs) {
  const dataAttrs = {
    'data-placement': attrs.placement,
  };

  if (attrs.referenceHidden) {
    dataAttrs['data-reference-hidden'] = '';
  }

  if (attrs.escaped) {
    dataAttrs['data-escaped'] = '';
  }

  return dataAttrs;
}
