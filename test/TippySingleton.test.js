import React from 'react';
import Tippy, {TippySingleton as TippySingletonBase} from '../src';
import {render, cleanup} from '@testing-library/react';

jest.useFakeTimers();

afterEach(cleanup);

describe('<TippySingleton />', () => {
  let instance;

  function TippySingleton(props) {
    return <TippySingletonBase {...props} onCreate={i => (instance = i)} />;
  }

  it('renders without crashing', () => {
    render(
      <TippySingleton delay={100}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );
  });

  it('preserves <Tippy /> `onCreate` prop', () => {
    const spy = jest.fn();

    render(
      <TippySingleton>
        <Tippy content="tooltip" onCreate={spy}>
          <button />
        </Tippy>
        <Tippy content="tooltip" onCreate={spy}>
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0].popper).toBeDefined();
    expect(spy.mock.calls[1][0].popper).toBeDefined();
  });

  it('indicates the instances have been combined into a singleton', () => {
    let instances = [];

    function onCreate(instance) {
      instances.push(instance);
    }

    render(
      <TippySingleton>
        <Tippy content="tooltip" onCreate={onCreate}>
          <button />
        </Tippy>
        <Tippy content="tooltip" onCreate={onCreate}>
          <button />
        </Tippy>
      </TippySingleton>,
    );

    instances.forEach(instance => {
      expect(instance.state.isEnabled).toBe(false);
    });
  });

  it('handles dynamic children without crashing', () => {
    const {rerender} = render(
      <TippySingleton>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    rerender(
      <TippySingleton>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    rerender(
      <TippySingleton>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );
  });

  test('props.className: single name is added to tooltip', () => {
    const className = 'hello';

    render(
      <TippySingleton className={className}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.popper.querySelector(`.${className}`)).not.toBeNull();
  });

  test('props.className: multiple names are added to tooltip', () => {
    const classNames = 'hello world';

    render(
      <TippySingleton className={classNames}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.popper.querySelector('.hello')).not.toBeNull();
    expect(instance.popper.querySelector('.world')).not.toBeNull();
  });

  test('props.className: extra whitespace is ignored', () => {
    const className = ' hello world  ';

    render(
      <TippySingleton className={className}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.className).toBe('tippy-tooltip hello world');
  });

  test('props.className: updating does not leave stale className behind', () => {
    const {rerender} = render(
      <TippySingleton className="one">
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.classList.contains('one')).toBe(true);

    rerender(
      <TippySingleton className="two">
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(tooltip.classList.contains('one')).toBe(false);
    expect(tooltip.classList.contains('two')).toBe(true);
  });

  test('props.className: syncs with children.length', () => {
    const {rerender} = render(
      <TippySingleton className="one">
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    rerender(
      <TippySingleton className="one">
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.classList.contains('one')).toBe(true);
  });

  test('props.enabled initially `true`', () => {
    const {rerender} = render(
      <TippySingleton enabled={true}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.state.isEnabled).toBe(true);

    rerender(
      <TippySingleton enabled={false}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.state.isEnabled).toBe(false);
  });

  test('props.enabled initially `false`', () => {
    const {rerender} = render(
      <TippySingleton enabled={false}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.state.isEnabled).toBe(false);

    rerender(
      <TippySingleton enabled={true}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.state.isEnabled).toBe(true);
  });

  test('props.plugins', () => {
    const plugins = [{fn: () => ({})}];

    render(
      <TippySingleton plugins={plugins}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(instance.plugins.slice(1)).toEqual(plugins);
  });
});

describe('TippySingleton.propTypes', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('is defined if NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';

    const Tippy = require('../src/TippySingleton').default;
    expect(Tippy.propTypes).toBeDefined();
  });

  test('is undefined if NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';

    const Tippy = require('../src/TippySingleton').default;
    expect(Tippy.propTypes).toBeUndefined();
  });
});
