<p align="center">
  <img src="https://github.com/atomiks/tippy.js-react/raw/master/logo.png" alt="Logo" width="295">
</p>

<h1 align="center">Tippy.js for React</h1>

React component for [Tippy.js](https://github.com/atomiks/tippyjs) 4. Tippy.js
is a highly customizable tooltip and popover library powered by Popper.js. This
wrapper lets you use it declaratively in React.

## Installation

```
npm i @tippy.js/react
```

CDN: https://unpkg.com/@tippy.js/react

Requires React 16.8+, `prop-types`, and `tippy.js` if using via CDN.

## Usage

Required props: tooltip content as `props.content` and a single element child
(reference) as `props.children`.

```jsx
import React from 'react'
import Tippy from '@tippy.js/react'

const StringContent = () => (
  <Tippy content="Hello">
    <button>My button</button>
  </Tippy>
)

const JSXContent = () => (
  <Tippy content={<span>Tooltip</span>}>
    <button>My button</button>
  </Tippy>
)

const VariousProps = () => (
  <Tippy content="Hi" arrow={true} duration={500} delay={[100, 50]}>
    <button>My button</button>
  </Tippy>
)
```

## Component children

If you want to use a component as a child, ensure you forward the ref to the DOM
node:

```jsx
import React, { forwardRef } from 'react'

function ThisWontWork() {
  return <button>Text</button>
}

const ThisWillWork = forwardRef((props, ref) => {
  return <button ref={ref}>Text</button>
})

function App() {
  return (
    <Tippy content="Tooltip">
      <ThisWillWork />
    </Tippy>
  )
}
```

`styled-components` v4 does this for you automatically, so it should be seamless
when using the `styled` constructor.

## Native props

See the [Tippy.js docs](https://atomiks.github.io/tippyjs/all-options/)

## React-specific props

> Note: these examples are using the new
> [React Hooks API](https://reactjs.org/docs/hooks-intro.html). It isn't
> required to use this library – the props will work as expected in class
> components too.

### `className?: string` (v2.1)

A React-alternative to the `theme` prop. The className gets added to the tooltip
element's class list as expected, without adding `-theme` as a suffix.

```jsx
function App() {
  return (
    <Tippy content="Tooltip" className="hello world">
      <button />
    </Tippy>
  )
}
```

Rendered DOM:

```html
<div class="tippy-popper">
  <div class="tippy-tooltip dark-theme hello world">
    <!-- inner elements -->
  </div>
</div>
```

See [themes](https://atomiks.github.io/tippyjs/themes/) for more information.

### `isEnabled?: boolean`

Prop to control the `tippy.enable()` / `tippy.disable()` instance methods. Use
this when you want to temporarily disable a tippy from showing.

```jsx
function App() {
  const [isEnabled, setIsEnabled] = useState(true)
  return (
    <Tippy content="Tooltip" isEnabled={isEnabled}>
      <button />
    </Tippy>
  )
}
```

### `isVisible?: boolean`

Prop to control the `tippy.show()` / `tippy.hide()` instance methods. Use this
when you want to programmatically show or hide the tippy instead of relying on
UI events.

```jsx
function App() {
  const [isVisible, setIsVisible] = useState(true)
  return (
    <Tippy content="Tooltip" isVisible={isVisible}>
      <button />
    </Tippy>
  )
}
```

> **Note**: You should also set the `hideOnClick` prop to `false` if you don't
> want the tippy to hide when the user clicks on the document somewhere.

### `onCreate?: (tip: Instance) => void`

Callback invoked when the Tippy instance has been created. Use this when you
need to store the Tippy instance on the component.

This should only be done for advanced (imperative) manipulation of the tippy
instance – in most cases using props should suffice.

```jsx
function App() {
  const tippyInstance = useRef()
  return (
    <Tippy
      content="Tooltip"
      onCreate={instance => (tippyInstance.current = instance)}
    >
      <button />
    </Tippy>
  )
}
```

## Multiple tippys on a single reference

You can nest the components, ensuring they have a `multiple` prop:

```jsx
<Tippy placement="bottom" multiple>
  <Tippy placement="left" multiple>
    <Tippy placement="right" multiple>
      <Tippy multiple>
        <button />
      </Tippy>
    </Tippy>
  </Tippy>
</Tippy>
```

## `<TippyGroup />`

Wraps the [`tippy.group()`](https://atomiks.github.io/tippyjs/misc/#groups)
method.

```jsx
import Tippy, { TippyGroup } from '@tippy.js/react'

function App() {
  return (
    <TippyGroup delay={1000}>
      <Tippy content="a">
        <button />
      </Tippy>
      <Tippy content="b">
        <button />
      </Tippy>
    </TippyGroup>
  )
}
```

## Default props

You can create a new component file that imports the component and sets the
default props. From this file, you can import the component throughout your app.

```js
import Tippy from '@tippy.js/react'

Tippy.defaultProps = {
  ...Tippy.defaultProps,
  arrow: true,
}

export default Tippy

// In another file
import Tippy from './Tippy'
```

As an example, you might want to distinguish between a tooltip and a popover by
creating a separate component for both.

```jsx
export const Tooltip = props => <Tippy {...props} />
Tooltip.defaultProps = {
  animation: 'fade',
  arrow: true,
  delay: 150,
  theme: 'translucent',
}

export const Popover = props => <Tippy {...props} />
Popover.defaultProps = {
  animateFill: false,
  animation: 'scale',
  interactive: true,
  interactiveBorder: 10,
  theme: 'light-border',
  trigger: 'click',
}

// In another file
import { Tooltip, Popover } from './Tippy'
```

## License

MIT
