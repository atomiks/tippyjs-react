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

export function deepPreserveProps(instanceProps, componentProps) {
  return {
    ...componentProps,
    popperOptions: {
      ...instanceProps.popperOptions,
      ...componentProps.popperOptions,
      modifiers: [
        // Preserve tippy's internal + plugin modifiers
        ...(instanceProps.popperOptions?.modifiers || []).filter(
          modifier => modifier.name.indexOf('tippy') >= 0,
        ),
        ...(componentProps.popperOptions?.modifiers || []),
      ],
    },
  };
}
