import React from 'react'
import Tippy from '../src/Tippy'
import { render, cleanup } from '@testing-library/react'

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
    const instance = container.querySelector('button')._tippy
    expect(instance.popper.querySelector('strong')).not.toBeNull()
  })

  test('props.className: single name is added to tooltip', () => {
    const className = 'hello'
    const { container } = render(
      <Tippy content="tooltip" className={className}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.popper.querySelector(`.${className}`)).not.toBeNull()
  })

  test('props.className: multiple names are added to tooltip', () => {
    const classNames = 'hello world'
    const { container } = render(
      <Tippy content="tooltip" className={classNames}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.popper.querySelector('.hello')).not.toBeNull()
    expect(instance.popper.querySelector('.world')).not.toBeNull()
  })

  test('props.className: extra whitespace is ignored', () => {
    const className = ' hello world  '
    const { container } = render(
      <Tippy content="tooltip" className={className}>
        <button />
      </Tippy>,
    )
    const { tooltip } = container.querySelector('button')._tippy.popperChildren
    expect(tooltip.className).toBe('tippy-tooltip dark-theme hello world')
  })

  test('props.className: updating does not leave stale className behind', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" className="one">
        <button />
      </Tippy>,
    )
    const { tooltip } = container.querySelector('button')._tippy.popperChildren
    expect(tooltip.classList.contains('one')).toBe(true)
    rerender(
      <Tippy content="tooltip" className="two">
        <button />
      </Tippy>,
    )
    expect(tooltip.classList.contains('one')).toBe(false)
    expect(tooltip.classList.contains('two')).toBe(true)
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

  test('updating children destroys old instance and creates new one', () => {
    const Button = (_, ref) => <button ref={ref} />
    const Main = (_, ref) => <main ref={ref} />
    const Component1 = React.forwardRef(Button)
    const Component2 = React.forwardRef(Main)

    const { container, rerender } = render(
      <Tippy content="tooltip">
        <div />
      </Tippy>,
    )
    const div = container.querySelector('div')
    rerender(
      <Tippy content="tooltip">
        <span />
      </Tippy>,
    )
    const span = container.querySelector('span')
    expect(div._tippy).toBeUndefined()
    expect(span._tippy).toBeDefined()
    rerender(
      <Tippy content="tooltip">
        <Component1 />
      </Tippy>,
    )
    const button = container.querySelector('button')
    expect(span._tippy).toBeUndefined()
    expect(button._tippy).toBeDefined()
    rerender(
      <Tippy content="tooltip">
        <Component2 />
      </Tippy>,
    )
    expect(button._tippy).toBeUndefined()
    expect(container.querySelector('main')._tippy).toBeDefined()
  })

  test('updating props updates the tippy instance', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" arrow={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.props.arrow).toBe(false)
    rerender(
      <Tippy content="tooltip" arrow={true}>
        <button />
      </Tippy>,
    )
    expect(instance.props.arrow).toBe(true)
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
      <Tippy content="tooltip" placement="bottom" isVisible>
        <Tippy content="tooltip" placement="left" isVisible>
          <Tippy content="tooltip" isVisible>
            <button>Text</button>
          </Tippy>
        </Tippy>
      </Tippy>,
    )
    expect(document.querySelectorAll('.tippy-popper').length).toBe(3)
  })

  test('props.enabled initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" enabled={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(true)
    rerender(
      <Tippy content="tooltip" enabled={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(false)
  })

  test('props.isEnabled initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isEnabled={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(true)
    rerender(
      <Tippy content="tooltip" isEnabled={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(false)
  })

  test('props.enabled initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" enabled={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(false)
    rerender(
      <Tippy content="tooltip" enabled={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(true)
  })

  test('props.isEnabled initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isEnabled={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isEnabled).toBe(false)
    rerender(
      <Tippy content="tooltip" isEnabled={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isEnabled).toBe(true)
  })

  test('props.visible initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" visible={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(true)
    rerender(
      <Tippy content="tooltip" visible={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(false)
  })

  test('props.isVisible initially `true`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isVisible={true}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(true)
    rerender(
      <Tippy content="tooltip" isVisible={false}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(false)
  })

  test('props.visible initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" visible={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(false)
    rerender(
      <Tippy content="tooltip" visible={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(true)
  })

  test('props.isVisible initially `false`', () => {
    const { container, rerender } = render(
      <Tippy content="tooltip" isVisible={false}>
        <button />
      </Tippy>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.state.isVisible).toBe(false)
    rerender(
      <Tippy content="tooltip" isVisible={true}>
        <button />
      </Tippy>,
    )
    expect(instance.state.isVisible).toBe(true)
  })
})
