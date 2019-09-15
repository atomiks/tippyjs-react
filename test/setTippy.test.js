import React from 'react'
import Tippy, { tippy, setTippy } from '../src/Tippy'
import { render, cleanup } from '@testing-library/react'
import enhance, { followCursor } from 'tippy.js/extra-props'

afterEach(cleanup)

describe('setTippy()', () => {
  test('without being called', () => {
    const spy = jest.spyOn(console, 'warn')

    render(
      <Tippy content="tooltip" followCursor={true}>
        <button />
      </Tippy>,
    )

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  test('<Tippy /> uses enhanced tippy', () => {
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
