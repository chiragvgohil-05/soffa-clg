import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Products from './pages/Products/Products';
import Settings from './pages/Settings';
import './styles/admin.css';
import ProductCreate from "./pages/Products/ProductCreate";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile) {
                setCollapsed(false);
                setMobileSidebarOpen(false);
            } else {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setMobileSidebarOpen(prev => !prev);
        } else {
            setCollapsed(prev => !prev);
        }
    };

    const closeMobileSidebar = () => {
        if (isMobile) {
            setMobileSidebarOpen(false);
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <Sidebar
                collapsed={isMobile ? false : collapsed}
                toggleSidebar={toggleSidebar}
                mobileOpen={isMobile && mobileSidebarOpen}
                closeMobileSidebar={closeMobileSidebar}
            />

            {/* Overlay for mobile */}
            {isMobile && mobileSidebarOpen && (
                <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>
            )}

            {/* Main Content */}
            <div
                className="admin-main"
                style={{
                    marginLeft: isMobile ? 0 : collapsed ? '70px' : '240px'
                }}
            >
                <Topbar toggleSidebar={toggleSidebar} />

                <div className="admin-content">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="products" element={<Products />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="products/create" element={<ProductCreate />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
