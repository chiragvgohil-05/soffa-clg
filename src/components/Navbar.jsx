import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import '../styles/Navbar.css';
import apiStore from "../apiClient";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import Logo from '../assets/Untitled design (1).png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [user   , setUser] = useState(null);
    const { cart } = useCart();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);
    const toggleSearch = () => setSearchOpen(!searchOpen);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Add your search logic here
        setSearchQuery('');
        setSearchOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const handleToggleDropdown = () => setDropdownOpen(!dropdownOpen);

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

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setMenuOpen(false);
                setSearchOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <nav className="navbar">
                <div className="navbar-left">
                    <div className="logo">
                        <img src={Logo} alt=""/>
                    </div>
                    <div className="hamburger" onClick={toggleMenu}>
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </div>
                </div>

                <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <li><NavLink to="/" end className="nav-item" onClick={closeMenu}>Home</NavLink></li>
                    <li><NavLink to="/shop" className="nav-item" onClick={closeMenu}>Shop</NavLink></li>
                    <li><NavLink to="/contact" className="nav-item" onClick={closeMenu}>Contact</NavLink></li>

                    {/* Mobile-only items */}
                    {isMobile && (
                        <>
                            <li className="mobile-search">
                                    <button type="submit">
                                        <FaSearch />
                                    </button>
                            </li>
                            <li className="mobile-only-icons">
                                {user ? (
                                    <div className="dropdown-wrapper" ref={dropdownRef}>
                                        <div className="user-profile" onClick={handleToggleDropdown}>
                                            <img
                                                className="user-avatar"
                                                src={user.image || "https://via.placeholder.com/40"}
                                                alt="User"
                                            />
                                            {/*<span className="user-name">{user.name} ▾</span>*/}
                                        </div>
                                        {dropdownOpen && (
                                            <div className="dropdown-menu">
                                                <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>Profile</button>
                                                <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink to="/login" className="icon-link" onClick={closeMenu}>
                                        <FaUser className="icon" title="Register" />
                                    </NavLink>
                                )}
                                {/*<NavLink to="/cart" className="icon-link" onClick={closeMenu}>*/}
                                {/*    <FaShoppingCart className="icon" title="Cart" />*/}
                                {/*</NavLink>*/}
                                <NavLink to="/cart" className="icon-link" onClick={closeMenu}>
                                    <FaShoppingCart className="icon" title="Cart" />
                                    {cart?.items?.length > 0 && (
                                        <span className="cart-count">{cart?.items?.length}</span>
                                    )}
                                </NavLink>
                                <NavLink  className="icon-link"to="/product/search" onClick={closeMenu}>
                                    <FaSearch />
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>

                {/* Desktop-only items */}
                {!isMobile && (
                    <div className="navbar-right">
                        <NavLink to="product/search" className="icon-link">
                            <FaSearch className="user-search-icon"/>
                        </NavLink>

                        {user ? (
                            <div className="dropdown-wrapper" ref={dropdownRef}>
                                <div className="user-profile" onClick={handleToggleDropdown}>
                                    <img
                                        className="user-avatar"
                                        src={user.image || "https://via.placeholder.com/40"}
                                        alt="User"
                                    />
                                    {/*<span className="user-name">{user.name} ▾</span>*/}
                                </div>
                                {dropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate("/profile"); }}>Profile</button>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink to="/login" className="icon-link">
                                <FaUser className="icon" title="Register" />
                            </NavLink>
                        )}

                        <NavLink to="/cart" className="icon-link">
                            <FaShoppingCart className="icon" title="Cart" />
                            {cart?.items?.length > 0 && (
                                <span className="cart-count">{cart?.items?.length}</span>
                            )}
                        </NavLink>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
