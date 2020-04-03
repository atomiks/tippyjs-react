import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {useSpring, animated} from 'react-spring';
import {motion, useSpring as useFramerSpring} from 'framer-motion';
import {followCursor} from 'tippy.js';
import Tippy, {useSingleton} from '../src';
import TippyHeadless, {
  useSingleton as useSingletonHeadless,
} from '../src/headless';

import 'tippy.js/dist/tippy.css';
import './index.css';

const ReactSpringBox = styled(animated.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;

  &[data-placement^='top'] {
    transform-origin: bottom;
  }

  &[data-placement^='bottom'] {
    transform-origin: top;
  }
`;

const ReactFramerBox = styled(motion.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;

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
    <Tippy content="Tooltip" visible={visible}>
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
  const [source, target] = useSingletonHeadless({overrides: ['placement']});

  return (
    <>
      <TippyHeadless
        render={(attrs, content) => (
          <ReactSpringBox {...attrs}>{content}</ReactSpringBox>
        )}
        singleton={source}
        delay={500}
      />

      <TippyHeadless content="Hello" singleton={target}>
        <button>Reference</button>
      </TippyHeadless>
      <TippyHeadless placement="right" content="Bye" singleton={target}>
        <button>Reference</button>
      </TippyHeadless>
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

function ReactSpring() {
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
        <ReactSpringBox style={props} {...attrs}>
          Hello
        </ReactSpringBox>
      )}
      animation={true}
      onMount={onMount}
      onHide={onHide}
    >
      <button>react-spring</button>
    </TippyHeadless>
  );
}

function FramerMotion() {
  const springConfig = {damping: 15, stiffness: 300};
  const initialScale = 0.5;
  const opacity = useFramerSpring(0, springConfig);
  const scale = useFramerSpring(initialScale, springConfig);

  function onMount() {
    scale.set(1);
    opacity.set(1);
  }

  function onHide({unmount}) {
    const cleanup = scale.onChange(value => {
      if (value <= initialScale) {
        cleanup();
        unmount();
      }
    });

    scale.set(0.5);
    opacity.set(0);
  }

  return (
    <TippyHeadless
      render={attrs => (
        <ReactFramerBox style={{scale, opacity}} {...attrs}>
          Hello
        </ReactFramerBox>
      )}
      animation={true}
      onMount={onMount}
      onHide={onHide}
    >
      <button>framer-motion</button>
    </TippyHeadless>
  );
}

function FullyControlledOnClick() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <Tippy
      content={
        <div style={{padding: '1rem'}}>
          <button onClick={close}>Close it</button>
        </div>
      }
      interactive={true}
      visible={isOpen}
      onClickOutside={close}
    >
      <button onClick={isOpen ? close : open}>Open</button>
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
      <DisabledProp />
      <VisibleProp />
      <h2>Singleton</h2>
      <Singleton />
      <h2>Singleton Headless</h2>
      <SingletonHeadless />
      <h2>Plugins</h2>
      <FollowCursor />
      <h2>Headless Tippy w/ React Spring</h2>
      <ReactSpring />
      <h2>Headless Tippy w/ Framer Motion</h2>
      <FramerMotion />
      <h2>Fully Controlled on Click</h2>
      <FullyControlledOnClick />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
