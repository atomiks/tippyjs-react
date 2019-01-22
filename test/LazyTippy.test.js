import React from 'react'
import { LazyTippy } from '../src'
import ReactDOMServer from 'react-dom/server'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait
} from 'react-testing-library'

afterEach(cleanup)

describe('<LazyTippy />', () => {
  test('tooltip content is not rendered before show', () => {
    class Content extends React.Component {
      render() {
        throw new Error('don`t need render')
        return ''
      }
    }

    render(
      <LazyTippy content={<Content />}>
        <button />
      </LazyTippy>
    )
  })

  test('tooltip content is rendered after trigger', async done => {
    const Content = () => <span data-testid="content">Tooltip</span>

    const onShow = jest.fn()
    const onHidden = jest.fn()

    const { container, getByTestId } = render(
      <LazyTippy
        duration={[0, 0]}
        trigger="click"
        onHidden={onHidden}
        onShow={onShow}
        content={<Content />}
      >
        <button />
      </LazyTippy>
    )

    const button = container.querySelector('button')
    const tip = button._tippy
    fireEvent.click(button)
    await waitForElement(() => getByTestId('content'))
    fireEvent.click(button)

    expect(onShow).toBeCalledTimes(1)
    expect(onShow).toBeCalledWith(tip)
    await wait(() => [
      expect(onHidden).toBeCalledTimes(1),
      expect(onHidden).toBeCalledWith(tip)
    ])
    done()
  })

  test('tooltip content is rendered after trigger without callbacks', async done => {
    const Content = () => <span data-testid="content">Tooltip</span>

    const { container, getByTestId } = render(
      <LazyTippy duration={[0, 0]} trigger="click" content={<Content />}>
        <button />
      </LazyTippy>
    )

    const button = container.querySelector('button')
    const tip = button._tippy
    fireEvent.click(button)
    await waitForElement(() => getByTestId('content'))
    fireEvent.click(button)
    done()
  })
})
