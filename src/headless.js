import React, {cloneElement, forwardRef} from 'react';
import tippy from 'tippy.js/headless';
import {useSingleton} from './hooks';
import TippyGenerator from './Tippy';
import {preserveRef} from './utils';

const Tippy = TippyGenerator(tippy);

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
