import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { InputProvider } from './context/input_context'
import { GlobalUserProvider } from './context/global_user_context'
import { GlobalProvider } from './context/global_context'

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <GlobalUserProvider>
        <InputProvider>
          <App />
        </InputProvider>
      </GlobalUserProvider>
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
