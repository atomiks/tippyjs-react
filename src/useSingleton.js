import {
  useInstance,
  useUpdateClassName,
  useIsomorphicLayoutEffect,
} from './util-hooks';

export default function useSingletonGenerator(createSingleton) {
  return function useSingleton({
    className,
    disabled = false,
    ignoreAttributes = true,
    render,
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

    useIsomorphicLayoutEffect(() => {
      const {instances} = component;
      const instance = createSingleton(instances, props);

      component.instance = instance;

      if (disabled) {
        instance.disable();
      }

      return () => {
        instance.destroy();
        component.instances = instances.filter(i => !i.state.isDestroyed);
      };
    }, deps);

    useIsomorphicLayoutEffect(() => {
      if (component.renders === 1) {
        component.renders++;
        return;
      }

      const {instance} = component;

      instance.setProps(props);

      if (disabled) {
        instance.disable();
      } else {
        instance.enable();
      }
    });

    useUpdateClassName(component, className, deps);

    return instance => {
      component.instances.push(instance);
    };
  };
}
