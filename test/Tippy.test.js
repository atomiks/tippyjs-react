import React from 'react'
import Tippy from '../src/Tippy'
import ReactDOMServer from 'react-dom/server'
import { render, fireEvent, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('<Tippy />', () => {
  test('renders only the child element', () => {
    const stringContent = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    expect(stringContent.container.innerHTML).toBe('<button></button>')
    const reactElementContent = render(
      <Tippy content={<div>tooltip</div>}>
        <button />
      </Tippy>,
    )
    expect(reactElementContent.container.innerHTML).toBe('<button></button>')
  })

  test('adds a tippy instance to the child node', () => {
    const { container } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('calls onCreate() on mount, passing the instance back', () => {
    const spy = jest.fn()
    render(
      <Tippy content="tooltip" onCreate={spy}>
        <button />
      </Tippy>,
    )
    expect(spy).toHaveBeenCalledTimes(1)
    const arg = spy.mock.calls[0][0]
    expect(arg.reference).toBeDefined()
    expect(arg.popper).toBeDefined()
  })

  test('renders react element content inside the content prop', () => {
    const { container } = render(
      <Tippy content={<strong>tooltip</strong>}>
        <button />
      </Tippy>,
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector('strong')).not.toBeNull()
  })

  test('custom class name get added to DOM', () => {
    const className = 'hello'
    const { container } = render(
      <Tippy content="tip content" className={className}>
        <button />
      </Tippy>,
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector(`.${className}`)).not.toBeNull()
  })

  test('custom class name get added to DOM', () => {
    const classNames = 'hello world'
    const { container } = render(
      <Tippy content="tip content" className={classNames}>
        <button />
      </Tippy>,
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector('.hello')).not.toBeNull()
    expect(tip.popper.querySelector('.world')).not.toBeNull()
  })

  test('unmount destroys the tippy instance and allows garbage collection', () => {
    const { container, unmount } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>,
    )
    const button = container.querySelector('button')
    unmount()
    expect(button._tippy).toBeUndefined()
  })

  test('updating state updates the tippy instance', done => {
    function App() {
      const [arrow, setArrow] = React.useState(false)
      const [interactive, setInteractive] = React.useState(false)
      const ref = React.useRef()

      React.useEffect(() => {
        const instance = ref.current._tippy
        expect(instance.props.arrow).toBe(arrow)
        expect(instance.props.interactive).toBe(interactive)
        done()
      })

      function handleClick() {
        setArrow(true)
        setInteractive(true)
      }

      return (
        <Tippy content="tooltip" arrow={arrow} interactive={interactive}>
          <button ref={ref} onClick={handleClick} />
        </Tippy>
      )
    }

    const { container } = render(<App />)
    const button = container.querySelector('button')
    fireEvent.click(button)
  })

  test('component as a child', () => {
    const Child = React.forwardRef(function Comp(_, ref) {
      return <button ref={ref} />
    })
    const { container } = render(
      <Tippy content="tooltip">
        <Child />
      </Tippy>,
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('tooltip content is not rendered to the DOM', () => {
    expect(
      ReactDOMServer.renderToString(
        <Tippy content={<div>Tooltip</div>}>
          <button />
        </Tippy>,
      ).includes('<div>Tooltip</div>'),
    ).toBe(false)
  })

  test('refs are preserved on the child', done => {
    class App extends React.Component {
      refObject = React.createRef()
      componentDidMount() {
        expect(this.callbackRef instanceof Element).toBe(true)
        expect(this.refObject.current instanceof Element).toBe(true)
        done()
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
        )
      }
    }
    render(<App />)
  })

  test('nesting', () => {
    render(
      <Tippy content="tooltip" placement="bottom" multiple>
        <Tippy content="tooltip" placement="left" multiple>
          <Tippy content="tooltip">
            <button>Text</button>
          </Tippy>
        </Tippy>
      </Tippy>,
    )
  })

  test('props.isEnabled initially `true`', done => {
    booleanPropsBoilerplate('isEnabled', true, done)
  })

  test('props.isEnabled initially `false`', done => {
    booleanPropsBoilerplate('isEnabled', false, done)
  })

  test('props.isVisible initially `true`', done => {
    booleanPropsBoilerplate('isVisible', true, done)
  })

  test('props.isVisible initially `false`', done => {
    booleanPropsBoilerplate('isVisible', false, done)
  })
})

// ************************************************************

function booleanPropsBoilerplate(prop, bool, done) {
  function App() {
    const [value, setValue] = React.useState(bool)
    const ref = React.useRef()
    const passes = React.useRef(0)

    React.useEffect(() => {
      const instance = ref.current._tippy
      expect(instance.state[prop]).toBe(value)

      passes.current++

      if (passes.current === 2) {
        done()
      }
    })

    function handleClick() {
      setValue(!bool)
    }

    const props = {
      [prop]: value,
    }

    return (
      <Tippy content="tooltip" {...props}>
        <button ref={ref} onClick={handleClick} />
      </Tippy>
    )
  }

  const { container } = render(<App />)
  const button = container.querySelector('button')
  fireEvent.click(button)
}
