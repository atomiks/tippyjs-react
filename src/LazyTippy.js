import React from 'react'
import PropTypes from 'prop-types'
import Tippy from './Tippy'

export class LazyTippy extends React.Component {
  state = { isShow: false }

  static propTypes = {
    onShow: PropTypes.func,
    onHidden: PropTypes.func
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

  render() {
    return (
      <Tippy
        {...this.props}
        onShow={this.handleShow}
        onHidden={this.handleHidden}
        content={this.state.isShow ? this.props.content : null}
      />
    )
  }
}
