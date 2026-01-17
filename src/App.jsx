import { useState } from 'react'
import ScrollImage from './components/scroll-image/scroll-image'
import Header from './components/header/header'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header />
        <ScrollImage />
      </div>
    </>
  )
}

export default App
