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
  const containerRef = useRef(ssrSafeCreateDiv())
  const targetRef = useRef()
  const instanceRef = useRef()

  const options = {
    ...getNativeTippyProps(props),
    content: containerRef.current,
  }

  if (hasOwnProperty(props, 'isVisible')) {
    options.trigger = 'manual'
  }

  useEffect(() => {
    if (!targetRef.current) {
      throw new Error(
        `[tippy]: Passed an invalid DOM node ref (\`${targetRef.current}\`)`,
      )
    }

    instanceRef.current = tippy(targetRef.current, options)

    const { onCreate, isEnabled, isVisible } = props

    if (onCreate) {
      onCreate(instanceRef.current)
    }

    if (isEnabled === false) {
      instanceRef.current.disable()
    }

    if (isVisible === true) {
      instanceRef.current.show()
    }

    setIsMounted(true)

    return () => {
      instanceRef.current.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    instanceRef.current.set(options)

    const { isEnabled, isVisible } = props

    if (isEnabled === true) {
      instanceRef.current.enable()
    }
    if (isEnabled === false) {
      instanceRef.current.disable()
    }

    if (isVisible === true) {
      instanceRef.current.show()
    }
    if (isVisible === false) {
      instanceRef.current.hide()
    }
  })

  return (
    <>
      {cloneElement(props.children, {
        ref: node => {
          targetRef.current = node
          preserveRef(props.children.ref, node)
        },
      })}
      {isMounted && createPortal(props.content, containerRef.current)}
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
