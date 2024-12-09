import Home from './components/Home'
import NFT from './components/NFT'
import Balance from './components/Balance';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/nft" element={<NFT />} />
        <Route path="/" element={<Home />} />
        <Route path='/bb' element={<Balance />} />
      </Routes>
    </Router>
  )
}

export default App
