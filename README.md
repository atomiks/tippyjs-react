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

## Default props and static methods

You can create a component file named `Tippy.js` with your necessary defaults, static method calls (on the vanilla module), and theme imports to set up the component. From this file, you can import the component.

```js
import Tippy from '@tippy.js/react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/themes/translucent.css'

tippy.useCapture()

Tippy.defaultProps = {
  performance: true
}

export default Tippy
```

As an example, you might want to distinguish between a tooltip and a popover by creating a separate component for both.

```jsx
export const Tooltip = ({ children, ...rest }) => (
  <Tippy {...rest}>{children}</Tippy>
)
Tooltip.defaultProps = {
  animation: 'fade',
  arrow: true,
  delay: 150,
  theme: 'translucent'
}

export const Popover = ({ children, ...rest }) => (
  <Tippy {...rest}>{children}</Tippy>
)
Popover.defaultProps = {
  animateFill: false,
  animation: 'scale',
  interactive: true,
  interactiveBorder: 10,
  theme: 'light-border',
  trigger: 'click'
}

// In another file
import { Tooltip, Popover } from './Tippy'
```

## License

MIT
