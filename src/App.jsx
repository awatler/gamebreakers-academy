import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Team from './pages/Team'
import SummerClinic from './pages/SummerClinic'
import FallClinic from './pages/FallClinic'
import Donate from './pages/Donate'
import Privacy from './pages/Privacy'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/summer-clinic-2026" element={<SummerClinic />} />
        <Route path="/fall-clinic-2026" element={<FallClinic />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Layout>
  )
}

export default App
