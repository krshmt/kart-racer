import { useState } from 'react'
import ScrollImage from './components/scroll-image/scroll-image'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ScrollImage />
      </div>
    </>
  )
}

export default App
