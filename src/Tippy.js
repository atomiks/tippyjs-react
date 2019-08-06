import React, {
  forwardRef,
  cloneElement,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import {
  isBrowser,
  ssrSafeCreateDiv,
  preserveRef,
  updateClassName,
} from './utils'

// React currently throws a warning when using useLayoutEffect on the server. To
// get around it, we can conditionally useEffect on the server (no-op) and
// useLayoutEffect in the browser. We need useLayoutEffect because we want Tippy
// to perform sync mutations to the DOM elements after renders to prevent
// jitters/jumps, especially when updating content.
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

function Tippy({
  children,
  content,
  className,
  onCreate,
  isVisible, // deprecated
  isEnabled, // deprecated
  visible,
  enabled,
  ignoreAttributes = true,
  multiple = true,
  ...restOfNativeProps
}) {
  // `isVisible` / `isEnabled` renamed to `visible` / `enabled`
  enabled =
    enabled !== undefined ? enabled : isEnabled !== undefined ? isEnabled : true
  visible = visible !== undefined ? visible : isVisible

  const isControlledMode = visible !== undefined

  const [mounted, setMounted] = useState(false)
  // useImperativeInstance
  const $this = useState({
    container: ssrSafeCreateDiv(),
    renders: 1,
  })[0]

  const options = {
    ignoreAttributes,
    multiple,
    ...restOfNativeProps,
    content: $this.container,
  }

  if (isControlledMode) {
    options.trigger = 'manual'
  }

  useIsomorphicLayoutEffect(() => {
    const instance = tippy($this.ref, options)

    $this.instance = instance

    if (onCreate) {
      onCreate(instance)
    }

    if (!enabled) {
      instance.disable()
    }

    if (visible) {
      instance.show()
    }

    setMounted(true)

    return () => {
      instance.destroy()
    }
  }, [children.type])

  useIsomorphicLayoutEffect(() => {
    // Prevent this effect from running on 1st + 2nd render (setMounted())
    if ($this.renders < 3) {
      $this.renders++
      return
    }

    const { instance } = $this

    instance.set(options)

    if (enabled) {
      instance.enable()
    } else {
      instance.disable()
    }

    if (isControlledMode) {
      if (visible) {
        instance.show()
      } else {
        instance.hide()
      }
    }
  }, [enabled, visible])

  useIsomorphicLayoutEffect(() => {
    if (className) {
      const { tooltip } = $this.instance.popperChildren
      updateClassName(tooltip, 'add', className)
      return () => {
        updateClassName(tooltip, 'remove', className)
      }
    }
  }, [className])

  return (
    <>
      {cloneElement(children, {
        ref(node) {
          $this.ref = node
          preserveRef(children.ref, node)
        },
      })}
      {mounted && createPortal(content, $this.container)}
    </>
  )
}

if (process.env.NODE_ENV !== 'production') {
  const ContentType = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element,
  ])

  Tippy.propTypes = {
    content: PropTypes.oneOfType([ContentType, PropTypes.arrayOf(ContentType)])
      .isRequired,
    children: PropTypes.element.isRequired,
    onCreate: PropTypes.func,
    isVisible: PropTypes.bool, // deprecated
    isEnabled: PropTypes.bool, // deprecated
    visible: PropTypes.bool,
    enabled: PropTypes.bool,
    className: PropTypes.string,
  }
}

export default forwardRef(function TippyWrapper({ children, ...props }, ref) {
  return (
    <Tippy {...props}>
      {cloneElement(children, {
        ref(node) {
          preserveRef(ref, node)
          preserveRef(children.ref, node)
        },
      })}
    </Tippy>
  )
})
