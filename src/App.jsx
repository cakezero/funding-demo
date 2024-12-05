import Home from './components/Home'
import NFT from './components/NFT'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/nft" element={<NFT />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
