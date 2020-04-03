import React, {cloneElement, useState} from 'react';
import PropTypes from 'prop-types';
import {createPortal} from 'react-dom';
import {
  preserveRef,
  ssrSafeCreateDiv,
  toDataAttributes,
  updateClassName,
  deepPreserveProps,
} from './utils';
import {useMutableBox, useIsomorphicLayoutEffect} from './util-hooks';

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
    const mutableBox = useMutableBox(() => ({
      container: ssrSafeCreateDiv(),
      renders: 1,
    }));

    const props = {
      ignoreAttributes,
      ...restOfNativeProps,
      content: mutableBox.container,
    };

    if (isControlledMode) {
      if (process.env.NODE_ENV !== 'production') {
        ['trigger', 'hideOnClick', 'showOnCreate'].forEach(nativeStateProp => {
          if (props[nativeStateProp] !== undefined) {
            console.warn(
              [
                `@tippyjs/react: Cannot specify \`${nativeStateProp}\` prop in`,
                `controlled mode (\`visible\` prop)`,
              ].join(' '),
            );
          }
        });
      }

      props.trigger = 'manual';
      props.hideOnClick = false;
    }

    if (isSingletonMode) {
      disabled = true;
    }

    let computedProps = props;
    const plugins = props.plugins || [];

    if (render) {
      computedProps = {
        ...props,
        plugins: isSingletonMode
          ? [
              ...plugins,
              {
                fn: () => ({
                  onTrigger(_, event) {
                    const {content} = singleton.data.children.find(
                      ({instance}) =>
                        instance.reference === event.currentTarget,
                    );
                    setSingletonContent(content);
                  },
                }),
              },
            ]
          : plugins,
        render: () => ({popper: mutableBox.container}),
      };
    }

    const deps = children ? [children.type] : [];

    // CREATE
    useIsomorphicLayoutEffect(() => {
      const instance = tippy(
        mutableBox.ref || ssrSafeCreateDiv(),
        computedProps,
      );

      mutableBox.instance = instance;

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
      if (mutableBox.renders === 1) {
        mutableBox.renders++;
        return;
      }

      const {instance} = mutableBox;

      instance.setProps(deepPreserveProps(instance.props, props));

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

      const {instance} = mutableBox;

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
    }, [attrs.placement, attrs.referenceHidden, attrs.escaped, ...deps]);

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

        const box = mutableBox.instance.popper.firstElementChild;

        updateClassName(box, 'add', className);

        return () => {
          updateClassName(box, 'remove', className);
        };
      }
    }, [className, ...deps]);

    return (
      <>
        {children
          ? cloneElement(children, {
              ref(node) {
                mutableBox.ref = node;
                preserveRef(children.ref, node);
              },
            })
          : null}
        {mounted &&
          createPortal(
            render
              ? render(toDataAttributes(attrs), singletonContent)
              : content,
            mutableBox.container,
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
      children: PropTypes.element,
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
