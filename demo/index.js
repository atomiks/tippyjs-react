import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {useSpring, animated} from 'react-spring';
import {followCursor} from 'tippy.js';
import Tippy, {useSingleton} from '../src';
import TippyHeadless from '../src/headless';

import 'tippy.js/dist/tippy.css';
import './index.css';

const Box = styled(animated.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  visibility: visible;
  transform-origin: bottom;
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

function EnabledProp() {
  const [enabled, setEnabled] = useState(true);

  return (
    <Tippy content="Tooltip" enabled={enabled}>
      <button onClick={() => setEnabled(enabled => !enabled)}>
        enabled: {String(enabled)}
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

function SingletonHook() {
  const singleton = useSingleton({delay: 500});
  const [count, setCount] = useState(3);

  let children = [];
  for (let i = 0; i < count; i++) {
    children.push(
      <Tippy key={i} singleton={singleton} content="Tooltip">
        <button>{i}</button>
      </Tippy>,
    );
  }

  useEffect(() => {
    setInterval(() => {
      setCount(count => (count === 5 ? 1 : count + 1));
    }, 5000);
  }, []);

  return <>{children}</>;
}

function FollowCursor() {
  return (
    <Tippy content="hi" followCursor={true} plugins={[followCursor]}>
      <button>followCursor</button>
    </Tippy>
  );
}

function Template() {
  const [props, set, stop] = useSpring(() => ({
    opacity: 0,
    transform: 'scale(0.5)',
    config: {
      tension: 200,
      friction: 20,
      mass: 1,
    },
  }));

  return (
    <TippyHeadless
      render={attrs => (
        <Box style={props} {...attrs}>
          Hello
        </Box>
      )}
      trigger="click"
      animation={true}
      onMount={() => {
        stop();
        set({
          opacity: 1,
          transform: 'scale(1)',
        });
      }}
      onHide={instance => {
        stop();
        set({
          opacity: 0,
          transform: 'scale(0.5)',
        });

        function hideLoop() {
          if (props.opacity.value <= 0) {
            instance.unmount();
          } else {
            requestAnimationFrame(hideLoop);
          }
        }

        requestAnimationFrame(hideLoop);
      }}
    >
      <button>Template prop</button>
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
      <EnabledProp />
      <VisibleProp />
      <h2>Singleton (via useSingleton hook)</h2>
      <SingletonHook />
      <h2>Plugins</h2>
      <FollowCursor />
      <h2>Headless Tippy</h2>
      <Template />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
