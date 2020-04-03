import {useMutableBox, useIsomorphicLayoutEffect} from './util-hooks';
import {deepPreserveProps} from './utils';
import {useMemo} from 'react';

export default function useSingletonGenerator(createSingleton) {
  return function useSingleton({disabled = false, overrides = []} = {}) {
    const mutableBox = useMutableBox({
      children: [],
      renders: 1,
    });

    const deps = [mutableBox.children.length];

    useIsomorphicLayoutEffect(() => {
      const {children, sourceData} = mutableBox;

      if (!sourceData) {
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
    }, [...overrides, ...deps]);

    useIsomorphicLayoutEffect(() => {
      if (mutableBox.renders === 1) {
        mutableBox.renders++;
        return;
      }

      const {instance, sourceData} = mutableBox;

      if (!sourceData) {
        return;
      }

      instance.setProps(deepPreserveProps(instance, sourceData.props));

      if (disabled) {
        instance.disable();
      } else {
        instance.enable();
      }
    });

    return useMemo(
      () => [
        {
          data: mutableBox,
          hook(data) {
            mutableBox.sourceData = data;
          },
        },
        {
          hook(data) {
            mutableBox.children.push(data);
          },
        },
      ],
      [],
    );
  };
}
