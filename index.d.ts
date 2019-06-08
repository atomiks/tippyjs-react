import * as React from 'react'
import { default as tippyCore, Instance, Options, GroupOptions } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Options, 'content'> {
  content: React.ReactChild | React.ReactChild[]
  children: React.ReactElement<any>
  onCreate?: (instance: Instance) => void
  /** @deprecated Use `visible` instead */
  isVisible?: boolean
  /** @deprecated Use `enabled` instead */
  isEnabled?: boolean
  visible?: boolean
  enabled?: boolean
  className?: string
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>
export default Tippy

export const tippy: typeof tippyCore;

export interface TippyGroupProps extends GroupOptions {
  children: Array<React.ReactElement<any>>
}

export const TippyGroup: React.FunctionComponent<TippyGroupProps>
