<div align="center">
  <img src="https://github.com/atomiks/tippy.js-react/raw/master/logo.png" alt="Logo" height="105">
</div>

<div align="center">
  <h1>Tippy.js for React</h1>
  <p>The complete tooltip and popover solution for React apps</p>
  <a href="https://www.npmjs.com/package/@tippyjs/react">
   <img src="https://img.shields.io/npm/dm/@tippyjs/react.svg?color=%235599ff&style=for-the-badge" alt="npm downloads per month">
  <a>
  <a href="https://github.com/atomiks/tippy.js-react/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@tippyjs/react.svg?color=%23c677cf&style=for-the-badge" alt="MIT License">
  </a>
  <br>
</div>

---

[Tippy.js](https://github.com/atomiks/tippyjs/) is a highly customizable tooltip
and popover library powered by Popper.js. This is a lightweight wrapper that
lets you use it declaratively in React.

<!--
## 💎 Examples

### Tooltips

- [Bootstrap 4 Style](https://codesandbox.io/s/mm61w3rrqx)
- [Material Style](https://codesandbox.io/s/0y6pj161wp)

### Popovers

- [Accessible Emoji Reaction Picker](https://codesandbox.io/s/1vzvoo9mwl)
-->

## 🚀 Installation

```bash
# npm
npm i @tippyjs/react

# Yarn
yarn add @tippyjs/react
```

CDN: https://unpkg.com/@tippyjs/react

Requires React 16.8+

## 🖲 Usage

There are two ways to use this component:

- **Default**: With the built-in DOM rendering and optionally the default CSS
- **Headless**: With React's DOM rendering for better usage with CSS-in-JS and
  spring libraries e.g. `react-spring`

### Default Tippy

Import the `Tippy` component and (optionally) the core CSS. Wrap the `<Tippy />`
component around the element, supplying the tooltip's content as the `content`
prop. It can take a string or a tree of React elements.

```jsx
import React from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

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

### Headless Tippy

Render your own tippy element from scratch:

```jsx
import React from 'react';
import Tippy from '@tippyjs/react/headless';

const HeadlessTippy = () => (
  <Tippy render={attrs => <div {...attrs}>My tippy box</div>}>
    <button>My button</button>
  </Tippy>
);
```

A more advanced example using `react-spring` & `styled-components`:

```jsx
import React from 'react';
import styled from 'styled-components';
import {useSpring, animated} from 'react-spring';

const Box = styled(animated.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  visibility: visible;
`;

function AnimatedHeadlessTippy() {
  const [props, set, stop] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.5)',
  }));

  return (
    <Tippy
      render={attrs => (
        <Box style={props} {...attrs}>
          Hello
        </Box>
      )}
      animation={true}
      onMount={() => {
        stop();
        set({
          opacity: 1,
          transform: 'scale(1)',
          onRest() {},
        });
      }}
      onHide={({unmount}) => {
        stop();
        set({
          opacity: 0,
          transform: 'scale(0.5)',
          onRest: unmount,
        });
      }}
    >
      <button>My button</button>
    </Tippy>
  );
}
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

`styled-components` v4+ does this for you automatically, so it should be
seamless when using the `styled` constructor.

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

Visit [All Props](https://atomiks.github.io/tippyjs/v6/all-props/) to view the
complete list.

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

> **Note**: This does not apply if using Headless Tippy

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

See [themes](https://atomiks.github.io/tippyjs/v6/themes/) for more information.

### `disabled?: boolean`

Use this when you want to temporarily disable a tippy from showing.

```jsx
function App() {
  const [disabled, setDisabled] = useState(false);
  return (
    <Tippy content="Tooltip" disabled={disabled}>
      <button />
    </Tippy>
  );
}
```

### `visible?: boolean`

Programmatically show or hide the tippy instead of relying on events.

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
import Tippy from '@tippyjs/react';
import {followCursor} from 'tippy.js';

function App() {
  return (
    <Tippy content="Tooltip" followCursor={true} plugins={[followCursor]}>
      <button />
    </Tippy>
  );
}
```

[Read more about plugins here](https://atomiks.github.io/tippyjs/v6/plugins/).

## 🌈 Multiple tippies on a single element

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

## 📚 useSingleton

A Hook for the
[`createSingleton()`](https://atomiks.github.io/tippyjs/v6/addons/#singleton)
addon.

```jsx
import Tippy, {useSingleton} from '@tippyjs/react';

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

- `@popperjs/core` ≈ 6 kB
- `tippy.js` ≈ 4.5 kB
- `@tippyjs/react` ≈ 1 kB

If you're using Popper.js for other parts of your app, the added cost becomes
much smaller!

## ⭐️ Comparison with other tooltip/popover libraries

Why should you use this library, and how does it compare to other ones?

[Read all about it here!](https://atomiks.github.io/tippyjs/v6/motivation/)

## 📝 License

MIT
