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

export function uniqueByName(arr) {
  const output = [];
  const lookup = Object.create(null);

  for (const item in arr) {
    if (lookup[arr[item].name] === undefined) {
      output.push(arr[item]);
    }
    lookup[arr[item].name] = arr[item];
  }

  return output;
}

export function deepPreserveProps(instanceProps, componentProps) {
  return {
    ...componentProps,
    popperOptions: {
      ...instanceProps.popperOptions,
      ...componentProps.popperOptions,
      modifiers: uniqueByName([
        ...(instanceProps.popperOptions?.modifiers || []),
        ...(componentProps.popperOptions?.modifiers || []),
      ]),
    },
  };
}
