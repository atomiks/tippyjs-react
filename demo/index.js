import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Tippy, {TippySingleton} from '../src';
import {followCursor} from 'tippy.js';

import 'tippy.js/dist/tippy.css';
import './index.css';

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

function Singleton() {
  const [count, setCount] = useState(3);

  let children = [];
  for (let i = 0; i < count; i++) {
    children.push(
      <Tippy key={i} content="Tooltip">
        <button>{i}</button>
      </Tippy>,
    );
  }

  useEffect(() => {
    setInterval(() => {
      setCount(count => (count === 5 ? 1 : count + 1));
    }, 5000);
  }, []);

  return <TippySingleton delay={500}>{children}</TippySingleton>;
}

function FollowCursor() {
  return (
    <Tippy content="hi" followCursor={true} plugins={[followCursor]}>
      <button>followCursor</button>
    </Tippy>
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
      <h2>Singleton dynamic children</h2>
      <Singleton />
      <h2>Plugins</h2>
      <FollowCursor />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
