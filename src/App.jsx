import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Index from './pages/Index'
import Explore from './pages/Explore'
import Demo from './pages/Demo'

function App() {
  const location = useLocation()
  const isDemo = location.pathname === '/demo'

  return (
    <div className="app-container">
      {!isDemo && <Navbar />}
      {isDemo ? (
        <Routes>
          <Route path="/demo" element={<Demo />} />
        </Routes>
      ) : (
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </main>
      )}
    </div>
  )
}

export default App
