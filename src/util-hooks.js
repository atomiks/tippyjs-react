import {isBrowser} from './utils';
import {useLayoutEffect, useEffect, useRef} from 'react';

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

export function useMutableBox(initialValue) {
  // Using refs instead of state as it's recommended to not store imperative
  // values in state due to memory problems in React(?)
  const ref = useRef();

  if (!ref.current) {
    ref.current =
      typeof initialValue === 'function' ? initialValue() : initialValue;
  }

  return ref.current;
}
