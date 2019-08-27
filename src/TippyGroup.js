import { Children, cloneElement, useEffect } from 'react'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import { useInstance } from './utils'

export default function TippyGroup({ children, ...props }) {
  const component = useInstance({ instances: [] })

  useEffect(() => {
    component.instances = component.instances.filter(i => !i.state.isDestroyed)
    tippy.group(component.instances, props)
  })

  return Children.map(children, child => {
    return cloneElement(child, {
      onCreate(instance) {
        if (child.props.onCreate) {
          child.props.onCreate(instance)
        }

        component.instances.push(instance)
      },
    })
  })
}

if (process.env.NODE_ENV !== 'production') {
  TippyGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  }
}
