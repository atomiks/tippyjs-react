import {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {createSingleton} from 'tippy.js';
import {useIsomorphicLayoutEffect, useInstance} from './hooks';

export default function TippySingleton({children, ...props}) {
  const component = useInstance({
    instances: [],
    renders: 1,
  });

  useIsomorphicLayoutEffect(() => {
    const {instances} = component;
    const singleton = createSingleton(instances, props);

    component.singleton = singleton;

    return () => {
      singleton.destroy();

      component.instances = instances.filter(i => !i.state.isDestroyed);
    };
  }, [children.length]);

  useIsomorphicLayoutEffect(() => {
    if (component.renders === 1) {
      component.renders++;
      return;
    }

    component.singleton.setProps(props);
  });

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
