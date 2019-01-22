import React from 'react'
import ReactDOM from 'react-dom'
import Tippy from '../src/Tippy'
import 'tippy.js/dist/tippy.css'
import './index.css'

Tippy.defaultProps = {
  content: 'Tooltip',
  animateFill: false,
  hideOnClick: false,
}

class FetchExample extends React.Component {
  state = {
    image: null,
    isFetching: false,
    canFetch: true,
    isVisible: false,
  }

  static loadingContent = 'Loading new image...'

  fetchRandomImage = () => {
    this.setState({ isVisible: true })

    if (this.state.isFetching || !this.state.canFetch) return

    this.setState({
      isFetching: true,
      canFetch: false,
    })

    fetch('https://unsplash.it/200/?random')
      .then(response => response.blob())
      .then(blob => {
        if (this.state.isVisible) {
          this.setState({
            image: URL.createObjectURL(blob),
          })
        }
        this.setState({
          isFetching: false,
        })
      })
  }

  onHidden = () => {
    this.setState({ image: null, canFetch: true })
  }

  onHide = () => {
    this.setState({ isVisible: false })
  }

  render() {
    return (
      <Tippy
        onShow={this.fetchRandomImage}
        onHidden={this.onHidden}
        onHide={this.onHide}
        content={
          <React.Fragment>
            {this.state.image ? (
              <img
                width="200"
                height="200"
                src={this.state.image}
                alt="image"
              />
            ) : (
              FetchExample.loadingContent
            )}
          </React.Fragment>
        }
      >
        <button onClick={this.toggleArrow}>Async update</button>
      </Tippy>
    )
  }
}

const COLORS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']

class InputExample extends React.Component {
  state = {
    value: '',
  }

  onChange = e => {
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <Tippy
        content={
          <form>
            <span style={{ color: COLORS[this.state.value.length] }}>
              Hello
            </span>
            <input type="text" onChange={this.onChange} />
          </form>
        }
        interactive={true}
      >
        <button>Hover me</button>
      </Tippy>
    )
  }
}

class ComponentChild extends React.Component {
  render() {
    return <button>Component Child</button>
  }
}

class App extends React.Component {
  state = {
    arrow: false,
  }

  toggleArrow = () => {
    this.setState(state => ({
      arrow: !state.arrow,
    }))
  }

  render() {
    return (
      <main className="container">
        <h1>Content</h1>
        <Tippy content="Hello">
          <button>String content</button>
        </Tippy>
        <Tippy content={<strong>Tooltip</strong>}>
          <button>JSX content</button>
        </Tippy>
        <Tippy
          onCreate={tip => (this.tippyArrowInstance = tip)}
          arrow={this.state.arrow}
        >
          <button onClick={this.toggleArrow}>Toggle arrow</button>
        </Tippy>
        <FetchExample />
        <InputExample />
        <Tippy>
          <ComponentChild />
        </Tippy>
      </main>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
