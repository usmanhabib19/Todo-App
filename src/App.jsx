import { ConfigProvider } from 'antd'
import React from 'react'
import '../src/App.css'
import { ToastContainer } from 'react-toastify'

import Routes from "./pages/Routes"

const App = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1d3557" }, components: { Button: { controlOutline: 0, primaryShadow: "none" } } }}>
      <Routes />
      <ToastContainer />
    </ConfigProvider>
  )
}

export default App