import { Children, cloneElement, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

export default function TippyGroup({ children, ...props }) {
  const instances = useRef([])

  useEffect(() => {
    tippy.group(instances.current, props)
    return () => {
      instances.current = null
    }
  }, [])

  return Children.map(children, child => {
    return cloneElement(child, {
      onCreate: instance => {
        if (child.props.onCreate) {
          child.props.onCreate(instance)
        }
        instances.current.push(instance)
      },
    })
  })
}

TippyGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
}
