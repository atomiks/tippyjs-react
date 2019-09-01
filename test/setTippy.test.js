import React from 'react'
import enhance, { followCursor } from 'tippy.js/extra-props'
import Tippy, { tippy, setTippy } from '../src'
import { render, cleanup } from '@testing-library/react'

afterEach(cleanup)

describe('setTippy()', () => {
  it('not called with enhanced tippy', () => {
    const spy = jest.spyOn(console, 'warn')

    render(
      <Tippy content="tooltip" followCursor={true}>
        <button />
      </Tippy>,
    )

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('called with enhanced tippy', () => {
    setTippy(enhance(tippy, [followCursor]))

    const spy = jest.spyOn(console, 'warn')

    render(
      <Tippy content="tooltip" followCursor={true}>
        <button />
      </Tippy>,
    )

    expect(spy).not.toHaveBeenCalled()

    spy.mockRestore()
  })
})
