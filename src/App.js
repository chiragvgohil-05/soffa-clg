import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Register from './pages/Register';
import MainLayout from './MainLayout';
import Login from "./pages/Login";
import AdminLayout from "./admin/AdminLayout";
import ProductPage from "./pages/ProductPage";
import ErrorPage from "./pages/ErrorPage"; // Import the ErrorPage
import { Toaster } from 'react-hot-toast';
import ProfilePage from "./pages/ProfilePage";
import { CartProvider } from "./context/CartContext";
import SearchPage from "./components/SearchPage";

function App() {
    const [auth, setAuth] = useState({
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
    });

    // Helper to update auth after login/logout
    const updateAuth = () => {
        setAuth({
            token: localStorage.getItem("token"),
            role: localStorage.getItem("role")
        });
    };

    return (
        <CartProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login onLogin={updateAuth} />} />
                    <Route path="/register" element={<Register />} />

                    {/* Admin routes */}
                    <Route
                        path="/admin/*"
                        element={
                            auth.token && auth.role === "Admin"
                                ? <AdminLayout />
                                : <Navigate to="/login" replace />
                        }
                    />

                    {/* User & Admin routes */}
                    <Route
                        element={
                            auth.token && (auth.role === "User" || auth.role === "Admin")
                                ? <MainLayout />
                                : <Navigate to="/login" replace />
                        }
                    >
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/product/search" element={<SearchPage />} />
                    </Route>

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
            <Toaster position="top-right" reverseOrder={false} />
        </CartProvider>
    );
}

export default App;