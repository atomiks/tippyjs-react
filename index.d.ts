import * as React from 'react'
import { default as tippyCore, Instance, Props } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Props, 'content'> {
  content: React.ReactChild | React.ReactChild[]
  children: React.ReactElement<any>
  visible?: boolean
  enabled?: boolean
  className?: string
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>
export default Tippy

export const tippy: typeof tippyCore

export interface TippySingletonProps {
  children: Array<React.ReactElement<any>>
  delay: number | [number, number]
}

export const TippySingleton: React.FunctionComponent<TippySingletonProps>
