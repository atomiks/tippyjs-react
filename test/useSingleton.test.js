import React from 'react';
import Tippy, {useSingleton} from '../src';
import TippyHeadless, {
  useSingleton as useSingletonHeadless,
} from '../src/headless';
import {render, cleanup, fireEvent} from '@testing-library/react';

jest.useFakeTimers();

afterEach(cleanup);

let instance;
function onCreate(i) {
  instance = i;
}

it('changes the singleton content correctly', () => {
  function App() {
    const [source, target] = useSingleton();

    return (
      <>
        <Tippy
          onCreate={onCreate}
          singleton={source}
          trigger="click"
          hideOnClick={false}
        />
        <Tippy content="a" singleton={target}>
          <button data-testid="a" />
        </Tippy>
        <Tippy content="b" singleton={target}>
          <button data-testid="b" />
        </Tippy>
      </>
    );
  }

  const {getByTestId} = render(<App />);

  const buttonA = getByTestId('a');
  const buttonB = getByTestId('b');

  fireEvent.click(buttonA);

  expect(instance.state.isVisible).toBe(true);
  expect(instance.props.content.textContent).toBe('a');

  fireEvent.click(buttonB);

  expect(instance.props.content.textContent).toBe('b');
});

describe('disabled prop', () => {
  function App({disabled}) {
    const [source, target] = useSingleton({disabled});

    return (
      <>
        <Tippy
          onCreate={onCreate}
          singleton={source}
          trigger="click"
          hideOnClick={false}
        />
        <Tippy content="a" singleton={target}>
          <button data-testid="a" />
        </Tippy>
        <Tippy content="b" singleton={target}>
          <button data-testid="b" />
        </Tippy>
      </>
    );
  }

  it('it is set correctly on mount and on updates', () => {
    const {getByTestId, rerender} = render(<App disabled={true} />);
    const buttonA = getByTestId('a');

    fireEvent.click(buttonA);

    expect(instance.state.isVisible).toBe(false);

    rerender(<App disabled={false} />);

    fireEvent.click(buttonA);

    expect(instance.state.isVisible).toBe(true);

    rerender(<App disabled={true} />);

    fireEvent.click(buttonA);

    expect(instance.state.isVisible).toBe(false);
  });
});

describe('useSingleton headless mode', () => {
  function App() {
    const [source, target] = useSingletonHeadless();

    return (
      <>
        <TippyHeadless
          onCreate={onCreate}
          render={(attrs, content) => <div {...attrs}>{content}</div>}
          singleton={source}
          trigger="click"
          hideOnClick={false}
        />

        <TippyHeadless content="a" singleton={target}>
          <button data-testid="a" />
        </TippyHeadless>
        <TippyHeadless content="b" singleton={target}>
          <button data-testid="b" />
        </TippyHeadless>
      </>
    );
  }

  it('updates content correctly', () => {
    const {getByTestId} = render(<App />);

    const buttonA = getByTestId('a');
    const buttonB = getByTestId('b');

    fireEvent.click(buttonA);

    expect(instance.state.isVisible).toBe(true);
    expect(instance.popper).toMatchSnapshot();

    fireEvent.click(buttonB);

    expect(instance.popper).toMatchSnapshot();
  });
});
