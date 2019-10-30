import {
  useInstance,
  useSingletonCreate,
  useSingletonUpdate,
  useUpdateClassName,
} from './util-hooks';

export function useSingleton({
  className,
  enabled = true,
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

  const deps = [component.instances.length];

  useSingletonCreate(component, props, enabled, deps);
  useSingletonUpdate(component, props, enabled);
  useUpdateClassName(component, className, deps);

  return instance => {
    component.instances.push(instance);
  };
}
