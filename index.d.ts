import * as React from 'react';
import {default as tippyCore, Instance, Props, Plugin} from 'tippy.js';

export interface TippyProps extends Omit<Partial<Props>, 'content'> {
  content: React.ReactChild | React.ReactChild[];
  children: React.ReactElement<any>;
  visible?: boolean;
  disabled?: boolean;
  className?: string;
  singleton?: (instance: Instance) => void;
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>;
export default Tippy;

export const tippy: typeof tippyCore;

export interface UseSingletonProps extends Partial<Props> {
  disabled?: boolean;
  className?: string;
}

export const useSingleton: (
  props?: UseSingletonProps,
) => (instance: Instance) => void;
