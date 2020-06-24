import {useMutableBox, useIsomorphicLayoutEffect} from './util-hooks';
import {deepPreserveProps} from './utils';
import {classNamePlugin} from './className-plugin';
import {useMemo, useState} from 'react';

export default function useSingletonGenerator(createSingleton) {
  return function useSingleton({disabled = false, overrides = []} = {}) {
    const [mounted, setMounted] = useState(false);
    const mutableBox = useMutableBox({
      children: [],
      renders: 1,
    });

    useIsomorphicLayoutEffect(() => {
      if (!mounted) {
        setMounted(true);
        return;
      }

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
          plugins: [classNamePlugin, ...(sourceData.props.plugins || [])],
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
    }, [mounted]);

    useIsomorphicLayoutEffect(() => {
      if (!mounted) {
        return;
      }

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
