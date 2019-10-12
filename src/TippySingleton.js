import {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import {
  useInstance,
  useUpdateClassName,
  useSingletonUpdate,
  useSingletonCreate,
} from './util-hooks';

export default function TippySingleton({
  children,
  className,
  plugins,
  enabled = true,
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

  const deps = [children.length];

  useSingletonCreate(component, props, plugins, enabled, deps);
  useSingletonUpdate(component, props, enabled);
  useUpdateClassName(component, className, deps);

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
