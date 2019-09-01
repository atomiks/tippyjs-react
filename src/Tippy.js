import React, {
  forwardRef,
  cloneElement,
  useState,
  useLayoutEffect,
  useEffect,
} from 'react'
import PropTypes from 'prop-types'
import { createPortal } from 'react-dom'
import tippyBase from 'tippy.js'
import {
  isBrowser,
  preserveRef,
  ssrSafeCreateDiv,
  updateClassName,
  useInstance,
} from './utils'

let tippy = tippyBase
export function setTippy(customTippy) {
  tippy = customTippy
}

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
  onBeforeUpdate,
  onAfterUpdate,
  onCreate,
  visible,
  enabled = true,
  multiple = true,
  ignoreAttributes = true,
  ...restOfNativeProps
}) {
  const isControlledMode = visible !== undefined

  const [mounted, setMounted] = useState(false)
  const component = useInstance(() => ({
    container: ssrSafeCreateDiv(),
    renders: 1,
  }))

  const props = {
    ignoreAttributes,
    multiple,
    ...restOfNativeProps,
    content: component.container,
  }

  if (isControlledMode) {
    props.trigger = 'manual'
  }

  // CREATE
  useIsomorphicLayoutEffect(() => {
    const instance = tippy(component.ref, props)

    component.instance = instance

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

  // UPDATE
  useIsomorphicLayoutEffect(() => {
    // Prevent this effect from running on 1st render
    if (component.renders === 1) {
      component.renders++
      return
    }

    const { instance } = component

    if (onBeforeUpdate) {
      onBeforeUpdate(instance)
    }

    instance.setProps(props)

    if (onAfterUpdate) {
      onAfterUpdate(instance)
    }

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
  })

  // UPDATE className
  useIsomorphicLayoutEffect(() => {
    if (className) {
      const { tooltip } = component.instance.popperChildren
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
          component.ref = node
          preserveRef(children.ref, node)
        },
      })}
      {mounted && createPortal(content, component.container)}
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
    visible: PropTypes.bool,
    enabled: PropTypes.bool,
    className: PropTypes.string,
    onBeforeUpdate: PropTypes.func,
    onAfterUpdate: PropTypes.func,
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
