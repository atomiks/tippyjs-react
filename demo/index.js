import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {useSpring, animated} from 'react-spring';
import {followCursor} from 'tippy.js';
import Tippy, {useSingleton} from '../src';
import TippyHeadless, {
  useSingleton as useSingletonHeadless,
} from '../src/headless';

import 'tippy.js/dist/tippy.css';
import './index.css';

const Box = styled(animated.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  visibility: visible;

  &[data-placement^='top'] {
    transform-origin: bottom;
  }

  &[data-placement^='bottom'] {
    transform-origin: top;
  }
`;

function ContentString() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setCount(count => count + 1);
    }, 1000);
  }, []);

  return (
    <Tippy content={count}>
      <button>ContentString</button>
    </Tippy>
  );
}

function ContentElement() {
  const colors = ['red', 'orange', 'yellow', 'green', 'cyan', 'purple', 'pink'];
  const [index, setIndex] = useState(0);

  function renderNextColor() {
    setIndex(index === colors.length - 1 ? 0 : index + 1);
  }

  return (
    <Tippy
      content={
        <>
          <button onClick={renderNextColor}>Next color</button>
          <span style={{color: colors[index]}}>Hello</span>
        </>
      }
      interactive={true}
    >
      <button>ContentElement</button>
    </Tippy>
  );
}

function DisabledProp() {
  const [disabled, setDisabled] = useState(false);

  return (
    <Tippy content="Tooltip" disabled={disabled}>
      <button onClick={() => setDisabled(disabled => !disabled)}>
        disabled: {String(disabled)}
      </button>
    </Tippy>
  );
}

function VisibleProp() {
  const [visible, setVisible] = useState(false);

  return (
    <Tippy content="Tooltip" visible={visible} hideOnClick={false}>
      <button onClick={() => setVisible(visible => !visible)}>
        visible: {String(visible)}
      </button>
    </Tippy>
  );
}

function Singleton() {
  const [source, target] = useSingleton();

  return (
    <>
      <Tippy singleton={source} delay={500} />
      <Tippy content="Hello" singleton={target}>
        <button>Reference</button>
      </Tippy>
      <Tippy content="Bye" singleton={target}>
        <button>Reference</button>
      </Tippy>
    </>
  );
}

function SingletonHeadless() {
  const [source, target] = useSingletonHeadless();

  return (
    <>
      <Tippy
        render={(attrs, content) => <Box {...attrs}>{content}</Box>}
        singleton={source}
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

function FollowCursor() {
  return (
    <Tippy content="hi" followCursor={true} plugins={[followCursor]}>
      <button>followCursor</button>
    </Tippy>
  );
}

function AnimatedHeadlessTippy() {
  const config = {tension: 300, friction: 15};
  const initialStyles = {opacity: 0, transform: 'scale(0.5)'};
  const [props, setSpring] = useSpring(() => initialStyles);

  function onMount() {
    setSpring({
      opacity: 1,
      transform: 'scale(1)',
      onRest: () => {},
      config,
    });
  }

  function onHide({unmount}) {
    setSpring({
      ...initialStyles,
      onRest: unmount,
      config: {...config, clamp: true},
    });
  }

  return (
    <TippyHeadless
      render={attrs => (
        <Box style={props} {...attrs}>
          Hello
        </Box>
      )}
      animation={true}
      onMount={onMount}
      onHide={onHide}
    >
      <button>react-spring</button>
    </TippyHeadless>
  );
}

function App() {
  return (
    <>
      <h2>Content</h2>
      <ContentString />
      <ContentElement />
      <h2>Special</h2>
      <DisabledProp />
      <VisibleProp />
      <h2>Singleton</h2>
      <Singleton />
      <h2>Singleton Headless</h2>
      <SingletonHeadless />
      <h2>Plugins</h2>
      <FollowCursor />
      <h2>Headless Tippy</h2>
      <AnimatedHeadlessTippy />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
