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

const App = () => (
  <main>
    <RegularTooltip />
    <TooltipWithJSX />
    <TooltipWithProps />
  </main>
)

ReactDOM.render(<App />, document.getElementById('root'))
```

## Native props

See the [Tippy.js docs](https://atomiks.github.io/tippyjs/#all-options)

## React-specific props

### `isEnabled?: boolean`

Prop to control the `tippy.enable()` / `tippy.disable()` instance methods. Use this when you want to temporarily disable a tippy from showing.

```jsx
class App extends Component {
  state = {
    isEnabled: true
  }

  render() {
    return (
      <Tippy isEnabled={this.state.isEnabled}>
        <button />
      </Tippy>
    )
  }
}
```

### `isVisible?: boolean`

Prop to control the `tippy.show()` / `tippy.hide()` instance methods. Use this when you want to programmatically show or hide the tippy instead of relying on UI events.

⚠️ **It must be accompanied by a `"manual"` trigger prop.**

```jsx
class App extends Component {
  state = {
    isVisible: true
  }

  render() {
    return (
      <Tippy trigger="manual" isVisible={this.state.isVisible}>
        <button />
      </Tippy>
    )
  }
}
```

### `onCreate?: (tip: Instance) => void`

Callback invoked when the Tippy instance has been created. Use this when you need to store the Tippy instance on the component.

```jsx
class App extends Component {
  storeTippyInstance = tip => {
    this.tip = tip
  }

  render() {
    return (
      <Tippy onCreate={this.storeTippyInstance}>
        <button />
      </Tippy>
    )
  }
}
```

## Default props and themes

You can create a new component file that imports the component and its CSS, themes etc., and sets the default props. From this file, you can import the component throughout your app.

```js
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/dist/themes/translucent.css'

// `performance: true` disables data-tippy-* attributes as they are unnecessary
// in React and slow down initialization.
Tippy.defaultProps = {
  performance: true
}

export default Tippy

// In another file
import Tippy from './Tippy'
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
