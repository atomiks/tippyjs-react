import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'

const getNativeTippyProps = props => {
  const { children, onCreate, ...tippyProps } = props
  return tippyProps
}

class Tippy extends React.Component {
  content = React.createRef()

  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    children: PropTypes.element.isRequired
  }

  getContent() {
    return React.isValidElement(this.props.content)
      ? this.content.current
      : this.props.content
  }

  componentDidMount() {
    this.tip = tippy.one(ReactDOM.findDOMNode(this), {
      ...getNativeTippyProps(this.props),
      content: this.getContent()
    })
    this.props.onCreate && this.props.onCreate(this.tip)
  }

  componentDidUpdate() {
    this.tip.set({
      ...getNativeTippyProps(this.props),
      content: this.getContent()
    })
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
        {React.isValidElement(this.props.content) && (
          <div ref={this.content}>{this.props.content}</div>
        )}
      </React.Fragment>
    )
  }
}

export default Tippy
