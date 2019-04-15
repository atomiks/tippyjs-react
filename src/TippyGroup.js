import { Children, cloneElement, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

export default function TippyGroup({ children, ...props }) {
  const instancesRef = useRef([])

  useEffect(() => {
    tippy.group(instancesRef.current, props)
  })

  return Children.map(children, child => {
    return cloneElement(child, {
      onCreate: instance => {
        if (child.props.onCreate) {
          child.props.onCreate(instance)
        }
        instancesRef.current.push(instance)
      },
    })
  })
}

TippyGroup.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
}
