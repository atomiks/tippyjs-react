import React from 'react';
import Tippy, {useSingleton as useSingletonBase} from '../src';
import {render, cleanup} from '@testing-library/react';

jest.useFakeTimers();

afterEach(cleanup);

describe('The useSingleton hook', () => {
  let component;

  const useSingleton = config => {
    return useSingletonBase({
      onComponent: c => (component = c),
      ...config,
    });
  };

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

    component.instances.forEach(instance => {
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
      component.instance.popper.querySelector(`.${className}`),
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

    expect(component.instance.popper.querySelector('.hello')).not.toBeNull();
    expect(component.instance.popper.querySelector('.world')).not.toBeNull();
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

    const {tooltip} = component.instance.popperChildren;

    expect(tooltip.className).toBe('tippy-tooltip hello world');
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
      component.instance.popperChildren.tooltip.classList.contains('one'),
    ).toBe(true);

    rerender(<TestComponent className="two" />);

    expect(
      component.instance.popperChildren.tooltip.classList.contains('one'),
    ).toBe(false);
    expect(
      component.instance.popperChildren.tooltip.classList.contains('two'),
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
      component.instance.popperChildren.tooltip.classList.contains('one'),
    ).toBe(true);
  });
});
