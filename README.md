# @tippy.js/react

React component for [Tippy.js](https://github.com/atomiks/tippyjs) 3.

## Installation

```
npm i @tippy.js/react
```

CDN: https://unpkg.com/@tippy.js/react

Requires React 16.2+, `prop-types`, and `tippy.js` if using via CDN.

## Usage

Import the Tippy component and Tippy's CSS.

Required: tooltip content as `props.content` and a single element child (reference) as `props.children`.

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'

const RegularTooltip = () => (
  <Tippy content="Hello">
    <button>My button</button>
  </Tippy>
)

const TooltipWithJSX = () => (
  <Tippy content={<span>Tooltip</span>}>
    <button>My button</button>
  </Tippy>
)

const TooltipWithProps = () => (
  <Tippy content="Hi" arrow={true} duration={500} delay={[100, 50]}>
    <button>My button</button>
  </Tippy>
)

// Special `onCreate` callback prop that passes the tippy instance
class TooltipWithOnCreate extends React.Component {
  render() {
    return (
      <Tippy content="Hi" onCreate={tip => (this.tip = tip)}>
        <button>My button</button>
      </Tippy>
    )
  }
}

const App = () => (
  <main>
    <RegularTooltip />
    <TooltipWithJSX />
    <TooltipWithProps />
    <TooltipWithOnCreate />
  </main>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

See the [Tippy.js docs](https://atomiks.github.io/tippyjs/) for the rest of the props you can supply.

## License

MIT
