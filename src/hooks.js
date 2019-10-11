import {isBrowser, updateClassName} from './utils';
import {useLayoutEffect, useEffect, useRef} from 'react';
import {createSingleton} from 'tippy.js';

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

export function useUpdateClassName(component, className, childrenDep) {
  useIsomorphicLayoutEffect(() => {
    const {tooltip} = component.instance.popperChildren;
    if (className) {
      updateClassName(tooltip, 'add', className);
      return () => {
        updateClassName(tooltip, 'remove', className);
      };
    }
  }, [className, childrenDep]);
}

export function useInstance(initialValue) {
  // Using refs instead of state as it's recommended to not store imperative
  // values in state due to memory problems in React(?)
  const ref = useRef();

  if (!ref.current) {
    ref.current =
      typeof initialValue === 'function' ? initialValue() : initialValue;
  }

  return ref.current;
}

export function useSingleton({
  className,
  ignoreAttributes = true,
  ...restOfNativeProps
} = {}) {
  const component = useInstance({
    instance: null,
    instances: [],
    renders: 1,
  });

  const props = {
    ignoreAttributes,
    ...restOfNativeProps,
  };

  useIsomorphicLayoutEffect(() => {
    const {instances} = component;
    const instance = createSingleton(instances, props);

    component.instance = instance;

    return () => {
      instance.destroy();
      component.instances = instances.filter(i => !i.state.isDestroyed);
    };
  }, [component.instances.length]);

  useIsomorphicLayoutEffect(() => {
    if (component.renders === 1) {
      component.renders++;
      return;
    }

    component.instance.setProps(props);
  });

  useUpdateClassName(component, className, component.instances.length);

  return instance => {
    component.instances.push(instance);
  };
}
