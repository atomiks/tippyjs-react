<div align="center">
  <img src="https://github.com/atomiks/tippy.js-react/raw/master/logo.png" alt="Logo" height="105">
</div>

<div align="center">
  <h1>Tippy.js for React</h1>
  <p>The complete tooltip and popover solution for React apps</p>
  <a href="https://www.npmjs.com/package/@tippy.js/react">
   <img src="https://img.shields.io/npm/dm/@tippy.js/react.svg?color=%235599ff&style=for-the-badge" alt="npm downloads per month">
  <a>
  <a href="https://github.com/atomiks/tippy.js-react/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@tippy.js/react.svg?color=%23c677cf&style=for-the-badge" alt="MIT License">
  </a>
  <br>
  <br>
</div>

---

[Tippy.js](https://github.com/atomiks/tippyjs/) is a highly customizable tooltip
and popover library powered by Popper.js. This is a lightweight wrapper that
lets you use it declaratively in React.

## 🚀 Installation

```bash
# npm
npm i @tippy.js/react

# Yarn
yarn add @tippy.js/react
```

CDN: https://unpkg.com/@tippy.js/react

Requires React 16.8+

## 🖲 Usage

Wrap the `<Tippy />` component around the element, supplying the tooltip's
content as the `content` prop. It can take a string or a tree of React elements.

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
```

### Component children

If you want to use a component element as a child, ensure you forward the ref to
the DOM node:

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

If you're using a library that doesn't `forwardRef` for you, and doesn't give
access to the ref via `innerRef` or similar, you can use a wrapper `<span>`
element as a workaround.

```jsx
<Tippy content="Tooltip">
  <span>
    <LegacyComponent>Unfortunately</LegacyComponent>
  </span>
</Tippy>
```

> Although Tippy will add `tabindex` for you on the `<span>` which allows it to
> receive focus, it may affect accessibility with regards to screenreaders,
> since `<span>` is not traditionally focusable (unlike a `<button>` for
> example).

## 🧬 Props

All of the native Tippy.js options can be passed as props.

Visit [All Options](https://atomiks.github.io/tippyjs/all-options/) to view the
complete table.

```jsx
<Tippy
  content="Tooltip"
  arrow={true}
  animation="scale"
  duration={0}
  delay={[300, 0]}
  // ...and many more!
>
  <button>Text</button>
</Tippy>
```

In addition, there are 4 more props added specifically for the React component.

### `className?: string` (v2.1)

A React alternative to the `theme` prop. The className gets added to the tooltip
element's class list as expected, without adding `-theme` as a suffix.

```jsx
<Tippy content="Tooltip" className="hello world">
  <button />
</Tippy>
```

If you're using `styled-components`, the `className` prop allows you to avoid
global styles with the following technique:

```js
const PurpleTippy = styled(Tippy)`
  background: purple;

  /* Styling the arrow for different placements */
  &[x-placement^='top'] {
    .tippy-arrow {
      border-top-color: purple;
    }
  }
`
```

See [themes](https://atomiks.github.io/tippyjs/themes/) for more information.

> **Note**: the following examples are using the new
> [React Hooks API](https://reactjs.org/docs/hooks-intro.html). It isn't
> required to use this library – the props will work as expected in class
> components too.

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
UI events. This puts the tippy in controlled mode so it will only respond to
state.

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

### `onCreate?: (instance: Instance) => void`

Callback invoked when the tippy instance has been created. Use this when you
need to store the tippy instance on the component.

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

### Default props

You can create a new component file that imports the component and sets the
default props. From this file, you can import the component throughout your app.

```js
import Tippy from '@tippy.js/react'

Tippy.defaultProps = {
  ...Tippy.defaultProps,
  arrow: true,
}

export default Tippy
```

You could also create Proxy components that wrap the base `<Tippy />` component
with a new name and sets its own default props:

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

## 🌈 Multiple tippys on a single element

You can nest the components like so:

```jsx
<Tippy content="Tooltip" placement="bottom">
  <Tippy content="Tooltip" placement="left">
    <Tippy content="Tooltip" placement="right">
      <Tippy content="Tooltip">
        <button />
      </Tippy>
    </Tippy>
  </Tippy>
</Tippy>
```

## 📚 `<TippyGroup />`

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

## 📦 Bundle size

<img src="https://img.shields.io/bundlephobia/minzip/@tippy.js/react.svg?color=%2373bd4b&style=for-the-badge" alt="Bundle size">

- `popper.js` ≈ 7 kB
- `tippy.js` ≈ 7.5 kB (including CSS)
- `@tippy.js/react` ≈ 1 kB

If you're using Popper.js for other parts of your app, the added cost becomes
much smaller!

## ⭐️ Comparison with other tooltip/popover libraries

Why should you use this library, and how does it compare to other ones?

[Read all about it here!](https://atomiks.github.io/tippyjs/motivation/)

## 📝 License

MIT
