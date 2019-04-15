import React from 'react'
import Tippy, { TippyGroup } from '../src'
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('<TippyGroup />', () => {
  test('renders without crashing', () => {
    render(
      <TippyGroup>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="tooltip">
          <button />
        </Tippy>
      </TippyGroup>,
    )
  })

  test('indicates the instances have been grouped', done => {
    function App() {
      const ref = React.useRef()

      React.useEffect(() => {
        // _originalProps is added by tippy.group(), we're relying on it not
        // changing in tippy.js implementation
        expect(ref.current._tippy._originalProps).toBeDefined()
        done()
      }, [])

      return (
        <TippyGroup>
          <Tippy content="tooltip">
            <button ref={ref} />
          </Tippy>
          <Tippy content="tooltip">
            <button />
          </Tippy>
        </TippyGroup>
      )
    }

    render(<App />)
  })

  test('preserves onCreate() prop', done => {
    function App() {
      function onCreate(instance) {
        expect(instance.popper).toBeDefined()
        done()
      }

      return (
        <TippyGroup>
          <Tippy content="tooltip" onCreate={onCreate}>
            <button />
          </Tippy>
          <Tippy content="tooltip">
            <button />
          </Tippy>
        </TippyGroup>
      )
    }

    render(<App />)
  })

  test('props are updateable', () => {
    const delay = 1000
    const nextDelay = 500
    const { container, rerender } = render(
      <TippyGroup delay={delay}>
        <Tippy content="toolip">
          <button />
        </Tippy>
        <Tippy content="toolip">
          <button />
        </Tippy>
      </TippyGroup>,
    )
    const instance = container.querySelector('button')._tippy
    expect(instance.props.delay).toBe(delay)
    rerender(
      <TippyGroup delay={nextDelay}>
        <Tippy content="tooltip">
          <button />
        </Tippy>
        <Tippy content="toolip">
          <button />
        </Tippy>
      </TippyGroup>,
    )
    expect(instance.props.delay).toBe(nextDelay)
  })
})
