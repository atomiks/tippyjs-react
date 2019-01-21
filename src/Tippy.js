import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

// These props are not native to `tippy.js` and are specific to React only.
const REACT_ONLY_PROPS = [
  'children',
  'onCreate',
  'isVisible',
  'isEnabled',
  'lazyRender'
]

// Avoid Babel's large '_objectWithoutProperties' helper function.
function getNativeTippyProps(props) {
  return Object.keys(props).reduce((acc, key) => {
    if (REACT_ONLY_PROPS.indexOf(key) === -1) {
      acc[key] = props[key]
    }
    return acc
  }, {})
}

class Tippy extends React.Component {
  state = { isMounted: false, isShow: false }

  container = typeof document !== 'undefined' && document.createElement('div')

  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    children: PropTypes.element.isRequired,
    onCreate: PropTypes.func,
    onShow: PropTypes.func,
    onHidden: PropTypes.func,
    isVisible: PropTypes.bool,
    lazyRender: PropTypes.bool,
    isEnabled: PropTypes.bool
  }

  get isReactElementContent() {
    return React.isValidElement(this.props.content)
  }

  get options() {
    return {
      ...getNativeTippyProps(this.props),
      ...(this.props.lazyRender &&
        !this.isManualTrigger && {
          onShow: this.handleShow,
          onHidden: this.handleHidden
        }),
      content: this.isReactElementContent ? this.container : this.props.content
    }
  }

  get isManualTrigger() {
    return this.props.trigger === 'manual'
  }

  get isCanRender() {
    if (!this.props.lazyRender || this.isManualTrigger) {
      return true
    }

    return this.state.isShow
  }

  componentDidMount() {
    this.setState({ isMounted: true })

    this.tip = tippy.one(ReactDOM.findDOMNode(this), this.options)

    const { onCreate, isEnabled, isVisible } = this.props

    if (onCreate) {
      onCreate(this.tip)
    }

    if (isEnabled === false) {
      this.tip.disable()
    }

    if (this.isManualTrigger && isVisible === true) {
      this.tip.show()
    }
  }

  componentDidUpdate() {
    this.tip.set(this.options)

    const { isEnabled, isVisible } = this.props

    if (isEnabled === true) {
      this.tip.enable()
    }
    if (isEnabled === false) {
      this.tip.disable()
    }

    if (this.isManualTrigger) {
      if (isVisible === true) {
        this.tip.show()
      }
      if (isVisible === false) {
        this.tip.hide()
      }
    }
  }

  handleShow = e => {
    this.setState({
      isShow: true
    })
    if (this.props.onShow) {
      this.props.onShow(e)
    }
  }

  handleHidden = e => {
    this.setState({
      isShow: false
    })
    if (this.props.onHidden) {
      this.props.onHidden(e)
    }
  }

  componentWillUnmount() {
    this.tip.destroy()
    this.tip = null
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
        {this.isReactElementContent &&
          this.state.isMounted &&
          ReactDOM.createPortal(
            this.isCanRender ? this.props.content : null,
            this.container
          )}
      </React.Fragment>
    )
  }
}

export default Tippy
