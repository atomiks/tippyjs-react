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

  function initialIsEnabledAs(bool) {
    return class extends React.Component {
      state = {
        isEnabled: bool
      }
      render() {
        return (
          <Tippy content="tooltip" isEnabled={this.state.isEnabled}>
            <button />
          </Tippy>
        )
      }
    }
  }

  test('props.isEnabled true initially', done => {
    const EnabledInit = initialIsEnabledAs(true)
    const enabledWrapper = mount(<EnabledInit />)
    const enabledTip = enabledWrapper.getDOMNode()._tippy

    expect(enabledTip.state.isEnabled).toBe(true)

    enabledWrapper.setState({ isEnabled: true }, () => {
      expect(enabledTip.state.isEnabled).toBe(true)
      enabledWrapper.setState({ isEnabled: false }, () => {
        expect(enabledTip.state.isEnabled).toBe(false)
        enabledWrapper.unmount()
        done()
      })
    })
  })

  test('props.isEnabled false initially', done => {
    const DisabledInit = initialIsEnabledAs(false)
    const disabledWrapper = mount(<DisabledInit />)
    const disabledTip = disabledWrapper.getDOMNode()._tippy

    expect(disabledTip.state.isEnabled).toBe(false)

    disabledWrapper.setState({ isEnabled: false }, () => {
      expect(disabledTip.state.isEnabled).toBe(false)
      disabledWrapper.setState({ isEnabled: true }, () => {
        expect(disabledTip.state.isEnabled).toBe(true)
        disabledWrapper.unmount()
        done()
      })
    })
  })

  function initialIsVisibleAs(bool) {
    return class extends React.Component {
      state = {
        isVisible: bool
      }
      render() {
        return (
          <Tippy
            content="tooltip"
            trigger="manual"
            isVisible={this.state.isVisible}
          >
            <button />
          </Tippy>
        )
      }
    }
  }

  test('props.isVisible true initially', done => {
    const VisibleInit = initialIsVisibleAs(true)
    const visibleWrapper = mount(<VisibleInit />)
    const visibleTip = visibleWrapper.getDOMNode()._tippy

    expect(visibleTip.state.isVisible).toBe(true)

    visibleWrapper.setState({ isVisible: true }, () => {
      expect(visibleTip.state.isVisible).toBe(true)
      visibleWrapper.setState({ isVisible: false }, () => {
        expect(visibleTip.state.isVisible).toBe(false)
        done()
      })
    })
  })

  test('props.isVisible false initially', done => {
    const HiddenInit = initialIsVisibleAs(false)
    const hiddenWrapper = mount(<HiddenInit />)
    const hiddenTip = hiddenWrapper.getDOMNode()._tippy

    expect(hiddenTip.state.isVisible).toBe(false)

    hiddenWrapper.setState({ isVisible: false }, () => {
      expect(hiddenTip.state.isVisible).toBe(false)
      hiddenWrapper.setState({ isVisible: true }, () => {
        expect(hiddenTip.state.isVisible).toBe(true)
        done()
      })
    })
  })
})
