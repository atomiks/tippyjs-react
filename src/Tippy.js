import React, {cloneElement, useState} from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import {preserveRef, ssrSafeCreateDiv} from './utils';
import {
  useInstance,
  useIsomorphicLayoutEffect,
  useUpdateClassName,
} from './util-hooks';

export default function TippyGenerator(tippy) {
  function Tippy({
    children,
    content,
    className,
    visible,
    singleton,
    disabled = false,
    ignoreAttributes = true,
    template,
    // Filter React development reserved props
    // added by babel-preset-react dev plugins:
    // transform-react-jsx-self and transform-react-jsx-source
    __source,
    __self,
    ...restOfNativeProps
  }) {
    const isControlledMode = visible !== undefined;
    const isSingletonMode = singleton !== undefined;

    const [mounted, setMounted] = useState(false);
    const component = useInstance(() => ({
      container: ssrSafeCreateDiv(),
      renders: 1,
    }));

    const props = {
      ignoreAttributes,
      ...restOfNativeProps,
      content: component.container,
    };

    if (isControlledMode) {
      props.trigger = 'manual';
    }

    if (isSingletonMode) {
      disabled = true;
    }

    const deps = [children.type];

    // CREATE
    useIsomorphicLayoutEffect(() => {
      const instance = tippy(
        component.ref,
        template
          ? {...props, render: () => ({popper: component.container})}
          : props,
      );

      component.instance = instance;

      if (disabled) {
        instance.disable();
      }

      if (visible) {
        instance.show();
      }

      if (isSingletonMode) {
        singleton(instance);
      }

      setMounted(true);

      return () => {
        instance.destroy();
      };
    }, deps);

    // UPDATE
    useIsomorphicLayoutEffect(() => {
      // Prevent this effect from running on 1st render
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

      if (isControlledMode) {
        if (visible) {
          instance.show();
        } else {
          instance.hide();
        }
      }
    });

    useUpdateClassName(component, className, deps);

    return (
      <>
        {cloneElement(children, {
          ref(node) {
            component.ref = node;
            preserveRef(children.ref, node);
          },
        })}
        {mounted && createPortal(template || content, component.container)}
      </>
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    const ContentType = PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.element,
    ]);

    Tippy.propTypes = {
      content: PropTypes.oneOfType([
        ContentType,
        PropTypes.arrayOf(ContentType),
      ]),
      children: PropTypes.element.isRequired,
      visible: PropTypes.bool,
      enabled: PropTypes.bool,
      className: PropTypes.string,
      singleton: PropTypes.func,
    };
  }

  return Tippy;
}
