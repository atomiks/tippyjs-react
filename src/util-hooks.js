import {isBrowser, updateClassName} from './utils';
import {useLayoutEffect, useEffect, useRef} from 'react';
import {createSingleton} from 'tippy.js';

export const useIsomorphicLayoutEffect = isBrowser
  ? useLayoutEffect
  : useEffect;

export function useUpdateClassName(component, className, deps) {
  useIsomorphicLayoutEffect(() => {
    const {tooltip} = component.instance.popperChildren;
    if (className) {
      updateClassName(tooltip, 'add', className);
      return () => {
        updateClassName(tooltip, 'remove', className);
      };
    }
  }, [className, ...deps]);
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

export function useSingletonCreate(component, props, plugins, enabled, deps) {
  useIsomorphicLayoutEffect(() => {
    const {instances} = component;
    const instance = createSingleton(instances, props, plugins);

    component.instance = instance;

    if (!enabled) {
      instance.disable();
    }

    return () => {
      instance.destroy();
      component.instances = instances.filter(i => !i.state.isDestroyed);
    };
  }, deps);
}

export function useSingletonUpdate(component, props, enabled) {
  useIsomorphicLayoutEffect(() => {
    if (component.renders === 1) {
      component.renders++;
      return;
    }

    const {instance} = component;

    instance.setProps(props);

    if (enabled) {
      instance.enable();
    } else {
      instance.disable();
    }
  });
}
