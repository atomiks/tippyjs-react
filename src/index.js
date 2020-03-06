import React, {cloneElement, forwardRef} from 'react';
import tippy, {createSingleton} from 'tippy.js/headless';
import useSingletonGenerator from './useSingleton';
import TippyGenerator from './Tippy';
import {preserveRef} from './utils';

const Tippy = TippyGenerator(tippy);
const useSingleton = useSingletonGenerator(createSingleton);

export default forwardRef(function TippyWrapper({children, ...props}, ref) {
  return (
    <Tippy {...props}>
      {cloneElement(children, {
        ref(node) {
          preserveRef(ref, node);
          preserveRef(children.ref, node);
        },
      })}
    </Tippy>
  );
});

export {useSingleton, tippy};
