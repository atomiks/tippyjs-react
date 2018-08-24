import React from 'react'
import tippy from 'tippy.js'
import PropTypes from 'prop-types'

const getNativeTippyProps = props => {
  const { children, onCreate, onDestroy, ...tippyProps } = props
  return tippyProps
}

class Tippy extends React.Component {
  reference = React.createRef()
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
    this.tip = tippy.one(this.reference.current, {
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
    const { children, content } = this.props

    return (
      <React.Fragment>
        {React.cloneElement(children, { ref: this.reference })}
        {React.isValidElement(content) && (
          <div ref={this.content}>{content}</div>
        )}
      </React.Fragment>
    )
  }
}

export default Tippy
