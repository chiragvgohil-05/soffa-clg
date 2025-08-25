import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Register from './pages/Register';
import MainLayout from './MainLayout';
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLayout from "./admin/AdminLayout";
import ProductPage from "./pages/ProductPage";
import { Toaster } from 'react-hot-toast';

function App() {
    // simple auth check
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    return (
        <>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login/>} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Admin routes (only if logged in & role=Admin) */}
                    <Route
                        path="/admin/*"
                        element={
                            token && role === "Admin"
                                ? <AdminLayout />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* User & Admin routes */}
                    <Route
                        element={
                            token && (role === "User" || role === "Admin")
                                ? <MainLayout />
                                : <Navigate to="/login" replace />
                        }
                    >
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                    </Route>
                </Routes>
            </Router>
            <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}

export default App;
