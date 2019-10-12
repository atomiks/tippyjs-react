import * as React from 'react';
import {default as tippyCore, Instance, Props, Plugin} from 'tippy.js';

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {[_ in keyof T]: infer U}
  ? U
  : never;

export type KnownProps = Pick<Props, KnownKeys<Props>>;

export interface TippyProps extends Omit<Partial<KnownProps>, 'content'> {
  content: React.ReactChild | React.ReactChild[];
  children: React.ReactElement<any>;
  visible?: boolean;
  enabled?: boolean;
  className?: string;
  plugins?: Plugin[];
  singleton?: (instance: Instance) => void;
  [key: string]: any;
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>;
export default Tippy;

export const tippy: typeof tippyCore;

export interface TippySingletonProps extends Partial<KnownProps> {
  children: Array<React.ReactElement<any>>;
  enabled?: boolean;
  className?: string;
  plugins?: Plugin[];
  [key: string]: any;
}

export const TippySingleton: React.FunctionComponent<TippySingletonProps>;

type KnownSingletonProps = Pick<
  TippySingletonProps,
  KnownKeys<TippySingletonProps>
>;

export interface UseSingletonProps
  extends Omit<KnownSingletonProps, 'children'> {
  [key: string]: any;
}

export const useSingleton: (
  props?: UseSingletonProps,
) => (instance: Instance) => void;
