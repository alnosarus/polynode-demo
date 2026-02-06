import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Index from './pages/Index'
import Explore from './pages/Explore'

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Index />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
