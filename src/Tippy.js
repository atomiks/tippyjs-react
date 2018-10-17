import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

const isBrowser = typeof window !== 'undefined'

const getNativeTippyProps = props => {
  const { children, onCreate, ...tippyProps } = props
  return tippyProps
}

class Tippy extends React.Component {
  state = { isMounted: false }

  container = isBrowser && document.createElement('div')

  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    children: PropTypes.element.isRequired,
    onCreate: PropTypes.func
  }

  get isReactElementContent() {
    return React.isValidElement(this.props.content)
  }

  get content() {
    return this.isReactElementContent ? this.container : this.props.content
  }

  get options() {
    return {
      ...getNativeTippyProps(this.props),
      content: this.content
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true })
    this.tip = tippy.one(ReactDOM.findDOMNode(this), this.options)
    this.props.onCreate && this.props.onCreate(this.tip)
  }

  componentDidUpdate() {
    this.tip.set(this.options)
  }

  componentWillUnmount() {
    if (this.tip) {
      this.tip.destroy()
      this.tip = null
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
        {isBrowser &&
          this.isReactElementContent &&
          this.state.isMounted &&
          ReactDOM.createPortal(this.props.content, this.container)}
      </React.Fragment>
    )
  }
}

export default Tippy
