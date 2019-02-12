import React, {
  forwardRef,
  cloneElement,
  useState,
  useRef,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import {
  getNativeTippyProps,
  hasOwnProperty,
  ssrSafeCreateDiv,
  preserveRef,
} from './utils'

function Tippy(props) {
  const [isMounted, setIsMounted] = useState(false)
  const container = useRef(ssrSafeCreateDiv())
  const reference = useRef()
  const instance = useRef()

  const options = {
    ...getNativeTippyProps(props),
    content: container.current,
  }

  if (hasOwnProperty(props, 'isVisible')) {
    options.trigger = 'manual'
  }

  useEffect(() => {
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

  useEffect(() => {
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
      {cloneElement(props.children, {
        ref: node => {
          reference.current = node
          preserveRef(props.children.ref, node)
        },
      })}
      {isMounted && createPortal(props.content, container.current)}
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

Tippy.defaultProps = {
  ignoreAttributes: true,
}

export default forwardRef(function TippyWrapper(props, ref) {
  return (
    <Tippy {...props}>
      {cloneElement(props.children, {
        ref: node => {
          preserveRef(ref, node)
          preserveRef(props.children.ref, node)
        },
      })}
    </Tippy>
  )
})
