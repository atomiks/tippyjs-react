import * as React from 'react'
import { default as tippyCore, Instance, Props, Plugin } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Props, 'content'> {
  content: React.ReactChild | React.ReactChild[]
  children: React.ReactElement<any>
  visible?: boolean
  enabled?: boolean
  className?: string
  plugins?: Plugin[]
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>
export default Tippy

export const tippy: typeof tippyCore

export interface TippySingletonProps extends Props {
  children: Array<React.ReactElement<any>>
}

export const TippySingleton: React.FunctionComponent<TippySingletonProps>
