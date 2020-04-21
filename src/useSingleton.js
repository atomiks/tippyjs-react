import {useMutableBox, useIsomorphicLayoutEffect} from './util-hooks';
import {deepPreserveProps, updateClassName} from './utils';
import {useMemo} from 'react';

export default function useSingletonGenerator(createSingleton) {
  return function useSingleton({disabled = false, overrides = []} = {}) {
    const mutableBox = useMutableBox({
      children: [],
      renders: 1,
    });

    useIsomorphicLayoutEffect(() => {
      const {children, sourceData} = mutableBox;

      if (!sourceData) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            [
              '@tippyjs/react: The `source` variable from `useSingleton()` has',
              'not been passed to a <Tippy /> component.',
            ].join(' '),
          );
        }

        return;
      }

      const instance = createSingleton(
        children.map(child => child.instance),
        {
          ...sourceData.props,
          popperOptions: sourceData.instance.props.popperOptions,
          overrides,
        },
      );

      mutableBox.instance = instance;

      if (disabled) {
        instance.disable();
      }

      return () => {
        instance.destroy();
        mutableBox.children = children.filter(
          ({instance}) => !instance.state.isDestroyed,
        );
      };
    }, []);

    useIsomorphicLayoutEffect(() => {
      if (mutableBox.renders === 1) {
        mutableBox.renders++;
        return;
      }

      const {children, instance, sourceData} = mutableBox;

      if (!(instance && sourceData)) {
        return;
      }

      const {content, ...props} = sourceData.props;
      instance.setProps(
        deepPreserveProps(instance, {
          ...props,
          overrides,
        }),
      );

      instance.setInstances(children.map(child => child.instance));

      if (disabled) {
        instance.disable();
      } else {
        instance.enable();
      }
    });

    useIsomorphicLayoutEffect(() => {
      const className = mutableBox.sourceData?.className;

      if (className) {
        if (mutableBox.sourceData?.props.render) {
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
    });

    return useMemo(() => {
      const source = {
        data: mutableBox,
        hook(data) {
          mutableBox.sourceData = data;
        },
        cleanup() {
          mutableBox.sourceData = null;
        },
      };

      const target = {
        hook(data) {
          if (
            !mutableBox.children.find(
              ({instance}) => data.instance === instance,
            )
          ) {
            mutableBox.children.push(data);
          }
        },
        cleanup(instance) {
          mutableBox.children = mutableBox.children.filter(
            data => data.instance !== instance,
          );
        },
      };

      return [source, target];
    }, []);
  };
}
