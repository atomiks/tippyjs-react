import React from 'react';
import TippyBase from '../src/Tippy';
import {render, cleanup} from '@testing-library/react';

afterEach(cleanup);

describe('<Tippy />', () => {
  let instance = null;

  afterEach(() => {
    instance = null;
  });

  function Tippy(props) {
    return <TippyBase {...props} onCreate={i => (instance = i)} />;
  }

  test('renders only the child element', () => {
    const stringContent = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    );

    expect(stringContent.container.innerHTML).toBe('<button></button>');

    const reactElementContent = render(
      <Tippy content={<div>tooltip</div>}>
        <button />
      </Tippy>,
    );

    expect(reactElementContent.container.innerHTML).toBe('<button></button>');
  });

  test('adds a tippy instance to the child node', () => {
    render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    );

    expect(instance).not.toBeNull();
  });

  test('renders react element content inside the content prop', () => {
    render(
      <Tippy content={<strong>tooltip</strong>}>
        <button />
      </Tippy>,
    );

    expect(instance.popper.querySelector('strong')).not.toBeNull();
  });

  test('props.className: single name is added to tooltip', () => {
    const className = 'hello';

    render(
      <Tippy content="tooltip" className={className}>
        <button />
      </Tippy>,
    );

    expect(instance.popper.querySelector(`.${className}`)).not.toBeNull();
  });

  test('props.className: multiple names are added to tooltip', () => {
    const classNames = 'hello world';

    render(
      <Tippy content="tooltip" className={classNames}>
        <button />
      </Tippy>,
    );

    expect(instance.popper.querySelector('.hello')).not.toBeNull();
    expect(instance.popper.querySelector('.world')).not.toBeNull();
  });

  test('props.className: extra whitespace is ignored', () => {
    const className = ' hello world  ';

    render(
      <Tippy content="tooltip" className={className}>
        <button />
      </Tippy>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.className).toBe('tippy-tooltip hello world');
  });

  test('props.className: updating does not leave stale className behind', () => {
    const {rerender} = render(
      <Tippy content="tooltip" className="one">
        <button />
      </Tippy>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.classList.contains('one')).toBe(true);

    rerender(
      <Tippy content="tooltip" className="two">
        <button />
      </Tippy>,
    );

    expect(tooltip.classList.contains('one')).toBe(false);
    expect(tooltip.classList.contains('two')).toBe(true);
  });

  test('props.className: syncs with children.type', () => {
    const {rerender} = render(
      <Tippy content="tooltip" className="one">
        <button />
      </Tippy>,
    );

    rerender(
      <Tippy content="tooltip" className="one">
        <span />
      </Tippy>,
    );

    const {tooltip} = instance.popperChildren;

    expect(tooltip.classList.contains('one')).toBe(true);
  });

  test('unmount destroys the tippy instance and allows garbage collection', () => {
    const {container, unmount} = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    );
    const button = container.querySelector('button');

    unmount();

    expect(button._tippy).toBeUndefined();
    expect(instance.state.isDestroyed).toBe(true);
  });

  test('updating children destroys old instance and creates new one', () => {
    const Button = (_, ref) => <button ref={ref} />;
    const Main = (_, ref) => <main ref={ref} />;
    const Component1 = React.forwardRef(Button);
    const Component2 = React.forwardRef(Main);

    const {container, rerender} = render(
      <Tippy content="tooltip">
        <div />
      </Tippy>,
    );
    const div = container.querySelector('div');

    rerender(
      <Tippy content="tooltip">
        <span />
      </Tippy>,
    );

    const span = container.querySelector('span');

    expect(div._tippy).toBeUndefined();
    expect(span._tippy).toBeDefined();

    rerender(
      <Tippy content="tooltip">
        <Component1 />
      </Tippy>,
    );

    const button = container.querySelector('button');

    expect(span._tippy).toBeUndefined();
    expect(button._tippy).toBeDefined();

    rerender(
      <Tippy content="tooltip">
        <Component2 />
      </Tippy>,
    );

    expect(button._tippy).toBeUndefined();
    expect(container.querySelector('main')._tippy).toBeDefined();
  });

  test('updating props updates the tippy instance', () => {
    const {rerender} = render(
      <Tippy content="tooltip" arrow={false}>
        <button />
      </Tippy>,
    );

    expect(instance.props.arrow).toBe(false);

    rerender(
      <Tippy content="tooltip" arrow={true}>
        <button />
      </Tippy>,
    );

    expect(instance.props.arrow).toBe(true);
  });

  test('props containing refs updates the tippy instance on mount', () => {
    const App = () => {
      const [triggerTarget, setTriggerTarget] = React.useState(null);
      return (
        <div ref={el => setTriggerTarget(el)}>
          Trigger Target
          <Tippy content="tooltip" triggerTarget={triggerTarget}>
            <button />
          </Tippy>
        </div>
      );
    };

    const {container} = render(<App />);

    const instanceNode = container.querySelector('button');
    const instance = instanceNode._tippy;

    expect(instance.props.triggerTarget).toBe(instanceNode.parentNode);
  });

  test('component as a child', () => {
    const Child = React.forwardRef(function Comp(_, ref) {
      return <button ref={ref} />;
    });

    render(
      <Tippy content="tooltip">
        <Child />
      </Tippy>,
    );

    expect(instance).not.toBeNull();
  });

  test('refs are preserved on the child', done => {
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.refObject = React.createRef();
      }

      componentDidMount() {
        expect(this.callbackRef instanceof Element).toBe(true);
        expect(this.refObject.current instanceof Element).toBe(true);
        done();
      }

      render() {
        return (
          <>
            <Tippy content="tooltip">
              <button ref={node => (this.callbackRef = node)} />
            </Tippy>
            <Tippy content="tooltip">
              <button ref={this.refObject} />
            </Tippy>
          </>
        );
      }
    }

    render(<App />);
  });

  test('nesting', () => {
    render(
      <TippyBase content="tooltip" placement="bottom" visible>
        <TippyBase content="tooltip" placement="left" visible>
          <TippyBase content="tooltip" visible>
            <button>Text</button>
          </TippyBase>
        </TippyBase>
      </TippyBase>,
    );

    expect(document.querySelectorAll('.tippy-popper').length).toBe(3);
  });

  test('props.enabled initially `true`', () => {
    const {rerender} = render(
      <Tippy content="tooltip" enabled={true}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isEnabled).toBe(true);

    rerender(
      <Tippy content="tooltip" enabled={false}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isEnabled).toBe(false);
  });

  test('props.enabled initially `false`', () => {
    const {rerender} = render(
      <Tippy content="tooltip" enabled={false}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isEnabled).toBe(false);

    rerender(
      <Tippy content="tooltip" enabled={true}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isEnabled).toBe(true);
  });

  test('props.visible initially `true`', () => {
    const {rerender} = render(
      <Tippy content="tooltip" visible={true}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isVisible).toBe(true);

    rerender(
      <Tippy content="tooltip" visible={false}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isVisible).toBe(false);
  });

  test('props.visible initially `false`', () => {
    const {rerender} = render(
      <Tippy content="tooltip" visible={false}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isVisible).toBe(false);

    rerender(
      <Tippy content="tooltip" visible={true}>
        <button />
      </Tippy>,
    );

    expect(instance.state.isVisible).toBe(true);
  });

  test('props.plugins', () => {
    const plugins = [{fn: () => ({})}];

    render(
      <Tippy content="tooltip" plugins={plugins}>
        <button />
      </Tippy>,
    );

    expect(instance.plugins).toEqual(plugins);
  });
});

describe('Tippy.propTypes', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('is defined if NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';

    const Tippy = require('../src/Tippy').Tippy;
    expect(Tippy.propTypes).toBeDefined();
  });

  test('is undefined if NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';

    const Tippy = require('../src/Tippy').Tippy;
    expect(Tippy.propTypes).toBeUndefined();
  });
});
