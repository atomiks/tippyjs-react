import { Children, cloneElement, useEffect } from 'react'
import PropTypes from 'prop-types'
import { createSingleton } from 'tippy.js/addons'
import { useThis } from './utils'

export default function TippySingleton({ children, delay }) {
  const $this = useThis({ instances: [] })

  useEffect(() => {
    const singleton = createSingleton($this.instances, { delay })
    return () => {
      singleton.destroy(false)
    }
  }, [delay])

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
  TippySingleton.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
  }
}
