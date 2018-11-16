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
      </Tippy>
    )
    expect(stringContent.container.innerHTML).toBe('<button></button>')
    const reactElementContent = render(
      <Tippy content={<div>tooltip</div>}>
        <button />
      </Tippy>
    )
    expect(reactElementContent.container.innerHTML).toBe('<button></button>')
  })

  test('adds a tippy instance to the child node', () => {
    const { container } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('calls onCreate() on mount, passing the instance back', () => {
    const spy = jest.fn()
    render(
      <Tippy content="tooltip" onCreate={spy}>
        <button />
      </Tippy>
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
      </Tippy>
    )
    const tip = container.querySelector('button')._tippy
    expect(tip.popper.querySelector('strong')).not.toBeNull()
  })

  test('unmount destroys the tippy instance and allows garbage collection', () => {
    const { container, unmount } = render(
      <Tippy content="tooltip">
        <button />
      </Tippy>
    )
    const button = container.querySelector('button')
    unmount()
    expect(button._tippy).toBeUndefined()
  })

  test('updating state updates the tippy instance', done => {
    class App extends React.Component {
      state = { arrow: false, interactive: false }
      componentDidUpdate() {
        expect(tip.props.arrow).toBe(true)
        expect(tip.props.interactive).toBe(true)
        done()
      }
      render() {
        const { arrow, interactive } = this.state
        return (
          <Tippy content="tooltip" arrow={arrow} interactive={interactive}>
            <button
              onClick={() => this.setState({ arrow: true, interactive: true })}
            />
          </Tippy>
        )
      }
    }
    const { container } = render(<App />)
    const button = container.querySelector('button')
    const tip = button._tippy
    expect(tip.props.arrow).toBe(false)
    expect(tip.props.interactive).toBe(false)
    fireEvent.click(button)
  })

  test('component as a child', () => {
    const Child = () => <button />
    const { container } = render(
      <Tippy content="tooltip">
        <Child />
      </Tippy>
    )
    expect(container.querySelector('button')._tippy).toBeDefined()
  })

  test('tooltip content is not rendered to the DOM', () => {
    expect(
      ReactDOMServer.renderToString(
        <Tippy content={<div>Tooltip</div>}>
          <button />
        </Tippy>
      ).includes('<div>Tooltip</div>')
    ).toBe(false)
  })
})
