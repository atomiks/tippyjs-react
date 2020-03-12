import React, {cloneElement, forwardRef} from 'react';
import {preserveRef} from './utils';

export default (Tippy, defaultProps) =>
  forwardRef(function TippyWrapper({children, ...props}, ref) {
    return (
      // If I spread them separately here, Babel adds the _extends ponyfill for
      // some reason
      <Tippy {...{...defaultProps, ...props}}>
        {children
          ? cloneElement(children, {
              ref(node) {
                preserveRef(ref, node);
                preserveRef(children.ref, node);
              },
            })
          : null}
      </Tippy>
    );
  });
