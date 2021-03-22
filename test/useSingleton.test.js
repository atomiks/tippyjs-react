import React, {useState} from 'react';
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

it('updates `className` correctly', () => {
  function App({className}) {
    const [source, target] = useSingleton();

    return (
      <>
        <Tippy onCreate={onCreate} className={className} singleton={source} />
        <Tippy content="a" singleton={target}>
          <button data-testid="a" />
        </Tippy>
        <Tippy content="b" singleton={target}>
          <button data-testid="b" />
        </Tippy>
      </>
    );
  }

  const {rerender} = render(<App className="some class names" />);

  expect(
    instance.popper.firstElementChild.className.includes('some class names'),
  ).toBe(true);

  rerender(<App className="other names" />);

  expect(
    instance.popper.firstElementChild.className.includes('other names'),
  ).toBe(true);
});

it('errors if source variable has not been passed to a <Tippy />', () => {
  const spy = jest.spyOn(console, 'error');

  function App1() {
    // eslint-disable-next-line
    const [source, target] = useSingleton();

    return (
      <>
        <Tippy />
        <Tippy singleton={target} />
        <Tippy singleton={target} />
      </>
    );
  }

  function App2() {
    const [source, target] = useSingleton();

    return (
      <>
        <Tippy singleton={source} />
        <Tippy singleton={target} />
        <Tippy singleton={target} />
      </>
    );
  }

  render(<App1 />);

  expect(spy).toHaveBeenCalledWith(
    [
      '@tippyjs/react: The `source` variable from `useSingleton()` has',
      'not been passed to a <Tippy /> component.',
    ].join(' '),
  );

  spy.mockReset();

  render(<App2 />);

  expect(spy).not.toHaveBeenCalled();
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

it('when new Tippys are added to DOM, they are registered with singleton', () => {
  const TippyCreator = ({target}) => {
    const [isTippyAdded, setIsTippyAdded] = useState(false);

    return (
      <div>
        <button onClick={() => setIsTippyAdded(true)} data-testid="add-tippy" />
        {isTippyAdded && (
          <Tippy content="a" singleton={target}>
            <button data-testid="a" />
          </Tippy>
        )}
      </div>
    );
  };

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
        <TippyCreator target={target} />
      </>
    );
  }

  const {getByTestId} = render(<App />);

  const addTippyButton = getByTestId('add-tippy');

  fireEvent.click(addTippyButton);

  const buttonA = getByTestId('a');

  fireEvent.click(buttonA);

  expect(instance.state.isVisible).toBe(true);
  expect(instance.props.content.textContent).toBe('a');
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
