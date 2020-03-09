import React, {cloneElement, forwardRef} from 'react';
import {preserveRef} from './utils';

export default Tippy =>
  forwardRef(function TippyWrapper({children = <div />, ...props}, ref) {
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
