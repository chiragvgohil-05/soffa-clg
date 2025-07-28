import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Register from './pages/Register';
import MainLayout from './MainLayout';
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLayout from "./admin/AdminLayout";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Login/>} path='login'></Route>
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/*" element={<AdminLayout />} />
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
