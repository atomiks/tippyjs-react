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
})
