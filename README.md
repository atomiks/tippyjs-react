<div align="center">
  <img src="https://github.com/atomiks/tippy.js-react/raw/master/logo.png" alt="Logo" height="105">
</div>

<div align="center">
  <h1>Tippy.js for React</h1>
</div>

[Tippy.js](https://github.com/atomiks/tippyjs/) is the complete tooltip,
popover, dropdown, and menu solution for the web, powered by Popper.js. It
provides the logic and styling involved in all types of elements that pop out
from the flow of the document and get overlaid on top of the UI, positioned next
to a reference element.

This is a lightweight wrapper that lets you use it declaratively in React.

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

Default Tippy is very quick to use and setup and "just works" out of the box.

### Headless Tippy

Render your own tippy element from scratch:

```jsx
import React from 'react';
import Tippy from '@tippyjs/react/headless';

const HeadlessTippy = () => (
  <Tippy
    render={attrs => (
      <div className="box" {...attrs}>
        My tippy box
      </div>
    )}
  >
    <button>My button</button>
  </Tippy>
);
```

`attrs` is an object containing `data-placement`, `data-reference-hidden`, and
`data-escaped` attributes. This allows you to conditionally style your tippy if
necessary.

#### Headless animation

- [`framer-motion`](https://codesandbox.io/s/festive-fire-hcr47)
- [`react-spring`](https://codesandbox.io/s/vigilant-northcutt-7w3yr)

#### Arrow

To make Popper position your custom arrow, set a `data-popper-arrow` attribute
on it:

```jsx
<Tippy
  render={attrs => (
    <Box {...attrs}>
      Hello
      <Arrow data-popper-arrow="" />
    </Box>
  )}
>
  <button>Reference</button>
</Tippy>
```

For details on styling the arrow from scratch,
[take a look at the Popper tutorial](https://popper.js.org/docs/v2/tutorial/#arrow).

**Note: your arrow must be an `HTMLElement` (not an `SVGElement`). To use an SVG
arrow, wrap it in a `<div>` tag with the `data-popper-arrow` attribute.**

You may also pass a ref to the element directly without the attribute using a
callback ref:

```jsx
function App() {
  const [arrow, setArrow] = useState(null);

  return (
    <Tippy
      render={attrs => (
        <Box {...attrs}>
          Content
          <Arrow ref={setArrow} />
        </Box>
      )}
      popperOptions={{
        modifiers: [
          {
            name: 'arrow',
            options: {
              element: arrow, // can be a CSS selector too
            },
          },
        ],
      }}
    >
      <button>Reference</button>
    </Tippy>
  );
}
```

#### Note on Headless Tippy in React

The root popper node is abstracted away and gets styled/mutated by Tippy
internally, so Headless Tippy in React is partially headless. This ensures it
works correctly with minimal effort on your behalf to render.

When rendering an element with the `render` prop, you're rendering the inner box
element that the root popper node wraps, which is what gets styled and animated.
For advanced cases, you can access the parent popper node as `instance.popper`
in the `onCreate` lifecycle hook.

[Here's `moveTransition` with Framer Motion](https://codesandbox.io/s/tippyjs-react-framer-motion-j94mj).

##### iOS click outside

Add this to your CSS to enable click outsides to work on iOS:

```css
.tippy-iOS {
  cursor: pointer !important;
  -webkit-tap-highlight-color: transparent;
}
```

### Component children

If you want to use a component element as a child, ensure you forward the ref to
the DOM node:

```jsx
import React, {forwardRef} from 'react';

function ThisWontWork() {
  return <button>Reference</button>;
}

const ThisWillWork = forwardRef((props, ref) => {
  return <button ref={ref}>Reference</button>;
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
    <LegacyComponent>Reference</LegacyComponent>
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
  arrow={false}
  animation="scale"
  duration={0}
  delay={[300, 0]}
  // ...and many more!
>
  <button>Reference</button>
</Tippy>
```

In addition, there are 3 more props added specifically for the React component.

### `className?: string`

> **Note**: This does not apply if using Headless Tippy

A React alternative to the `theme` prop. The className gets added to the tooltip
element's class list as expected, without adding `-theme` as a suffix.

```jsx
<Tippy content="Tooltip" className="hello world">
  <button>Reference</button>
</Tippy>
```

If you're using `styled-components`, the `className` prop allows you to avoid
global styles with the following technique:

```jsx
const PurpleTippy = styled(Tippy)`
  background: purple;

  /* Styling the arrow for different placements */
  &[data-placement^='top'] > .tippy-arrow::before {
    border-top-color: purple;
  }
`;
```

See [themes](https://atomiks.github.io/tippyjs/v6/themes/) for more information.

### `disabled?: boolean`

```jsx
function App() {
  const [disabled, setDisabled] = useState(false);

  return (
    <Tippy content="Tooltip" disabled={disabled}>
      <button>Reference</button>
    </Tippy>
  );
}
```

### `visible?: boolean` (controlled mode)

Use React's state to fully control the tippy instead of relying on the native
`trigger` and `hideOnClick` props:

```jsx
function App() {
  const [visible, setVisible] = useState(true);
  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <Tippy content="Tooltip" visible={visible} onClickOutside={hide}>
      <button onClick={visible ? hide : show}>Reference</button>
    </Tippy>
  );
}
```

### Plugins

Tippy.js splits certain props into separate pieces of code called plugins to
enable treeshaking, so that users who don't need the prop's functionality are
not burdened with the cost of it.

```jsx
import Tippy from '@tippyjs/react';
// ⚠️ import from 'tippy.js/headless' if using Headless Tippy
import {followCursor} from 'tippy.js';

function App() {
  return (
    <Tippy content="Tooltip" followCursor={true} plugins={[followCursor]}>
      <button>Reference</button>
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
        <button>Reference</button>
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
  const [source, target] = useSingleton();

  return (
    <>
      {/* This is the tippy that gets used as the singleton */}
      <Tippy singleton={source} delay={500} />

      {/* These become "virtual" */}
      <Tippy content="Hello" singleton={target}>
        <button>Reference</button>
      </Tippy>
      <Tippy content="Bye" singleton={target}>
        <button>Reference</button>
      </Tippy>
    </>
  );
}
```

`useSingleton()` takes an optional props argument:

```js
const [source, target] = useSingleton({
  disabled: true,
  overrides: ['placement'],
});
```

### Headless singleton

The `render` prop takes the singleton content as a second parameter:

```jsx
import Tippy, {useSingleton} from '@tippyjs/react/headless';

function App() {
  const [source, target] = useSingleton();

  return (
    <>
      <Tippy
        singleton={source}
        render={(attrs, content) => (
          <div className="box" {...attrs}>
            {content}
          </div>
        )}
        delay={500}
      />

      <Tippy content="Hello" singleton={target}>
        <button>Reference</button>
      </Tippy>
      <Tippy content="Bye" singleton={target}>
        <button>Reference</button>
      </Tippy>
    </>
  );
}
```

## 📝 License

MIT
