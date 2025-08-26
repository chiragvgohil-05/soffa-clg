import React, { useState, useRef, useEffect } from 'react';
import '../styles/topbar.css';
import soffa from '../../assets/soffa.jpg';
import {useNavigate} from "react-router-dom";
import apiStore from "../../apiClient";
import toast from "react-hot-toast";

const Topbar = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const [user   , setUser] = useState(null);

    const handleToggle = () => setDropdownOpen(!dropdownOpen);

    const fetchProfile = async () => {
        try {
            const res = await apiStore.get("/auth/profile");
            setUser((prev) => ({
                ...prev,
                name: res.data.data.name,
                email: res.data.data.email,
                image: res.data.data.image || null,
                preview: res.data.data.image || "",
            }));
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile", { id: "profile-toast" });
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/login";
    }

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <h1 className="topbar-title">Admin Panel</h1>
            </div>

            <div className="topbar-right" ref={dropdownRef}>
                <div className="user-profile" onClick={handleToggle}>
                    <img className="user-avatar" src={user?.image} alt="User" />
                    {/*<span className="user-name">John Doe ▾</span>*/}
                </div>

                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate('/admin/admin-profile');
                            }}
                        >
                            Profile
                        </button>
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                setDropdownOpen(false);
                                onLogout();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
