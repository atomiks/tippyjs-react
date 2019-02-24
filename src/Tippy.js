import React, {
  forwardRef,
  cloneElement,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import {
  getNativeTippyProps,
  hasOwnProperty,
  ssrSafeCreateDiv,
  preserveRef,
  updateClassName,
} from './utils'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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

  useIsomorphicLayoutEffect(() => {
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

  useIsomorphicLayoutEffect(() => {
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

  useIsomorphicLayoutEffect(() => {
    if (props.className) {
      const { tooltip } = instanceRef.current.popperChildren
      updateClassName(tooltip, 'add', props.className)
      return () => {
        updateClassName(tooltip, 'remove', props.className)
      }
    }
  }, [props.className])

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
  className: PropTypes.string,
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
