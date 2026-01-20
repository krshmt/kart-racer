import { useState } from 'react'
import Home from './pages/home'
import Header from './components/header/header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header />
        <Home></Home>
      </div>
    </>
  )
}

export default App
