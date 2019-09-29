import React from 'react';
import Tippy, {TippySingleton} from '../src';
import {render, cleanup} from '@testing-library/react';

jest.useFakeTimers();

afterEach(cleanup);

describe('<TippySingleton />', () => {
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

  it('uses `onCreate` prop', () => {
    const spy = jest.fn();

    render(
      <TippySingleton onCreate={spy}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippySingleton>,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].popper).toBeDefined();
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
