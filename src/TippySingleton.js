import {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {createSingleton} from 'tippy.js';
import {
  useIsomorphicLayoutEffect,
  useInstance,
  useUpdateClassName,
} from './hooks';

export default function TippySingleton({
  children,
  className,
  ignoreAttributes = true,
  ...restOfNativeProps
}) {
  const component = useInstance({
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
  }, [children.length]);

  useIsomorphicLayoutEffect(() => {
    if (component.renders === 1) {
      component.renders++;
      return;
    }

    component.instance.setProps(props);
  });

  useUpdateClassName(component, className);

  return Children.map(children, child => {
    return cloneElement(child, {
      enabled: false,
      onCreate(instance) {
        if (child.props.onCreate) {
          child.props.onCreate(instance);
        }

        component.instances.push(instance);
      },
    });
  });
}

if (process.env.NODE_ENV !== 'production') {
  TippySingleton.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  };
}
