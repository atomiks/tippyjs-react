import React from 'react'
import { Instance, Props } from 'tippy.js'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface TippyProps extends Omit<Props, 'content'> {
  content: React.ReactNode | string
  children: React.ReactNode
  onCreate?: (tip: Instance) => void
  isVisible?: boolean
  isEnabled?: boolean
}

export default class Tippy extends React.Component<TippyProps> {}
