import React, {cloneElement, useState} from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import {
  preserveRef,
  ssrSafeCreateDiv,
  toDataAttributes,
  updateClassName,
} from './utils';
import {useInstance, useIsomorphicLayoutEffect} from './util-hooks';

export default function TippyGenerator(tippy) {
  function Tippy({
    children,
    content,
    className,
    visible,
    singleton,
    render,
    disabled = false,
    ignoreAttributes = true,
    // Filter React development reserved props
    // added by babel-preset-react dev plugins:
    // transform-react-jsx-self and transform-react-jsx-source
    __source,
    __self,
    ...restOfNativeProps
  }) {
    const isControlledMode = visible !== undefined;
    const isSingletonMode = singleton !== undefined;

    const [attrs, setAttrs] = useState({});
    const [mounted, setMounted] = useState(false);
    const [singletonContent, setSingletonContent] = useState();
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

    let computedProps = props;
    const plugins = props.plugins || [];

    if (render) {
      if (isSingletonMode) {
        plugins.push({
          fn: () => ({
            onTrigger(_, event) {
              const {content} = singleton.data.children.find(
                ({instance}) => instance.reference === event.currentTarget,
              );
              setSingletonContent(content);
            },
          }),
        });
      }

      computedProps = {
        ...props,
        plugins,
        render: () => ({popper: component.container}),
      };
    }

    const deps = [children.type];

    // CREATE
    useIsomorphicLayoutEffect(() => {
      const instance = tippy(component.ref, computedProps);

      component.instance = instance;

      if (disabled) {
        instance.disable();
      }

      if (visible) {
        instance.show();
      }

      if (isSingletonMode) {
        singleton.hook({
          instance,
          content,
          props: computedProps,
        });
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

      instance.setProps({
        ...props,
        popperOptions: {
          ...instance.props.popperOptions,
          ...props.popperOptions,
          modifiers: [
            // Preserve tippy's internal + plugin modifiers
            ...(instance.props.popperOptions?.modifiers || []).filter(
              modifier => modifier.name.indexOf('tippy') >= 0,
            ),
            ...(props.popperOptions?.modifiers || []),
          ],
        },
      });

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

      if (isSingletonMode) {
        singleton.hook({
          instance,
          content,
          props: computedProps,
        });
      }
    });

    useIsomorphicLayoutEffect(() => {
      if (!render) {
        return;
      }

      const {instance} = component;

      instance.setProps({
        popperOptions: {
          ...instance.props.popperOptions,
          modifiers: [
            ...(instance.props.popperOptions?.modifiers || []),
            {
              name: '$$tippyReact',
              enabled: true,
              phase: 'beforeWrite',
              requires: ['computeStyles'],
              fn({state}) {
                const hideData = state.modifiersData?.hide;

                // WARNING: this is a high-risk path that can cause an infinite
                // loop. This expression _must_ evaluate to false when required
                if (
                  attrs.placement !== state.placement ||
                  attrs.referenceHidden !== hideData?.isReferenceHidden ||
                  attrs.escaped !== hideData?.hasPopperEscaped
                ) {
                  setAttrs({
                    placement: state.placement,
                    referenceHidden: hideData?.isReferenceHidden,
                    escaped: hideData?.hasPopperEscaped,
                  });
                }

                state.attributes.popper = {};
              },
            },
          ],
        },
      });
    }, [attrs.placement, attrs.referenceHidden, attrs.escaped]);

    useIsomorphicLayoutEffect(() => {
      if (className) {
        if (render) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              [
                '@tippyjs/react: Cannot use `className` prop in conjunction',
                'with the `render` prop. Place the className on the element',
                'you are rendering.',
              ].join(' '),
            );
          }

          return;
        }

        const box = component.instance.popper.firstElementChild;

        updateClassName(box, 'add', className);

        return () => {
          updateClassName(box, 'remove', className);
        };
      }
    }, [className, ...deps]);

    return (
      <>
        {cloneElement(children, {
          ref(node) {
            component.ref = node;
            preserveRef(children.ref, node);
          },
        })}
        {mounted &&
          createPortal(
            render
              ? render(toDataAttributes(attrs), singletonContent)
              : content,
            component.container,
          )}
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
      children: PropTypes.element.isRequired,
      content: PropTypes.oneOfType([
        ContentType,
        PropTypes.arrayOf(ContentType),
      ]),
      render: PropTypes.func,
      visible: PropTypes.bool,
      disabled: PropTypes.bool,
      className: PropTypes.string,
      singleton: PropTypes.object,
    };
  }

  return Tippy;
}
