import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Account from './pages/Account';

function App() {
    return (
        <>
            <Router>
                <Navbar />
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/account" element={<Account />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
