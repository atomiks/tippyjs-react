import * as React from 'react'
import { Instance, Props, GroupOptions } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Props, 'content'> {
  content: React.ReactElement<any> | string
  children: React.ReactElement<any>
  onCreate?: (instance: Instance) => void
  isVisible?: boolean
  isEnabled?: boolean
  className?: string
}

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>
export default Tippy

export interface TippyGroupProps extends GroupOptions {
  children: Array<React.ReactElement<any>>
}

export const TippyGroup: React.FunctionComponent<TippyGroupProps>
