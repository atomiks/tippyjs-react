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
</div>

---

[Tippy.js](https://github.com/atomiks/tippyjs/) is a highly customizable tooltip
and popover library powered by Popper.js. This is a lightweight wrapper that
lets you use it declaratively in React.

## 💎 Examples

### Tooltips

- [Bootstrap 4 Style](https://codesandbox.io/s/mm61w3rrqx)
- [Material Style](https://codesandbox.io/s/0y6pj161wp)

### Popovers

- [Accessible Emoji Reaction Picker](https://codesandbox.io/s/1vzvoo9mwl)

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

Import the `Tippy` component and the core CSS. Wrap the `<Tippy />` component
around the element, supplying the tooltip's content as the `content` prop. It
can take a string or a tree of React elements.

```jsx
import React from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

const StringContent = () => (
  <Tippy content="Hello">
    <button>My button</button>
  </Tippy>
);

const JSXContent = () => (
  <Tippy content={<span>Tooltip</span>}>
    <button>My button</button>
  </Tippy>
);
```

### Component children

If you want to use a component element as a child, ensure you forward the ref to
the DOM node:

```jsx
import React, {forwardRef} from 'react';

function ThisWontWork() {
  return <button>Text</button>;
}

const ThisWillWork = forwardRef((props, ref) => {
  return <button ref={ref}>Text</button>;
});

function App() {
  return (
    <Tippy content="Tooltip">
      <ThisWillWork />
    </Tippy>
  );
}
```

`styled-components` v4 does this for you automatically, so it should be seamless
when using the `styled` constructor.

If you're using a library that doesn't `forwardRef` for you, and doesn't give
access to the ref via `innerRef` or similar, you can use a wrapper `<span>`
element as a workaround.

```jsx
<Tippy content="Tooltip">
  <span tabIndex="0">
    <LegacyComponent>Content</LegacyComponent>
  </span>
</Tippy>
```

## 🧬 Props

All of the native Tippy.js props can be passed to the component.

Visit [All Props](https://atomiks.github.io/tippyjs/all-props/) to view the
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

In addition, there are 3 more props added specifically for the React component.

### `className?: string`

A React alternative to the `theme` prop. The className gets added to the tooltip
element's class list as expected, without adding `-theme` as a suffix.

```jsx
<Tippy content="Tooltip" className="hello world">
  <button />
</Tippy>
```

If you're using `styled-components`, the `className` prop allows you to avoid
global styles with the following technique:

```jsx
const PurpleTippy = styled(Tippy)`
  background: purple;

  /* Styling the arrow for different placements */
  &[data-placement^='top'] {
    .tippy-arrow {
      border-top-color: purple;
    }
  }
`;
```

See [themes](https://atomiks.github.io/tippyjs/themes/) for more information.

> **Note**: the following examples are using the new
> [React Hooks API](https://reactjs.org/docs/hooks-intro.html). It isn't
> required to use this library – the props will work as expected in class
> components too.

### `enabled?: boolean`

Prop to control the `tippy.enable()` / `tippy.disable()` instance methods. Use
this when you want to temporarily disable a tippy from showing.

```jsx
function App() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Tippy content="Tooltip" enabled={enabled}>
      <button />
    </Tippy>
  );
}
```

### `visible?: boolean`

Prop to control the `tippy.show()` / `tippy.hide()` instance methods. Use this
when you want to programmatically show or hide the tippy instead of relying on
UI events. This puts the tippy in controlled mode so it will only respond to
state.

```jsx
function App() {
  const [visible, setVisible] = useState(true);
  return (
    <Tippy content="Tooltip" visible={visible}>
      <button />
    </Tippy>
  );
}
```

> **Note**: You should also set the `hideOnClick` prop to `false` if you don't
> want the tippy to hide when the user clicks on the document somewhere.

### Plugins

Tippy.js splits certain props into separate pieces of code called plugins to
enable treeshaking, so that users who don't need the prop's functionality are
not burdened with the cost of it.

```jsx
import Tippy from '@tippy.js/react';
import {followCursor} from 'tippy.js';
import 'tippy.js/dist/tippy.css';

function App() {
  return (
    <Tippy content="Tooltip" followCursor={true} plugins={[followCursor]}>
      <button />
    </Tippy>
  );
}
```

[Read more about plugins here](https://atomiks.github.io/tippyjs/plugins/).

### Performance

Props that the `popperInstance` depends on that aren't primitive values should be memoized or hoisted to a static constant, so that the `popperInstance` is not recreated on every render:

- `popperOptions`
- `flipBehavior`

```jsx
// static constant if it doesn't change
const popperOptions = {};

function App() {
  const [placement, setPlacement] = useState('right');
  // memoized value if it's dynamic
  const flipBehavior = useMemo(() => [placement, 'bottom'], [placement]);

  return (
    <Tippy
      content="Tooltip"
      placement={placement}
      flipBehavior={flipBehavior}
      popperOptions={popperOptions}
    >
      <button />
    </Tippy>
  );
}
```

### Default props

You can create a new component file that exports a wrapper component that has
its own default props.

```js
import Tippy from '@tippy.js/react';

// When importing Tippy from this file instead, it will have the fade animation
// by default
export default props => <Tippy animation="fade" {...props} />;
```

### Proxy components

`<Tippy />`'s purpose is to be a useful generic component for all types of
popper elements. This includes tooltips, popovers, dropdowns, etc. This means
you can create proxy components that wrap the base `<Tippy />` component with a
new name and their own default props, to distinguish their functionality. For
example:

```jsx
export function Tooltip(props) {
  return (
    <Tippy
      animation="fade"
      theme="translucent"
      arrow={true}
      delay={150}
      {...props}
    />
  );
}

export function Popover(props) {
  return (
    <Tippy
      interactive={true}
      interactiveBorder={10}
      animation="scale"
      theme="light-border"
      trigger="click"
      {...props}
    />
  );
}

// In another file
import {Tooltip, Popover} from './Tippy';
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

## 📚 Singleton

Wraps the
[`createSingleton()`](https://atomiks.github.io/tippyjs/addons/#singleton)
method.

Depending on your component tree, you can use one of the following:

### `<TippySingleton />`

If each of your reference elements are adjacent to one another, with no nesting in the tree.

```jsx
import Tippy, {TippySingleton} from '@tippy.js/react';

function App() {
  return (
    <TippySingleton delay={500}>
      <Tippy content="a">
        <button />
      </Tippy>
      <Tippy content="b">
        <button />
      </Tippy>
    </TippySingleton>
  );
}
```

### `useSingleton()` (v3.1)

If each of your reference elements are not adjacent to one another, or there is nesting in the tree.

```jsx
import Tippy, {useSingleton} from '@tippy.js/react';

function App() {
  const singleton = useSingleton({delay: 500});

  return (
    <>
      <Tippy content="a" singleton={singleton}>
        <button />
      </Tippy>
      <button />
      <div>
        <Tippy content="b" singleton={singleton}>
          <button />
        </Tippy>
      </div>
    </>
  );
}
```

## 📦 Bundle size

- `popper.js` ≈ 7 kB
- `tippy.js` ≈ 5.5 kB (including CSS)
- `@tippy.js/react` ≈ 1 kB

If you're using Popper.js for other parts of your app, the added cost becomes
much smaller!

## ⭐️ Comparison with other tooltip/popover libraries

Why should you use this library, and how does it compare to other ones?

[Read all about it here!](https://atomiks.github.io/tippyjs/motivation/)

## 📝 License

MIT
