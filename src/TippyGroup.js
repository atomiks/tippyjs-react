import { Children, cloneElement, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

export default function TippyGroup({ children, ...props }) {
  // useImperativeInstance
  const $this = useState({ instances: [] })[0]

  useEffect(() => {
    tippy.group($this.instances, props)
  })

  return Children.map(children, child => {
    return cloneElement(child, {
      onCreate(instance) {
        if (child.props.onCreate) {
          child.props.onCreate(instance)
        }

        $this.instances.push(instance)
      },
    })
  })
}

if (process.env.NODE_ENV !== 'production') {
  TippyGroup.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  }
}
