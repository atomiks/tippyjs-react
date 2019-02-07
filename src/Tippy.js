import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import {
  getNativeTippyProps,
  hasOwnProperty,
  ssrSafeCreateDiv,
  preserveRef,
} from './utils'

import TippyGroup from './TippyGroup'

function Tippy(props) {
  const [isMounted, setIsMounted] = React.useState(false)
  const container = React.useRef(ssrSafeCreateDiv())
  const reference = React.useRef()
  const instance = React.useRef()

  const options = {
    ...getNativeTippyProps(props),
    content: container.current,
  }

  if (hasOwnProperty(props, 'isVisible')) {
    options.trigger = 'manual'
  }

  React.useEffect(() => {
    instance.current = tippy(reference.current, options)

    const { onCreate, isEnabled, isVisible } = props

    if (onCreate) {
      onCreate(instance.current)
    }

    if (isEnabled === false) {
      instance.current.disable()
    }

    if (isVisible === true) {
      instance.current.show()
    }

    setIsMounted(true)

    return () => {
      instance.current.destroy()
      instance.current = null
    }
  }, [])

  React.useEffect(() => {
    if (!isMounted) {
      return
    }

    instance.current.set(options)

    const { isEnabled, isVisible } = props

    if (isEnabled === true) {
      instance.current.enable()
    }
    if (isEnabled === false) {
      instance.current.disable()
    }

    if (isVisible === true) {
      instance.current.show()
    }
    if (isVisible === false) {
      instance.current.hide()
    }
  })

  return (
    <>
      {React.Children.map(props.children, child =>
        React.cloneElement(child, {
          ref: node => {
            reference.current = node
            preserveRef(child, node)
          },
        }),
      )}
      {isMounted && ReactDOM.createPortal(props.content, container.current)}
    </>
  )
}

Tippy.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  children: PropTypes.element.isRequired,
  onCreate: PropTypes.func,
  isVisible: PropTypes.bool,
  isEnabled: PropTypes.bool,
}

export default Tippy
export { TippyGroup }
