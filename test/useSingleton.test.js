import React from 'react';
import TippyBase, {useSingleton as useSingletonBase} from '../src';
import {render, cleanup} from '@testing-library/react';

jest.useFakeTimers();

afterEach(cleanup);

describe('The useSingleton hook', () => {
  let singletonInstance;
  let instances = [];

  const useSingleton = ({onCreate = noop => noop, ...config} = {}) => {
    return useSingletonBase({
      onCreate: instance => {
        singletonInstance = instance;
        onCreate(instance);
      },
      ...config,
    });
  };

  const Tippy = ({onCreate = noop => noop, ...props} = {}) => {
    return (
      <TippyBase {...props} onCreate={i => instances.push(i) && onCreate(i)} />
    );
  };

  beforeEach(() => {
    singletonInstance = null;
    instances = [];
  });

  it('renders without crashing', () => {
    function TestComponent() {
      const singleton = useSingleton();
      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    render(<TestComponent />);
  });

  it('indicates the instances have been combined into a singleton', () => {
    function TestComponent() {
      const singleton = useSingleton();

      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    render(<TestComponent />);

    instances.forEach(instance => {
      expect(instance.state.isEnabled).toBe(false);
    });
  });

  test('props.className: single name is added to tooltip', () => {
    const className = 'hello';

    function TestComponent() {
      const singleton = useSingleton({className});

      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    render(<TestComponent />);

    expect(
      singletonInstance.popper.querySelector(`.${className}`),
    ).not.toBeNull();
  });

  test('props.className: multiple names are added to tooltip', () => {
    const className = 'hello world';

    function TestComponent() {
      const singleton = useSingleton({className});

      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    render(<TestComponent />);

    expect(singletonInstance.popper.querySelector('.hello')).not.toBeNull();
    expect(singletonInstance.popper.querySelector('.world')).not.toBeNull();
  });

  test('props.className: extra whitespace is ignored', () => {
    const className = ' hello world  ';

    function TestComponent() {
      const singleton = useSingleton({className});

      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    render(<TestComponent />);

    const box = singletonInstance.popper.firstElementChild;

    expect(box.className).toBe('tippy-box hello world');
  });

  test('props.className: updating does not leave stale className behind', () => {
    function TestComponent({className}) {
      const singleton = useSingleton({className});

      return (
        <>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
          <Tippy singleton={singleton} content="tooltip">
            <button />
          </Tippy>
        </>
      );
    }

    const {rerender} = render(<TestComponent className="one" />);

    expect(
      singletonInstance.popper.firstElementChild.classList.contains('one'),
    ).toBe(true);

    rerender(<TestComponent className="two" />);

    expect(
      singletonInstance.popper.firstElementChild.classList.contains('one'),
    ).toBe(false);
    expect(
      singletonInstance.popper.firstElementChild.classList.contains('two'),
    ).toBe(true);
  });

  test('props.className: syncs with children.length', () => {
    function TestComponent({count = 2}) {
      const singleton = useSingleton({className: 'one'});
      const tippies = [];

      for (let i = 0; i < count; i++) {
        tippies.push(
          <Tippy key={i} singleton={singleton} content="tooltip">
            <button />
          </Tippy>,
        );
      }

      return <>{tippies}</>;
    }

    const {rerender} = render(<TestComponent />);
    rerender(<TestComponent count={3} />);

    expect(
      singletonInstance.popper.firstElementChild.classList.contains('one'),
    ).toBe(true);
  });

  test('props.disabled initially `false`', () => {
    let instance;

    function App({disabled}) {
      const singleton = useSingleton({
        disabled,
        onCreate(i) {
          instance = i;
        },
      });

      return (
        <Tippy singleton={singleton}>
          <button />
        </Tippy>
      );
    }

    const {rerender} = render(<App disabled={false} />);

    expect(instance.state.isEnabled).toBe(true);

    rerender(<App disabled={true} />);

    expect(instance.state.isEnabled).toBe(false);
  });

  test('props.disabled initially `true`', () => {
    let instance;

    function App({disabled}) {
      const singleton = useSingleton({
        disabled,
        onCreate(i) {
          instance = i;
        },
      });

      return (
        <Tippy singleton={singleton}>
          <button />
        </Tippy>
      );
    }

    const {rerender} = render(<App disabled={true} />);

    expect(instance.state.isEnabled).toBe(false);

    rerender(<App disabled={false} />);

    expect(instance.state.isEnabled).toBe(true);
  });

  test('props.plugins', () => {
    const plugins = [{fn: () => ({})}];

    function App() {
      const singleton = useSingleton({
        plugins,
        onCreate(instance) {
          expect(instance.plugins.slice(1)).toMatchSnapshot();
        },
      });

      return (
        <>
          <Tippy content="tooltip" singleton={singleton}>
            <button />
          </Tippy>
          <Tippy content="tooltip" singleton={singleton}>
            <button />
          </Tippy>
        </>
      );
    }

    render(<App />);
  });
});
