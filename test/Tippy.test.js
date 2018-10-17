import React from 'react'
import Tippy from '../src/Tippy'
import { mount } from 'enzyme'
import ReactDOMServer from 'react-dom/server'

describe('<Tippy />', () => {
  test('renders only the child element', () => {
    const wrapper = mount(
      <Tippy content="tooltip">
        <button />
      </Tippy>
    )
    expect(
      wrapper
        .children()
        .first()
        .equals(<button />)
    ).toBe(true)
    wrapper.unmount()
  })

  test('adds a tippy instance to the child node', () => {
    const wrapper = mount(
      <Tippy content="tooltip">
        <button />
      </Tippy>
    )
    expect(wrapper.getDOMNode()._tippy).toBeDefined()
    wrapper.unmount()
  })

  test('calls onCreate() on mount, passing the instance back', () => {
    const spy = jest.fn()
    const wrapper = mount(
      <div>
        <Tippy onCreate={spy} content="tooltip">
          <button>Hello</button>
        </Tippy>
      </div>
    )
    expect(spy.mock.calls.length).toBe(1)
    const arg = spy.mock.calls[0][0]
    expect(arg.popper).toBeDefined()
    expect(arg.reference).toBeDefined()
    wrapper.unmount()
  })

  test('renders JSX inside content prop', () => {
    const wrapper = mount(
      <div>
        <Tippy content={<strong />}>
          <button />
        </Tippy>
      </div>
    )
    expect(
      wrapper
        .find('button')
        .getDOMNode()
        ._tippy.popperChildren.content.querySelector('strong')
    ).not.toBe(null)
    wrapper.unmount()
  })

  test('unmount destroys the tippy instance and allows garbage collection', () => {
    const wrapper = mount(
      <div>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </div>
    )
    const tip = wrapper.find('button').getDOMNode()._tippy
    expect(tip.state.isDestroyed).toBe(false)
    wrapper
      .find(Tippy)
      .instance()
      .componentWillUnmount()
    expect(tip.state.isDestroyed).toBe(true)
    wrapper.unmount()
  })

  test('updating state updates the tippy instance', done => {
    class App extends React.Component {
      state = { arrow: false }
      render() {
        return (
          <Tippy content="tooltip" arrow={this.state.arrow}>
            <button onClick={() => this.setState({ arrow: true })} />
          </Tippy>
        )
      }
    }
    const wrapper = mount(<App />)
    const instance = wrapper.getDOMNode()._tippy
    expect(instance.props.arrow).toBe(false)
    wrapper.setState({ arrow: true }, () => {
      expect(instance.props.arrow).toBe(true)
      wrapper.unmount()
      done()
    })
  })

  test('component as a child', () => {
    class Button extends React.Component {
      render() {
        return <button>My button</button>
      }
    }
    const wrapper = mount(
      <div>
        <Tippy content="tooltip">
          <Button />
        </Tippy>
      </div>
    )
    expect(wrapper.find(Tippy).getDOMNode()._tippy).toBeDefined()
    wrapper.unmount()
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
