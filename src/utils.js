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

function deepEqual(x, y) {
  if (x === y) {
    return true;
  } else if (
    typeof x === 'object' &&
    x != null &&
    typeof y === 'object' &&
    y != null
  ) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false;
    }

    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}

export function uniqueByShape(arr) {
  const output = [];

  arr.forEach(item => {
    if (!output.find(outputItem => deepEqual(item, outputItem))) {
      output.push(item);
    }
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
