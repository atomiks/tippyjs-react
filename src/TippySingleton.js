import { Children, cloneElement, useEffect } from 'react'
import PropTypes from 'prop-types'
import { createSingleton } from 'tippy.js/addons'
import { useInstance } from './utils'

export default function TippySingleton({ children, delay, onCreate }) {
  const component = useInstance({ instances: [] })

  useEffect(() => {
    const { instances } = component
    const singleton = createSingleton([...instances], { delay })

    if (onCreate) {
      onCreate(singleton)
    }

    return () => {
      singleton.destroy(false)
      component.instances = instances.filter(i => !i.state.isDestroyed)
    }
  }, [delay, children.length])

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
  TippySingleton.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onCreate: PropTypes.func,
  }
}
