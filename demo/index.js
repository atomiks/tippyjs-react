import React from 'react'
import ReactDOM from 'react-dom'
import Tippy from '../src'
import './index.css'

function App() {
  return (
    <Tippy content="Tooltip">
      <button>Hello</button>
    </Tippy>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
