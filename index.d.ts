import * as React from 'react';
import {default as tippyCore, Instance, Props, Plugin} from 'tippy.js';

export interface TippyProps extends Omit<Partial<Props>, 'content'> {
  content: React.ReactChild | React.ReactChild[];
  children: React.ReactElement<any>;
  visible?: boolean;
  enabled?: boolean;
  className?: string;
  singleton?: (instance: Instance) => void;
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>;
export default Tippy;

export const tippy: typeof tippyCore;

export interface TippySingletonProps extends Partial<Props> {
  children: Array<React.ReactElement<any>>;
  enabled?: boolean;
  className?: string;
}

export const TippySingleton: React.FunctionComponent<TippySingletonProps>;

export type UseSingletonProps = Omit<TippySingletonProps, 'children'>;

export const useSingleton: (
  props?: UseSingletonProps,
) => (instance: Instance) => void;
