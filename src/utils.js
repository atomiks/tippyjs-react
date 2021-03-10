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

export function uniqueByShape(arr) {
  const output = [];
  const lookup = Object.create(null);

  arr.forEach(item => {
    if (lookup[JSON.stringify(item)] === undefined) {
      output.push(item);
    }
    lookup[JSON.stringify(item)] = true;
  });

  return output;
}

export function deepPreserveProps(instanceProps, componentProps) {
  return {
    ...componentProps,
    popperOptions: {
      ...instanceProps.popperOptions,
      ...componentProps.popperOptions,
      modifiers: uniqueByShape([
        ...(instanceProps.popperOptions?.modifiers || []),
        ...(componentProps.popperOptions?.modifiers || []),
      ]),
    },
  };
}
