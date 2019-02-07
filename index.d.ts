import * as React from 'react'
import { Instance, Props } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Props, 'content'> {
  content: React.ReactElement<any> | string
  children: React.ReactElement<any>
  onCreate?: (tip: Instance) => void
  isVisible?: boolean
  isEnabled?: boolean
}

export const TippyGroup: React.FunctionComponent<TippyProps>

declare const Tippy: React.ForwardRefExoticComponent<TippyProps>
export default Tippy
